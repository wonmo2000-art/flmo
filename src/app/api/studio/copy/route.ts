import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";

import { generateAdCopy } from "@/lib/copy/generate";
import { getSettings } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** 카피 생성은 이미지 분석까지 하므로 기본 타임아웃으로는 모자랄 수 있다. */
export const maxDuration = 120;

const schema = z.object({
  image: z.object({
    base64: z.string().min(1, "이미지가 필요합니다."),
    mediaType: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
  }),
  product: z
    .object({
      name: z.string().optional(),
      brand: z.string().optional(),
      price: z.number().optional(),
      description: z.string().optional(),
    })
    .optional(),
  tone: z.enum(["trendy", "premium", "value", "informative"]).default("trendy"),
  variantCount: z.number().int().min(1).max(5).default(3),
  extraInstruction: z.string().trim().max(500).optional(),
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
  if (!settings.anthropic?.apiKey) {
    return NextResponse.json(
      { error: "Claude API 키가 설정되지 않았습니다. 설정에서 먼저 등록하세요.", needsSetup: true },
      { status: 428 },
    );
  }

  try {
    const result = await generateAdCopy({
      apiKey: settings.anthropic.apiKey,
      model: settings.anthropic.model,
      image: parsed.data.image,
      product: parsed.data.product,
      brandName: settings.musinsa?.brandName,
      tone: parsed.data.tone,
      variantCount: parsed.data.variantCount,
      extraInstruction: parsed.data.extraInstruction,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json(
        { error: "Claude API 호출 한도에 걸렸습니다. 잠시 후 다시 시도하세요." },
        { status: 429 },
      );
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: `Claude API 오류: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
