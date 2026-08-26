import "server-only";

import type { MetaApiErrorPayload } from "./types";

const DEFAULT_API_VERSION = "v25.0";
const DEFAULT_GRAPH_BASE = "https://graph.facebook.com";

export function apiVersion(): string {
  return process.env.META_API_VERSION?.trim() || DEFAULT_API_VERSION;
}

/** 기본값은 실제 Graph API. 테스트에서 모의 서버를 붙일 때만 바꾼다. */
function graphBase(): string {
  return (process.env.META_GRAPH_BASE?.trim() || DEFAULT_GRAPH_BASE).replace(/\/$/, "");
}

/** Graph API 가 에러를 돌려줬을 때 던지는 예외. 사용자에게 보여줄 한국어 메시지를 함께 갖는다. */
export class MetaApiError extends Error {
  readonly payload: MetaApiErrorPayload;
  readonly status: number;

  constructor(payload: MetaApiErrorPayload, status: number) {
    super(payload.message);
    this.name = "MetaApiError";
    this.payload = payload;
    this.status = status;
  }

  /** 자주 마주치는 코드는 원인과 해결법을 짚어준다. */
  get hint(): string {
    const { code, error_subcode: subcode } = this.payload;

    if (code === 190) {
      return subcode === 463
        ? "액세스 토큰이 만료됐습니다. 비즈니스 설정에서 시스템 사용자 토큰을 다시 발급하세요."
        : "액세스 토큰이 유효하지 않습니다. 토큰을 다시 확인하거나 재발급하세요.";
    }
    if (code === 200 || code === 10) {
      return "권한이 부족합니다. 토큰에 ads_read 권한이 있는지, 시스템 사용자가 이 광고 계정에 배정됐는지 확인하세요.";
    }
    if (code === 100) {
      return "요청 파라미터가 잘못됐습니다. 광고 계정 ID(act_ 로 시작)를 확인하세요.";
    }
    if (code === 4 || code === 17 || code === 613) {
      return "API 호출 한도에 걸렸습니다. 잠시 후 다시 시도하세요.";
    }
    if (code === 803) {
      return "해당 광고 계정을 찾을 수 없습니다. 계정 ID 를 확인하세요.";
    }
    if (code === undefined) {
      // Meta 형식의 에러 본문이 없다 — 프록시·방화벽에 막혔거나 네트워크 문제다.
      return `${this.message} graph.facebook.com 으로 나가는 네트워크가 열려 있는지 확인하세요.`;
    }
    return this.payload.error_user_msg ?? this.payload.message;
  }
}

interface GraphRequestOptions {
  /** `act_123/insights` 처럼 버전 뒤에 붙는 경로 */
  path: string;
  accessToken: string;
  params?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
}

/**
 * Graph API GET 호출.
 * 액세스 토큰은 쿼리스트링이 아니라 Authorization 헤더로 보낸다 —
 * 프록시·서버 로그에 토큰이 남는 걸 피하기 위해서다.
 */
export async function graphGet<T>({
  path,
  accessToken,
  params = {},
  signal,
}: GraphRequestOptions): Promise<T> {
  const url = new URL(`${graphBase()}/${apiVersion()}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal,
      cache: "no-store",
    });
  } catch (cause) {
    // fetch 자체가 실패한 경우 (DNS, 연결 거부, 타임아웃) 도 같은 예외로 감싼다.
    throw new MetaApiError(
      { message: `Graph API 에 연결하지 못했습니다: ${(cause as Error).message}` },
      0,
    );
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok || (body && typeof body === "object" && "error" in body)) {
    const payload =
      body && typeof body === "object" && "error" in body
        ? ((body as { error: MetaApiErrorPayload }).error)
        : { message: `Graph API 요청이 실패했습니다 (HTTP ${response.status})` };
    throw new MetaApiError(payload, response.status);
  }

  return body as T;
}

/**
 * 커서 페이지네이션을 따라가며 전체 데이터를 모은다.
 * insights 는 계정 규모에 따라 수백 행이 나올 수 있어 상한을 둔다.
 */
export async function graphGetAll<T>(
  options: GraphRequestOptions,
  maxPages = 10,
): Promise<T[]> {
  const collected: T[] = [];
  let after: string | undefined;

  for (let page = 0; page < maxPages; page += 1) {
    const result = await graphGet<{
      data: T[];
      paging?: { cursors?: { after?: string }; next?: string };
    }>({ ...options, params: { ...options.params, after } });

    collected.push(...(result.data ?? []));

    if (!result.paging?.next) break;
    after = result.paging.cursors?.after;
    if (!after) break;
  }

  return collected;
}
