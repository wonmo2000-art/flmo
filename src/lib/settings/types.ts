/** 메타 광고 계정 연동 정보. */
export interface MetaSettings {
  adAccountId: string;
  accessToken: string;
  accountName?: string;
  currency?: string;
  /** 광고를 게재할 페이스북 페이지 ID. 크리에이티브 생성에 반드시 필요하다. */
  pageId?: string;
  /** 인스타그램 계정 ID. 없으면 페이스북에만 노출된다. */
  instagramActorId?: string;
  /** 전환 추적용 픽셀 ID. */
  pixelId?: string;
}

/** 무신사 스토어 정보와 링크 생성 기본값. */
export interface MusinsaSettings {
  brandName?: string;
  /** 무신사 스토어 URL (브랜드관). */
  storeUrl?: string;
  utmSource: string;
  utmMedium: string;
  /** 비우면 캠페인 이름에서 자동 생성한다. */
  utmCampaign?: string;
}

/** 카피 생성에 쓰는 Claude API 설정. */
export interface AnthropicSettings {
  apiKey: string;
  model: string;
}

export type McpTransport = "http" | "sse";

export interface McpServerConfig {
  id: string;
  name: string;
  url: string;
  transport: McpTransport;
  /** Authorization 헤더에 실을 토큰. 없으면 인증 없이 붙는다. */
  bearerToken?: string;
  /** 마지막 연결 테스트 결과 — UI 표시용. */
  lastCheck?: {
    at: string;
    ok: boolean;
    toolCount?: number;
    error?: string;
  };
}

export interface Settings {
  meta?: MetaSettings;
  musinsa?: MusinsaSettings;
  anthropic?: AnthropicSettings;
  mcp: McpServerConfig[];
}

export const DEFAULT_SETTINGS: Settings = {
  musinsa: { utmSource: "meta", utmMedium: "cpc" },
  mcp: [],
};

/** 알려진 MCP 서버 프리셋. 설정 화면에서 원클릭으로 채워 넣는다. */
export const MCP_PRESETS: { name: string; url: string; transport: McpTransport; note: string }[] = [
  {
    name: "Higgsfield",
    url: "https://mcp.higgsfield.ai/mcp",
    transport: "http",
    note: "이미지·영상 생성. 계정 OAuth 인증이라 브라우저 로그인이 필요할 수 있습니다.",
  },
];
