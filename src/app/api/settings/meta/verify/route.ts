import { NextResponse } from "next/server";
import { z } from "zod";

import { MetaApiError } from "@/lib/meta/client";
import { verifyAccount } from "@/lib/meta/insights";
import { getSettings, normalizeAdAccountId } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  adAccountId: z.string().trim().optional(),
  accessToken: z.string().trim().optional(),
});

/** 저장하지 않고 연결만 확인한다. 값이 비면 저장된 자격증명으로 확인한다. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "입력값이 올바르지 않습니다." }, { status: 400 });
  }

  const settings = await getSettings();
  const adAccountId = parsed.data.adAccountId || settings.meta?.adAccountId;
  const accessToken = parsed.data.accessToken || settings.meta?.accessToken;

  if (!adAccountId || !accessToken) {
    return NextResponse.json(
      { ok: false, error: "계정 ID 와 토큰이 모두 필요합니다." },
      { status: 400 },
    );
  }

  try {
    const account = await verifyAccount(normalizeAdAccountId(adAccountId), accessToken);
    return NextResponse.json({ ok: true, account });
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json(
        { ok: false, error: error.hint, detail: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: (error as Error).message }, { status: 500 });
  }
}
