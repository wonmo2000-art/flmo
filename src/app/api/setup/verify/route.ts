import { NextResponse } from "next/server";
import { z } from "zod";

import { loadCredentials, normalizeAdAccountId } from "@/lib/credentials";
import { MetaApiError } from "@/lib/meta/client";
import { verifyAccount } from "@/lib/meta/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const verifySchema = z.object({
  adAccountId: z.string().trim().optional(),
  accessToken: z.string().trim().optional(),
});

/**
 * 저장하지 않고 연결만 확인한다.
 * 값이 안 넘어오면 이미 저장된 자격증명으로 확인한다 — 리포트 화면의 "연결 상태" 용도.
 */
export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  let { adAccountId, accessToken } = parsed.data;

  if (!adAccountId || !accessToken) {
    const stored = await loadCredentials();
    if (!stored) {
      return NextResponse.json(
        { ok: false, error: "저장된 자격증명이 없습니다. 먼저 설정을 완료하세요." },
        { status: 400 },
      );
    }
    adAccountId ||= stored.adAccountId;
    accessToken ||= stored.accessToken;
  }

  try {
    const account = await verifyAccount(normalizeAdAccountId(adAccountId), accessToken);
    return NextResponse.json({
      ok: true,
      account: { id: account.id, name: account.name, currency: account.currency },
    });
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json(
        { ok: false, error: error.hint, detail: error.message, code: error.payload.code },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
