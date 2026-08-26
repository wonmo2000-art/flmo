import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { getSettingsView, removeMcpServer, upsertMcpServer } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  id: z.string().trim().optional(),
  name: z.string().trim().min(1, "이름을 입력하세요.").max(60),
  url: z.string().trim().url("MCP 서버 URL 형식이 올바르지 않습니다."),
  transport: z.enum(["http", "sse"]).default("http"),
  bearerToken: z.string().trim().optional(),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  await upsertMcpServer({
    id: parsed.data.id || randomUUID(),
    name: parsed.data.name,
    url: parsed.data.url,
    transport: parsed.data.transport,
    bearerToken: parsed.data.bearerToken || undefined,
  });

  return NextResponse.json(await getSettingsView());
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "삭제할 서버 ID 가 필요합니다." }, { status: 400 });
  }

  await removeMcpServer(id);
  return NextResponse.json(await getSettingsView());
}
