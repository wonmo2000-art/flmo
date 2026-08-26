/** 계정 통화에 맞춰 금액을 포맷한다. KRW 는 소수점을 쓰지 않는다. */
export function formatCurrency(value: number, currency = "KRW"): string {
  const fractionDigits = currency === "KRW" || currency === "JPY" ? 0 : 2;
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatNumber(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 2): string {
  return `${formatNumber(value, fractionDigits)}%`;
}

/** ROAS 는 배수로 보여준다. 3.2 → "3.20x" */
export function formatRoas(value: number): string {
  return `${formatNumber(value, 2)}x`;
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}
