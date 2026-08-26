import { NextResponse } from "next/server";
import { z } from "zod";

import {
  clearCredentials,
  getCredentialsSummary,
  normalizeAdAccountId,
  saveCredentials,
} from "@/lib/credentials";
import { MetaApiError } from "@/lib/meta/client";
import { verifyAccount } from "@/lib/meta/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const saveSchema = z.object({
  adAccountId: z
    .string()
    .trim()
    .min(1, "광고 계정 ID 를 입력하세요.")
    .regex(/^(act_)?\d+$/, "광고 계정 ID 는 act_1234567890 형태여야 합니다."),
  accessToken: z.string().trim().min(20, "액세스 토큰이 너무 짧습니다."),
});

/** 현재 저장된 자격증명 요약 (토큰은 마스킹). */
export async function GET() {
  try {
    return NextResponse.json(await getCredentialsSummary());
  } catch (error) {
    return NextResponse.json(
      { configured: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

/** 자격증명을 검증한 뒤 암호화해서 저장한다. */
export async function POST(request: Request) {
  const parsed = saveSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const adAccountId = normalizeAdAccountId(parsed.data.adAccountId);
  const { accessToken } = parsed.data;

  try {
    // 저장 전에 반드시 실제 호출로 확인한다. 잘못된 값을 저장해두면
    // 나중에 리포트 화면에서야 실패하고 원인을 찾기 어려워진다.
    const account = await verifyAccount(adAccountId, accessToken);

    await saveCredentials({
      adAccountId,
      accessToken,
      accountName: account.name,
      currency: account.currency,
    });

    return NextResponse.json(await getCredentialsSummary());
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json({ error: error.hint, detail: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/** 저장된 자격증명을 삭제한다. */
export async function DELETE() {
  await clearCredentials();
  return NextResponse.json({ configured: false });
}
