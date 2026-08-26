import "server-only";

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
// SDK 의 zodOutputFormat 은 zod v4 스키마를 받는다. zod 3.25 가 제공하는 v4 하위 경로를 쓴다.
import { z } from "zod/v4";

import { COPY_LIMITS } from "../meta/adConstants";
import type { MusinsaProduct } from "../musinsa/types";

import { TONE_GUIDE, type CopyResult, type CopyTone } from "./tones";

const VariantSchema = z.object({
  headline: z.string().describe(`광고 헤드라인. ${COPY_LIMITS.headline}자 이내`),
  message: z.string().describe(`본문 문구. ${COPY_LIMITS.message}자 이내`),
  description: z.string().describe(`링크 설명. ${COPY_LIMITS.description}자 이내`),
  angle: z.string().describe("이 안이 미는 소구점을 한 문장으로"),
});

const ResultSchema = z.object({
  /** 이미지에서 읽어낸 상품 특징. 카피 검토에 쓴다. */
  observed: z.object({
    category: z.string().describe("상품 카테고리 (예: 후드집업, 와이드팬츠)"),
    colors: z.array(z.string()).describe("주요 색상"),
    material: z.string().describe("보이는 소재감"),
    details: z.array(z.string()).describe("눈에 띄는 디테일 (지퍼, 절개, 로고 등)"),
    mood: z.string().describe("전체적인 무드"),
  }),
  variants: z.array(VariantSchema).min(1),
});


export interface GenerateCopyInput {
  apiKey: string;
  model: string;
  /** 광고에 쓸 상품 이미지 (base64, 데이터 URI 접두사 없이). */
  image: { base64: string; mediaType: string };
  product?: Partial<MusinsaProduct>;
  brandName?: string;
  tone: CopyTone;
  variantCount: number;
  /** 반드시 넣어야 하는 문구나 금지어 등. */
  extraInstruction?: string;
}

function buildPrompt(input: GenerateCopyInput): string {
  const lines = [
    "무신사에 입점한 패션 브랜드의 메타(인스타그램·페이스북) 광고 카피를 씁니다.",
    "",
    "먼저 이미지를 보고 상품의 카테고리, 색상, 소재감, 디테일, 무드를 관찰하세요.",
    `그다음 관찰한 내용을 근거로 서로 다른 소구점의 카피 ${input.variantCount}개를 쓰세요.`,
    "",
    "규칙:",
    `- 헤드라인 ${COPY_LIMITS.headline}자, 본문 ${COPY_LIMITS.message}자, 링크 설명 ${COPY_LIMITS.description}자 이내. 공백 포함.`,
    "- 이미지에서 확인되지 않는 사실(소재 혼용률, 원산지, 기능성)은 지어내지 마세요.",
    "- 가격이나 할인율은 아래 상품 정보에 있을 때만 쓰세요.",
    "- '최고', '1위', '유일' 같은 검증 불가한 최상급 표현은 쓰지 마세요. 메타 광고 정책에 걸립니다.",
    "- 신체 부위를 확대하거나 체형을 지적하는 표현은 금지입니다. 메타가 반려합니다.",
    `- 톤: ${TONE_GUIDE[input.tone]}`,
    "- 각 안은 소구점이 겹치지 않아야 합니다.",
  ];

  if (input.brandName) lines.push(`- 브랜드명: ${input.brandName}`);

  const product = input.product;
  if (product?.name || product?.price || product?.brand) {
    lines.push("", "상품 정보:");
    if (product.name) lines.push(`- 상품명: ${product.name}`);
    if (product.brand) lines.push(`- 브랜드: ${product.brand}`);
    if (product.price) lines.push(`- 판매가: ${product.price.toLocaleString("ko-KR")}원`);
    if (product.description) lines.push(`- 페이지 설명: ${product.description}`);
  }

  if (input.extraInstruction) {
    lines.push("", `추가 지시: ${input.extraInstruction}`);
  }

  return lines.join("\n");
}

/** 길이 제한을 넘은 카피는 잘라낸다. 메타가 거부하기 전에 우리가 먼저 맞춘다. */
function clamp(text: string, limit: number): string {
  const trimmed = text.trim();
  return trimmed.length <= limit ? trimmed : `${trimmed.slice(0, limit - 1)}…`;
}

export async function generateAdCopy(input: GenerateCopyInput): Promise<CopyResult> {
  const client = new Anthropic({ apiKey: input.apiKey });

  const response = await client.messages.parse({
    model: input.model,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.image.mediaType as "image/jpeg",
              data: input.image.base64,
            },
          },
          { type: "text", text: buildPrompt(input) },
        ],
      },
    ],
    output_config: { format: zodOutputFormat(ResultSchema) },
  });

  const parsed = response.parsed_output;
  if (!parsed) {
    throw new Error("카피 생성 결과를 해석하지 못했습니다. 다시 시도해 주세요.");
  }

  return {
    observed: parsed.observed,
    variants: parsed.variants.map((variant) => ({
      ...variant,
      headline: clamp(variant.headline, COPY_LIMITS.headline),
      message: clamp(variant.message, COPY_LIMITS.message),
      description: clamp(variant.description, COPY_LIMITS.description),
    })),
  };
}

