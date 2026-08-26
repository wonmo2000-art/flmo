import { NextResponse } from "next/server";
import { z } from "zod";

import { loadCredentials } from "@/lib/credentials";
import { MetaApiError } from "@/lib/meta/client";
import { fetchReport } from "@/lib/meta/insights";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

const querySchema = z.object({
  level: z.enum(["account", "campaign", "adset", "ad"]).default("campaign"),
  datePreset: z
    .enum(["today", "yesterday", "last_7d", "last_14d", "last_30d", "this_month", "last_month"])
    .default("last_7d"),
  since: z.string().regex(DATE).optional(),
  until: z.string().regex(DATE).optional(),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    level: searchParams.get("level") ?? undefined,
    datePreset: searchParams.get("datePreset") ?? undefined,
    since: searchParams.get("since") ?? undefined,
    until: searchParams.get("until") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "조회 조건이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const credentials = await loadCredentials();
  if (!credentials) {
    return NextResponse.json(
      { error: "자격증명이 설정되지 않았습니다.", needsSetup: true },
      { status: 428 },
    );
  }

  // since/until 을 둘 다 준 경우에만 직접 기간을 쓴다. 하나만 오면 프리셋을 유지한다.
  const { level, datePreset, since, until } = parsed.data;
  const range = since && until ? { since, until } : undefined;

  try {
    const report = await fetchReport(credentials, { level, datePreset, range });
    return NextResponse.json(report);
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json({ error: error.hint, detail: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
