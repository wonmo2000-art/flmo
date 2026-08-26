/** 무신사 상품 URL 을 다루는 유틸. */

const MUSINSA_HOSTS = ["musinsa.com", "www.musinsa.com", "global.musinsa.com", "m.musinsa.com"];

/** 상품 번호가 들어갈 수 있는 경로 패턴들. 무신사가 URL 형식을 몇 번 바꿨다. */
const PATH_PATTERNS = [
  /\/products\/(\d+)/,
  /\/app\/goods\/(\d+)/,
  /\/goods\/(\d+)/,
  /\/product\/(\d+)/,
];

export interface ParsedMusinsaUrl {
  goodsNo: string;
  /** 쿼리·트래킹 파라미터를 걷어낸 정규 URL. */
  canonicalUrl: string;
}

export function isMusinsaUrl(input: string): boolean {
  try {
    const url = new URL(input);
    return MUSINSA_HOSTS.includes(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

/**
 * 무신사 URL 에서 상품 번호를 뽑아 정규 형태로 되돌린다.
 * 상품 번호만(`1234567`) 넣어도 받아준다.
 */
export function parseMusinsaUrl(input: string): ParsedMusinsaUrl | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // 숫자만 들어온 경우 상품 번호로 본다.
  if (/^\d{4,}$/.test(trimmed)) {
    return { goodsNo: trimmed, canonicalUrl: canonicalUrlFor(trimmed) };
  }

  let url: URL;
  try {
    url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }

  if (!MUSINSA_HOSTS.includes(url.hostname.toLowerCase())) return null;

  const fromQuery = url.searchParams.get("goodsNo");
  if (fromQuery && /^\d+$/.test(fromQuery)) {
    return { goodsNo: fromQuery, canonicalUrl: canonicalUrlFor(fromQuery) };
  }

  for (const pattern of PATH_PATTERNS) {
    const match = url.pathname.match(pattern);
    if (match) return { goodsNo: match[1], canonicalUrl: canonicalUrlFor(match[1]) };
  }

  return null;
}

export function canonicalUrlFor(goodsNo: string): string {
  return `https://www.musinsa.com/products/${goodsNo}`;
}

export interface UtmParams {
  source: string;
  medium: string;
  campaign: string;
  /** 광고 소재 구분용. 보통 광고 이름을 넣는다. */
  content?: string;
  term?: string;
}

/**
 * 랜딩 URL 에 UTM 을 붙인다.
 * 이미 같은 키가 있으면 덮어쓴다 — 붙였다 뗐다 반복해도 중복되지 않게.
 */
export function withUtm(rawUrl: string, utm: UtmParams): string {
  const url = new URL(rawUrl);
  const entries: [string, string | undefined][] = [
    ["utm_source", utm.source],
    ["utm_medium", utm.medium],
    ["utm_campaign", utm.campaign],
    ["utm_content", utm.content],
    ["utm_term", utm.term],
  ];

  for (const [key, value] of entries) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }

  return url.toString();
}

/**
 * 캠페인 이름을 UTM 값으로 쓸 수 있게 다듬는다.
 * 한글은 그대로 두되 공백은 하이픈으로 — 무신사 통계에서 읽기 쉬우라고.
 */
export function slugifyCampaign(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}_-]/gu, "")
    .toLowerCase()
    .slice(0, 60);
}
