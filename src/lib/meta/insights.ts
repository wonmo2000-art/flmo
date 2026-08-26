import "server-only";

import type { Credentials } from "../credentials";
import { graphGet, graphGetAll } from "./client";
import { DATE_PRESETS, PURCHASE_ACTION_TYPES, insightsFields } from "./fields";
import type {
  Report,
  ReportLevel,
  ReportQuery,
  ReportRow,
  ReportSummary,
} from "./types";

interface ActionEntry {
  action_type: string;
  value: string;
}

interface RoasEntry {
  action_type: string;
  value: string;
}

/** Graph API insights 원본 행. 숫자도 문자열로 내려온다. */
interface RawInsight {
  date_start?: string;
  date_stop?: string;
  account_id?: string;
  account_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  adset_id?: string;
  adset_name?: string;
  ad_id?: string;
  ad_name?: string;
  spend?: string;
  impressions?: string;
  reach?: string;
  clicks?: string;
  inline_link_clicks?: string;
  ctr?: string;
  cpc?: string;
  cpm?: string;
  frequency?: string;
  actions?: ActionEntry[];
  action_values?: ActionEntry[];
  purchase_roas?: RoasEntry[];
}

interface AccountInfo {
  id: string;
  name?: string;
  currency?: string;
}

function num(value: string | undefined): number {
  if (value === undefined) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** 우선순위 목록을 따라 첫 번째로 잡히는 action_type 의 값을 돌려준다. */
function pickAction(entries: ActionEntry[] | undefined): number {
  if (!entries?.length) return 0;
  for (const actionType of PURCHASE_ACTION_TYPES) {
    const match = entries.find((entry) => entry.action_type === actionType);
    if (match) return num(match.value);
  }
  return 0;
}

function identify(raw: RawInsight, level: ReportLevel): { id: string; name: string } {
  switch (level) {
    case "campaign":
      return { id: raw.campaign_id ?? "", name: raw.campaign_name ?? "(이름 없음)" };
    case "adset":
      return { id: raw.adset_id ?? "", name: raw.adset_name ?? "(이름 없음)" };
    case "ad":
      return { id: raw.ad_id ?? "", name: raw.ad_name ?? "(이름 없음)" };
    case "account":
    default:
      return { id: raw.account_id ?? "", name: raw.account_name ?? "계정 전체" };
  }
}

function toRow(raw: RawInsight, level: ReportLevel): ReportRow {
  const { id, name } = identify(raw, level);
  const spend = num(raw.spend);
  const purchases = pickAction(raw.actions);
  const purchaseValue = pickAction(raw.action_values);

  // purchase_roas 가 내려오면 그 값을 쓰고, 없으면 매출/광고비로 직접 계산한다.
  const reportedRoas = pickAction(raw.purchase_roas);
  const roas = reportedRoas || (spend > 0 ? purchaseValue / spend : 0);

  return {
    id,
    name,
    spend,
    impressions: num(raw.impressions),
    reach: num(raw.reach),
    clicks: num(raw.clicks),
    linkClicks: num(raw.inline_link_clicks),
    ctr: num(raw.ctr),
    cpc: num(raw.cpc),
    cpm: num(raw.cpm),
    frequency: num(raw.frequency),
    purchases,
    purchaseValue,
    roas,
    costPerPurchase: purchases > 0 ? spend / purchases : 0,
  };
}

/** 행들을 합쳐 총계를 만든다. 비율 지표는 합계가 아니라 재계산해야 한다. */
function summarize(rows: ReportRow[]): ReportSummary {
  const totals = rows.reduce(
    (acc, row) => ({
      spend: acc.spend + row.spend,
      impressions: acc.impressions + row.impressions,
      reach: acc.reach + row.reach,
      clicks: acc.clicks + row.clicks,
      linkClicks: acc.linkClicks + row.linkClicks,
      purchases: acc.purchases + row.purchases,
      purchaseValue: acc.purchaseValue + row.purchaseValue,
    }),
    {
      spend: 0,
      impressions: 0,
      reach: 0,
      clicks: 0,
      linkClicks: 0,
      purchases: 0,
      purchaseValue: 0,
    },
  );

  return {
    ...totals,
    ctr: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
    cpc: totals.clicks > 0 ? totals.spend / totals.clicks : 0,
    cpm: totals.impressions > 0 ? (totals.spend / totals.impressions) * 1000 : 0,
    roas: totals.spend > 0 ? totals.purchaseValue / totals.spend : 0,
    costPerPurchase: totals.purchases > 0 ? totals.spend / totals.purchases : 0,
  };
}

/** 토큰과 계정 ID 가 실제로 동작하는지 확인한다. /setup 의 "연결 확인" 이 쓴다. */
export async function verifyAccount(
  adAccountId: string,
  accessToken: string,
): Promise<AccountInfo> {
  const account = await graphGet<{
    id: string;
    name?: string;
    currency?: string;
    account_status?: number;
  }>({
    path: adAccountId,
    accessToken,
    params: { fields: "id,name,currency,account_status" },
  });

  return { id: account.id, name: account.name, currency: account.currency };
}

export async function fetchReport(
  credentials: Credentials,
  query: ReportQuery,
): Promise<Report> {
  const { adAccountId, accessToken } = credentials;
  const level = query.level;

  const timeParams = query.range
    ? { time_range: JSON.stringify({ since: query.range.since, until: query.range.until }) }
    : { date_preset: query.datePreset ?? "last_7d" };

  const [account, raws] = await Promise.all([
    verifyAccount(adAccountId, accessToken),
    graphGetAll<RawInsight>({
      path: `${adAccountId}/insights`,
      accessToken,
      params: {
        level,
        fields: insightsFields(level),
        limit: 100,
        ...timeParams,
      },
    }),
  ]);

  const rows = raws.map((raw) => toRow(raw, level)).sort((a, b) => b.spend - a.spend);

  const since = raws[0]?.date_start ?? query.range?.since ?? "";
  const until = raws[0]?.date_stop ?? query.range?.until ?? "";
  const presetLabel = query.range
    ? `${since} ~ ${until}`
    : (DATE_PRESETS.find((preset) => preset.value === query.datePreset)?.label ??
      "최근 7일");

  return {
    account: {
      id: account.id,
      name: account.name ?? credentials.accountName,
      currency: account.currency ?? credentials.currency ?? "KRW",
    },
    period: { since, until, label: presetLabel },
    level,
    summary: summarize(rows),
    rows,
    generatedAt: new Date().toISOString(),
  };
}
