/** 리포트 조회 단위. Meta 의 level 파라미터와 그대로 대응한다. */
export type ReportLevel = "account" | "campaign" | "adset" | "ad";

/** Meta 가 제공하는 미리 정의된 기간 프리셋 중 자주 쓰는 것들. */
export type DatePreset =
  | "today"
  | "yesterday"
  | "last_7d"
  | "last_14d"
  | "last_30d"
  | "this_month"
  | "last_month";

export interface ReportQuery {
  level: ReportLevel;
  /** datePreset 과 range 중 하나만 쓴다. range 가 있으면 그쪽이 우선. */
  datePreset?: DatePreset;
  range?: { since: string; until: string };
}

/** Meta insights 응답 한 행을 화면에서 쓰기 좋게 정규화한 형태. */
export interface ReportRow {
  id: string;
  name: string;
  status?: string;
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  /** 링크 클릭 (inline_link_clicks) — 실제 랜딩 유입에 가깝다. */
  linkClicks: number;
  ctr: number;
  cpc: number;
  cpm: number;
  frequency: number;
  /** 전환 수 (구매 기준) */
  purchases: number;
  /** 전환 매출 */
  purchaseValue: number;
  /** 광고비 대비 매출 */
  roas: number;
  /** 전환당 비용 */
  costPerPurchase: number;
}

export interface ReportSummary {
  spend: number;
  impressions: number;
  reach: number;
  clicks: number;
  linkClicks: number;
  purchases: number;
  purchaseValue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  roas: number;
  costPerPurchase: number;
}

export interface Report {
  account: { id: string; name?: string; currency: string };
  period: { since: string; until: string; label: string };
  level: ReportLevel;
  summary: ReportSummary;
  rows: ReportRow[];
  generatedAt: string;
}

/** Graph API 가 돌려주는 에러를 그대로 담는다. */
export interface MetaApiErrorPayload {
  message: string;
  type?: string;
  code?: number;
  error_subcode?: number;
  error_user_title?: string;
  error_user_msg?: string;
  fbtrace_id?: string;
}
