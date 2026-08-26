import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { clearSection, getSettingsView, updateSection } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  apiKey: z.string().trim().min(10, "API 키가 너무 짧습니다."),
  model: z.string().trim().min(1).default("claude-opus-5"),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { apiKey, model } = parsed.data;

  try {
    // 키가 실제로 동작하는지 가장 싼 호출로 확인한다.
    const client = new Anthropic({ apiKey });
    await client.models.retrieve(model);
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: "API 키가 유효하지 않습니다." }, { status: 400 });
    }
    if (error instanceof Anthropic.NotFoundError) {
      return NextResponse.json(
        { error: `모델 ${model} 을(를) 찾을 수 없습니다. 모델 ID 를 확인하세요.` },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }

  await updateSection("anthropic", { apiKey, model });
  return NextResponse.json(await getSettingsView());
}

export async function DELETE() {
  await clearSection("anthropic");
  return NextResponse.json(await getSettingsView());
}
