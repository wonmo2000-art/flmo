import { NextResponse } from "next/server";
import { z } from "zod";

import { probeMcpServer } from "@/lib/mcp/client";
import { getSettings, getSettingsView, upsertMcpServer } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ id: z.string().trim().min(1) });

/** 등록된 MCP 서버에 붙어 도구 목록을 읽고, 결과를 설정에 기록한다. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "서버 ID 가 필요합니다." }, { status: 400 });
  }

  const settings = await getSettings();
  const server = settings.mcp.find((item) => item.id === parsed.data.id);
  if (!server) {
    return NextResponse.json({ error: "등록되지 않은 서버입니다." }, { status: 404 });
  }

  const result = await probeMcpServer(server);

  await upsertMcpServer({
    ...server,
    lastCheck: {
      at: new Date().toISOString(),
      ok: result.ok,
      toolCount: result.ok ? result.tools.length : undefined,
      error: result.error,
    },
  });

  return NextResponse.json({ result, settings: await getSettingsView() });
}
