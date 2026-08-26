import { NextResponse } from "next/server";

import { getSettingsView } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 모든 설정을 마스킹된 형태로 돌려준다. */
export async function GET() {
  try {
    return NextResponse.json(await getSettingsView());
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
