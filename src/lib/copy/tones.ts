/** 카피 톤 정의. 클라이언트 컴포넌트가 목록을 그려야 해서 따로 뺐다. */

export type CopyTone = "trendy" | "premium" | "value" | "informative";

export const TONE_GUIDE: Record<CopyTone, string> = {
  trendy: "20대 초중반 타깃. 트렌디하고 가볍게, 유행어는 과하지 않게.",
  premium: "소재와 만듦새를 강조. 절제된 문장, 과장된 수식어 금지.",
  value: "가격 대비 가치를 앞세운다. 할인율·혜택을 구체적인 숫자로.",
  informative: "핏, 소재, 사이즈 등 구매 판단에 필요한 정보를 담백하게.",
};

export const COPY_TONES: { value: CopyTone; label: string }[] = [
  { value: "trendy", label: "트렌디" },
  { value: "premium", label: "프리미엄" },
  { value: "value", label: "가성비" },
  { value: "informative", label: "정보형" },
];

export interface CopyVariant {
  headline: string;
  message: string;
  description: string;
  angle: string;
}

export interface CopyResult {
  observed: {
    category: string;
    colors: string[];
    material: string;
    details: string[];
    mood: string;
  };
  variants: CopyVariant[];
}
