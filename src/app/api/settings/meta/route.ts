import { NextResponse } from "next/server";
import { z } from "zod";

import { MetaApiError } from "@/lib/meta/client";
import { verifyAccount } from "@/lib/meta/insights";
import {
  clearSection,
  getSettings,
  getSettingsView,
  normalizeAdAccountId,
  updateSection,
} from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  adAccountId: z
    .string()
    .trim()
    .min(1, "광고 계정 ID 를 입력하세요.")
    .regex(/^(act_)?\d+$/, "광고 계정 ID 는 act_1234567890 형태여야 합니다."),
  accessToken: z.string().trim().optional(),
  pageId: z.string().trim().regex(/^\d*$/, "페이지 ID 는 숫자입니다.").optional(),
  instagramActorId: z.string().trim().regex(/^\d*$/, "인스타그램 계정 ID 는 숫자입니다.").optional(),
  pixelId: z.string().trim().regex(/^\d*$/, "픽셀 ID 는 숫자입니다.").optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const settings = await getSettings();
  const adAccountId = normalizeAdAccountId(parsed.data.adAccountId);
  // 토큰을 비워 보내면 기존 토큰을 유지한다 — 페이지 ID 만 고치려는 경우.
  const accessToken = parsed.data.accessToken || settings.meta?.accessToken;

  if (!accessToken) {
    return NextResponse.json({ error: "액세스 토큰을 입력하세요." }, { status: 400 });
  }

  try {
    const account = await verifyAccount(adAccountId, accessToken);

    await updateSection("meta", {
      adAccountId,
      accessToken,
      accountName: account.name,
      currency: account.currency,
      pageId: parsed.data.pageId || undefined,
      instagramActorId: parsed.data.instagramActorId || undefined,
      pixelId: parsed.data.pixelId || undefined,
    });

    return NextResponse.json(await getSettingsView());
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json({ error: error.hint, detail: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSection("meta");
  return NextResponse.json(await getSettingsView());
}
