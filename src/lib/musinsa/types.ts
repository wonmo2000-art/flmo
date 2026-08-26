/** 무신사 상품 정보. 클라이언트 컴포넌트도 읽으므로 파서와 분리해 둔다. */
export interface MusinsaProduct {
  goodsNo: string;
  url: string;
  name?: string;
  brand?: string;
  price?: number;
  originalPrice?: number;
  currency?: string;
  imageUrl?: string;
  description?: string;
  /** 페이지에서 값을 못 긁었을 때 사유. UI 에서 수동 입력을 유도한다. */
  warning?: string;
}
