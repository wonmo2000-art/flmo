# flmo

무신사 상품 이미지로 메타 광고를 만들고, 성과를 추적하는 대시보드.

상품 이미지를 올리고 무신사 링크를 넣으면 → 이미지를 분석해 카피를 뽑고 →
UTM 을 붙여 → 메타에 캠페인·광고세트·광고를 **일시중지 상태로** 만들어 둡니다.
검토 후 광고 관리자에서 켜면 됩니다.

## 빠른 시작

```bash
npm install

cp .env.example .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# 출력값을 .env.local 의 FLMO_ENCRYPTION_KEY 에 넣으세요

npm run dev
```

`http://localhost:3000` → 설정이 없으면 `/settings` 로 갑니다.

## 화면

| 경로 | 하는 일 |
|---|---|
| `/settings` | 메타 광고 · 무신사 · Claude API · MCP 커넥터 연동 |
| `/studio` | 이미지 → 카피 → 광고 초안 생성 |
| `/report` | 캠페인·광고세트·광고별 성과 조회 |

## 광고 만들기 흐름

```
1. 상품 이미지 업로드 (최대 5장)
      · 긴 변 1440px 로 자동 축소
      · 이미지마다 별도 광고가 되어 소재별 성과를 따로 봅니다

2. 무신사 상품 링크 입력
      · 상품 페이지에서 상품명·브랜드·가격·대표 이미지를 읽어옵니다
      · URL 형식이 뭐든(products/, app/goods/, goodsNo=, 번호만) 받습니다

3. 카피 생성
      · Claude 가 이미지를 보고 서로 다른 소구점의 안을 만듭니다
      · 톤 4종 · 안 개수 2~5개 · 추가 지시 가능
      · 고른 안은 직접 고칠 수 있고, 글자 수 제한을 실시간으로 보여줍니다

4. 캠페인 설정
      · 목표(트래픽/판매), 일 예산, CTA, 연령, 성별
      · UTM 은 서버에서 자동으로 붙습니다

5. 광고 초안 생성  ← 전부 PAUSED
```

### 생성되는 것

| 객체 | 개수 | 상태 |
|---|---|---|
| 캠페인 | 1 | `PAUSED` |
| 광고세트 | 1 | `PAUSED` |
| 크리에이티브 | 이미지 수만큼 | — |
| 광고 | 이미지 수만큼 | `PAUSED` |

**이 앱만으로는 광고가 절대 나가지 않습니다.** 게재는 광고 관리자에서 사람이
직접 켜야 합니다. 의도적인 설계입니다 — 자동 생성된 광고가 검토 없이 예산을
쓰는 상황을 막습니다.

## 연동

| 대상 | 되는 것 | 안 되는 것 |
|---|---|---|
| **메타 Marketing API** | 성과 조회, 광고 생성 | — |
| **무신사** | 상품 페이지 파싱, UTM 부착 | 상품 API 조회 (공개 API 없음) |
| **Claude API** | 이미지 분석 · 카피 생성 | — |
| **MCP** | Bearer 토큰·무인증 서버 | OAuth 전용 서버 |

각각의 자세한 내용:
[메타 설정](docs/setup-meta.md) · [무신사](docs/musinsa.md) · [MCP 커넥터](docs/higgsfield-mcp.md)

## 조회 가능한 지표

| 단위 | 계정 전체 / 캠페인별 / 광고세트별 / 광고별 |
|---|---|
| 기간 | 오늘 · 어제 · 최근 7·14·30일 · 이번 달 · 지난 달 |
| 지표 | 광고비, 노출, 도달, 클릭, 링크 클릭, CTR, CPC, CPM, 빈도, 전환, 전환 매출, ROAS, 전환당 비용 |

전환은 `omni_purchase` → `offsite_conversion.fb_pixel_purchase` → `purchase` 순으로
먼저 잡히는 값을 씁니다. ROAS 는 메타가 `purchase_roas` 를 주면 그 값을, 없으면
전환 매출 ÷ 광고비로 계산합니다. 총계의 비율 지표는 행 합계가 아니라 재계산합니다.

## 비밀값 취급

- 저장 전에 실제 API 를 호출해 검증합니다. 잘못된 값은 저장되지 않습니다.
- 모든 설정을 통째로 AES-256-GCM 으로 암호화해 `.data/settings.json` (권한 `0600`) 에만 둡니다.
- 브라우저로는 마스킹된 형태(`EAAg****oken`)만 내려갑니다. MCP 토큰은 존재 여부만 내려갑니다.
- Graph API 호출 시 토큰은 쿼리스트링이 아니라 `Authorization` 헤더로 보냅니다.
- UTM 은 서버에서 붙입니다. 클라이언트가 보낸 URL 을 그대로 신뢰하지 않습니다.
- `.data/`, `.env.local` 은 `.gitignore` 대상입니다.

## 구성

```
src/
├── app/
│   ├── settings/         연동 설정 (탭 4개)
│   ├── studio/           이미지 → 광고 초안
│   ├── report/           성과 리포트
│   └── api/
│       ├── settings/     meta · musinsa · anthropic · mcp
│       ├── musinsa/      상품 페이지 파싱
│       ├── studio/       copy · publish
│       └── report/       insights 조회
├── lib/
│   ├── crypto.ts         AES-256-GCM 암·복호화
│   ├── settings/         설정 저장소 (파일 + 환경변수)
│   ├── meta/
│   │   ├── client.ts     Graph API GET/POST + 에러 매핑
│   │   ├── insights.ts   성과 조회 및 정규화
│   │   ├── publish.ts    이미지 업로드 → 크리에이티브 → 광고
│   │   └── adConstants.ts
│   ├── musinsa/
│   │   ├── url.ts        URL 정규화 · UTM
│   │   └── product.ts    상품 페이지 파싱
│   ├── mcp/client.ts     MCP 연결 · 도구 목록 · 도구 호출
│   └── copy/generate.ts  Claude 로 카피 생성
└── components/
    ├── settings/         탭별 섹션
    └── studio/           워크플로 · 이미지 전처리
```

## 환경변수

| 이름 | 필수 | 설명 |
|---|---|---|
| `FLMO_ENCRYPTION_KEY` | ✅ | 설정 암호화 키 (base64 32바이트) |
| `META_API_VERSION` | | Marketing API 버전. 기본 `v25.0` |
| `META_AD_ACCOUNT_ID` | | UI 대신 환경변수로 주입할 때. 파일보다 우선 |
| `META_ACCESS_TOKEN` | | 위와 동일 |
| `META_GRAPH_BASE` | | 테스트용 모의 서버 주소. 운영에서 쓰지 마세요 |
| `MUSINSA_BASE` | | 테스트용 모의 서버 주소. 운영에서 쓰지 마세요 |

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run typecheck  # 타입 검사
```

## 다음에 붙일 것

- 기간 직접 지정 (API 는 `since`/`until` 로 이미 지원, UI 만 없음)
- 전기간 대비 증감 표시
- 광고세트 여러 개(A/B 테스트) 동시 생성
- MCP 도구를 스튜디오 안에서 직접 호출해 소재 생성
- 무신사 파트너 주문 API 와 UTM 대조로 실매출 붙이기
- CSV 내보내기 · 정기 리포트 발송
