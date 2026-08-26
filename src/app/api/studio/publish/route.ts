import { NextResponse } from "next/server";
import { z } from "zod";

import { MetaApiError } from "@/lib/meta/client";
import { publishAdDraft } from "@/lib/meta/publish";
import { slugifyCampaign, withUtm } from "@/lib/musinsa/url";
import { getSettings, requireMeta } from "@/lib/settings/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** 이미지 업로드 + 객체 4종 생성이라 호출이 여러 번 오간다. */
export const maxDuration = 180;

const schema = z.object({
  campaignName: z.string().trim().min(1, "캠페인 이름을 입력하세요.").max(100),
  objective: z.enum(["traffic", "sales"]),
  dailyBudget: z.number().int().min(1000, "일 예산은 최소 1,000원입니다."),
  landingUrl: z.string().trim().url("랜딩 URL 형식이 올바르지 않습니다."),
  headline: z.string().trim().min(1, "헤드라인을 입력하세요."),
  message: z.string().trim().min(1, "본문 문구를 입력하세요."),
  description: z.string().trim().optional(),
  callToAction: z.string().trim().min(1),
  targeting: z.object({
    countries: z.array(z.string().length(2)).min(1),
    ageMin: z.number().int().min(13).max(65),
    ageMax: z.number().int().min(13).max(65),
    genders: z.array(z.union([z.literal(1), z.literal(2)])).optional(),
  }),
  images: z
    .array(z.object({ filename: z.string(), base64: z.string().min(1) }))
    .min(1, "이미지를 한 장 이상 올려주세요.")
    .max(5, "한 번에 최대 5장까지 만듭니다."),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  if (input.targeting.ageMin > input.targeting.ageMax) {
    return NextResponse.json({ error: "연령 하한이 상한보다 큽니다." }, { status: 400 });
  }

  const settings = await getSettings();

  let meta: { adAccountId: string; accessToken: string };
  try {
    meta = requireMeta(settings);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message, needsSetup: true }, { status: 428 });
  }

  if (!settings.meta?.pageId) {
    return NextResponse.json(
      {
        error: "페이스북 페이지 ID 가 필요합니다. 광고 크리에이티브는 페이지에 귀속됩니다. 설정에서 입력하세요.",
        needsSetup: true,
      },
      { status: 428 },
    );
  }

  // UTM 은 서버에서 붙인다. 클라이언트가 보낸 URL 을 그대로 믿지 않기 위해서다.
  const utm = settings.musinsa;
  const landingUrl = withUtm(input.landingUrl, {
    source: utm?.utmSource ?? "meta",
    medium: utm?.utmMedium ?? "cpc",
    campaign: utm?.utmCampaign || slugifyCampaign(input.campaignName),
    content: slugifyCampaign(input.headline),
  });

  try {
    const result = await publishAdDraft({
      adAccountId: meta.adAccountId,
      accessToken: meta.accessToken,
      pageId: settings.meta.pageId,
      instagramActorId: settings.meta.instagramActorId,
      pixelId: settings.meta.pixelId,
      objective: input.objective,
      campaignName: input.campaignName,
      dailyBudget: input.dailyBudget,
      targeting: input.targeting,
      link: landingUrl,
      message: input.message,
      headline: input.headline,
      description: input.description,
      callToAction: input.callToAction,
      images: input.images,
    });

    return NextResponse.json({ ...result, landingUrl });
  } catch (error) {
    if (error instanceof MetaApiError) {
      return NextResponse.json({ error: error.hint, detail: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
