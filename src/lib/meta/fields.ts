import type { DatePreset, ReportLevel } from "./types";

/** 모든 레벨에서 공통으로 가져오는 지표. */
const BASE_FIELDS = [
  "spend",
  "impressions",
  "reach",
  "clicks",
  "inline_link_clicks",
  "ctr",
  "cpc",
  "cpm",
  "frequency",
  "actions",
  "action_values",
  "purchase_roas",
] as const;

/** 레벨별로 추가되는 식별자 필드. */
const LEVEL_FIELDS: Record<ReportLevel, string[]> = {
  account: ["account_id", "account_name"],
  campaign: ["campaign_id", "campaign_name"],
  adset: ["adset_id", "adset_name", "campaign_name"],
  ad: ["ad_id", "ad_name", "adset_name", "campaign_name"],
};

export function insightsFields(level: ReportLevel): string {
  return [...LEVEL_FIELDS[level], ...BASE_FIELDS].join(",");
}

/**
 * 구매 전환을 셀 때 쓰는 action_type 우선순위.
 * 앞쪽에서 값이 잡히면 뒤는 보지 않는다 — 중복 집계를 막기 위해서다.
 */
export const PURCHASE_ACTION_TYPES = [
  "omni_purchase",
  "offsite_conversion.fb_pixel_purchase",
  "purchase",
] as const;

export const DATE_PRESETS: { value: DatePreset; label: string }[] = [
  { value: "today", label: "오늘" },
  { value: "yesterday", label: "어제" },
  { value: "last_7d", label: "최근 7일" },
  { value: "last_14d", label: "최근 14일" },
  { value: "last_30d", label: "최근 30일" },
  { value: "this_month", label: "이번 달" },
  { value: "last_month", label: "지난 달" },
];

export const REPORT_LEVELS: { value: ReportLevel; label: string }[] = [
  { value: "account", label: "계정 전체" },
  { value: "campaign", label: "캠페인별" },
  { value: "adset", label: "광고세트별" },
  { value: "ad", label: "광고별" },
];
