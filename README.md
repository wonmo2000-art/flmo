# flmo

메타(Facebook·Instagram) 광고 계정을 연결하고 성과 리포트를 조회하는 대시보드.

계정 ID 와 액세스 토큰을 한 번 입력해 두면, 기간·단위를 골라 광고비 · 노출 · 클릭 ·
전환 · ROAS 를 바로 확인합니다.

## 빠른 시작

```bash
npm install

# 자격증명 암호화 키 생성
cp .env.example .env.local
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# 출력값을 .env.local 의 FLMO_ENCRYPTION_KEY 에 넣으세요

npm run dev
```

`http://localhost:3000` → `/setup` 으로 이동합니다.
광고 계정 ID 와 액세스 토큰을 입력하면 검증 후 저장되고, `/report` 에서 조회됩니다.

준비물(앱 생성 → 시스템 사용자 → 토큰 발급) 절차는 [`docs/setup-meta.md`](docs/setup-meta.md).

## 구성

```
src/
├── app/
│   ├── setup/            자격증명 입력 화면
│   ├── report/           성과 리포트 화면
│   └── api/
│       ├── setup/        저장 · 조회 · 삭제
│       ├── setup/verify/ 저장 없이 연결만 확인
│       └── report/       insights 조회
├── lib/
│   ├── crypto.ts         AES-256-GCM 암·복호화
│   ├── credentials.ts    자격증명 저장소 (파일 + 환경변수)
│   ├── format.ts         통화 · 숫자 포맷
│   └── meta/
│       ├── client.ts     Graph API 호출 + 에러 매핑
│       ├── fields.ts     조회 지표 · 기간 프리셋 정의
│       ├── insights.ts   insights 조회 및 정규화
│       └── types.ts
└── components/
    ├── SetupForm.tsx
    └── ReportView.tsx
```

## 조회 가능한 지표

| 단위 | 계정 전체 / 캠페인별 / 광고세트별 / 광고별 |
|---|---|
| 기간 | 오늘 · 어제 · 최근 7·14·30일 · 이번 달 · 지난 달 |
| 지표 | 광고비, 노출, 도달, 클릭, 링크 클릭, CTR, CPC, CPM, 빈도, 전환, 전환 매출, ROAS, 전환당 비용 |

전환은 `omni_purchase` → `offsite_conversion.fb_pixel_purchase` → `purchase` 순으로
먼저 잡히는 값을 씁니다. ROAS 는 메타가 `purchase_roas` 를 내려주면 그 값을 쓰고,
없으면 전환 매출 ÷ 광고비로 계산합니다.

## 토큰 취급

- 저장 전에 실제 Graph API 를 호출해 검증합니다. 잘못된 값은 저장되지 않습니다.
- 토큰은 AES-256-GCM 으로 암호화해 `.data/credentials.json` (권한 `0600`) 에만 둡니다.
- 브라우저로는 마스킹된 형태(`EAAg****oken`)만 내려갑니다.
- Graph API 호출 시 토큰은 쿼리스트링이 아니라 `Authorization` 헤더로 보냅니다.
- `.data/`, `.env.local` 은 `.gitignore` 대상입니다.

## 환경변수

| 이름 | 필수 | 설명 |
|---|---|---|
| `FLMO_ENCRYPTION_KEY` | ✅ | 자격증명 암호화 키 (base64 32바이트) |
| `META_API_VERSION` | | Marketing API 버전. 기본 `v25.0` |
| `META_AD_ACCOUNT_ID` | | UI 대신 환경변수로 주입할 때. 파일보다 우선 |
| `META_ACCESS_TOKEN` | | 위와 동일 |
| `META_GRAPH_BASE` | | Graph API 베이스 URL. 테스트용 모의 서버를 붙일 때만 사용 |

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
- CSV 내보내기 · 정기 리포트 발송 (슬랙·메일)
- 캠페인 on/off · 예산 조정 (`ads_management` 권한 필요)
- Conversions API 로 전환 서버 전송

## 관련 문서

- [메타 광고 연동 준비물](docs/setup-meta.md)
- [Higgsfield MCP 연결](docs/higgsfield-mcp.md)
