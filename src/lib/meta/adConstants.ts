/**
 * 광고 생성에 쓰는 상수. 클라이언트 컴포넌트도 읽으므로
 * 서버 전용 코드와 분리해 둔다.
 */

/**
 * 광고 목표. 메타의 ODAX 목표 중 무신사 링크 광고에 실제로 쓰는 둘만 노출한다.
 * - traffic: 링크 클릭 최적화. 픽셀 없이도 된다.
 * - sales:   전환 최적화. 픽셀 ID 와 구매 이벤트가 있어야 한다.
 */
export type AdObjective = "traffic" | "sales";

export const OBJECTIVE_MAP: Record<AdObjective, { objective: string; optimizationGoal: string }> = {
  traffic: { objective: "OUTCOME_TRAFFIC", optimizationGoal: "LINK_CLICKS" },
  sales: { objective: "OUTCOME_SALES", optimizationGoal: "OFFSITE_CONVERSIONS" },
};

/** 광고 문구 길이 제한. 넘으면 메타가 잘라 버리거나 거부한다. */
export const COPY_LIMITS = { message: 125, headline: 40, description: 30 } as const;

export const CALL_TO_ACTIONS = [
  { value: "SHOP_NOW", label: "지금 쇼핑하기" },
  { value: "LEARN_MORE", label: "더 알아보기" },
  { value: "BUY_NOW", label: "지금 구매하기" },
  { value: "GET_OFFER", label: "혜택 받기" },
  { value: "SIGN_UP", label: "가입하기" },
] as const;
