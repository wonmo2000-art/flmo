import "server-only";

import { OBJECTIVE_MAP, type AdObjective } from "./adConstants";
import { graphPost } from "./client";

export interface TargetingInput {
  /** ISO 국가 코드. 기본 한국. */
  countries: string[];
  ageMin: number;
  ageMax: number;
  /** 1=남성, 2=여성. 비우면 전체. */
  genders?: number[];
}

export interface PublishInput {
  adAccountId: string;
  accessToken: string;
  pageId: string;
  instagramActorId?: string;
  pixelId?: string;

  objective: AdObjective;
  campaignName: string;
  /** 일 예산 (계정 통화의 최소 단위. KRW 는 원 단위). */
  dailyBudget: number;
  targeting: TargetingInput;

  /** 랜딩 URL. UTM 이 이미 붙어 있어야 한다. */
  link: string;
  /** 본문 문구. */
  message: string;
  /** 헤드라인. */
  headline: string;
  /** 링크 설명. */
  description?: string;
  callToAction: string;

  /** 업로드할 이미지들 (base64). 각각이 별도 광고가 된다. */
  images: { filename: string; base64: string }[];
}

export interface PublishedAd {
  adId: string;
  creativeId: string;
  imageHash: string;
  filename: string;
}

export interface PublishResult {
  campaignId: string;
  adSetId: string;
  ads: PublishedAd[];
  /** 광고 관리자에서 바로 열어볼 수 있는 링크. */
  managerUrl: string;
  /** 생성된 객체는 전부 이 상태다. */
  status: "PAUSED";
}

interface AdImageResponse {
  images: Record<string, { hash: string; url: string }>;
}

/** 이미지를 광고 계정 이미지 라이브러리에 올리고 해시를 받는다. */
async function uploadImage(
  adAccountId: string,
  accessToken: string,
  image: { filename: string; base64: string },
): Promise<string> {
  const response = await graphPost<AdImageResponse>({
    path: `${adAccountId}/adimages`,
    accessToken,
    body: { bytes: image.base64 },
  });

  const entry = Object.values(response.images ?? {})[0];
  if (!entry?.hash) {
    throw new Error(`이미지 업로드에 실패했습니다: ${image.filename}`);
  }
  return entry.hash;
}

/**
 * 캠페인 → 광고세트 → 크리에이티브 → 광고를 순서대로 만든다.
 *
 * 생성되는 모든 객체는 PAUSED 다. 이 함수만으로는 절대 노출이 시작되지 않으며,
 * 게재는 광고 관리자에서 사람이 직접 켜야 한다. 의도적인 설계다 —
 * 자동 생성된 광고가 검토 없이 예산을 쓰는 상황을 막는다.
 */
export async function publishAdDraft(input: PublishInput): Promise<PublishResult> {
  const { adAccountId, accessToken } = input;
  const { objective, optimizationGoal } = OBJECTIVE_MAP[input.objective];

  if (input.objective === "sales" && !input.pixelId) {
    throw new Error(
      "전환 최적화(구매)를 쓰려면 픽셀 ID 가 필요합니다. 설정에서 픽셀 ID 를 입력하거나 목표를 트래픽으로 바꾸세요.",
    );
  }
  if (input.images.length === 0) {
    throw new Error("광고 이미지가 최소 한 장 필요합니다.");
  }

  // 1) 이미지 업로드 — 광고 생성 전에 먼저 해서, 실패하면 아무 객체도 안 만들게 한다.
  const uploaded: { filename: string; hash: string }[] = [];
  for (const image of input.images) {
    uploaded.push({ filename: image.filename, hash: await uploadImage(adAccountId, accessToken, image) });
  }

  // 2) 캠페인
  const campaign = await graphPost<{ id: string }>({
    path: `${adAccountId}/campaigns`,
    accessToken,
    body: {
      name: input.campaignName,
      objective,
      status: "PAUSED",
      special_ad_categories: [],
    },
  });

  // 3) 광고세트
  const adSet = await graphPost<{ id: string }>({
    path: `${adAccountId}/adsets`,
    accessToken,
    body: {
      name: `${input.campaignName} - 광고세트`,
      campaign_id: campaign.id,
      daily_budget: Math.round(input.dailyBudget),
      billing_event: "IMPRESSIONS",
      optimization_goal: optimizationGoal,
      bid_strategy: "LOWEST_COST_WITHOUT_CAP",
      status: "PAUSED",
      targeting: {
        geo_locations: { countries: input.targeting.countries },
        age_min: input.targeting.ageMin,
        age_max: input.targeting.ageMax,
        ...(input.targeting.genders?.length ? { genders: input.targeting.genders } : {}),
      },
      ...(input.objective === "sales"
        ? { promoted_object: { pixel_id: input.pixelId, custom_event_type: "PURCHASE" } }
        : {}),
    },
  });

  // 4) 이미지마다 크리에이티브 + 광고. 소재별 성과를 따로 보려면 광고를 나눠야 한다.
  const ads: PublishedAd[] = [];
  for (const [index, image] of uploaded.entries()) {
    const creative = await graphPost<{ id: string }>({
      path: `${adAccountId}/adcreatives`,
      accessToken,
      body: {
        name: `${input.campaignName} - 소재 ${index + 1}`,
        object_story_spec: {
          page_id: input.pageId,
          ...(input.instagramActorId ? { instagram_actor_id: input.instagramActorId } : {}),
          link_data: {
            image_hash: image.hash,
            link: input.link,
            message: input.message,
            name: input.headline,
            ...(input.description ? { description: input.description } : {}),
            call_to_action: { type: input.callToAction, value: { link: input.link } },
          },
        },
      },
    });

    const ad = await graphPost<{ id: string }>({
      path: `${adAccountId}/ads`,
      accessToken,
      body: {
        name: `${input.campaignName} - 광고 ${index + 1}`,
        adset_id: adSet.id,
        creative: { creative_id: creative.id },
        status: "PAUSED",
      },
    });

    ads.push({
      adId: ad.id,
      creativeId: creative.id,
      imageHash: image.hash,
      filename: image.filename,
    });
  }

  return {
    campaignId: campaign.id,
    adSetId: adSet.id,
    ads,
    managerUrl: `https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${adAccountId.replace("act_", "")}&selected_campaign_ids=${campaign.id}`,
    status: "PAUSED",
  };
}

