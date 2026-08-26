# MCP 커넥터

이 앱은 MCP 서버에 직접 붙어 도구를 호출할 수 있습니다. 설정 → **MCP 커넥터**
탭에서 등록하고 연결을 테스트합니다.

## 붙는 서버, 안 붙는 서버

| 인증 방식 | 이 앱에서 | 방법 |
|---|---|---|
| 인증 없음 | ✅ | URL 만 넣으면 됩니다 |
| Bearer 토큰 | ✅ | 액세스 토큰 칸에 넣으면 `Authorization` 헤더로 전달됩니다 |
| OAuth 전용 | ❌ | 브라우저 리다이렉트가 필요해 서버에서 못 붙습니다 |

OAuth 전용 서버는 아래 두 가지 중 하나로 가세요.

1. 그 서비스에서 장기 액세스 토큰을 따로 발급받아 토큰 칸에 넣기
2. 이 앱 대신 **Claude 쪽 커넥터**로 연결하기 (아래 참고)

연결 테스트를 누르면 서버에 붙어 도구 목록을 읽고 바로 끊습니다. 결과는
저장되어 다음에 열 때도 보입니다. 액세스 토큰은 암호화되어 서버에만 남고
브라우저로는 "토큰 있음" 여부만 내려갑니다.

## Higgsfield

Higgsfield 는 공식 호스팅 MCP 서버를 제공합니다.

```
https://mcp.higgsfield.ai/mcp
```

**API 키 없이 Higgsfield 계정 OAuth 로 인증합니다.** 즉 위 표의 세 번째 줄에
해당해서, 이 앱의 MCP 커넥터로는 바로 붙지 않을 가능성이 높습니다. 설정
화면의 "Higgsfield 채우기" 버튼으로 URL 을 채운 뒤 연결 테스트를 해보고,
인증 오류가 나면 아래 Claude 커넥터 방식을 쓰세요.

### Claude 쪽에 연결하기

**claude.ai (웹·데스크톱)**
1. 설정 → 커넥터 → 커스텀 커넥터 추가
2. URL 에 `https://mcp.higgsfield.ai/mcp` 입력
3. Higgsfield 계정으로 OAuth 인증

**Claude Code (CLI)**
```bash
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
```

연결되면 `/mcp` 로 인증 상태와 도구 목록을 볼 수 있습니다.

## 광고 작업 흐름에서의 위치

```
flmo 리포트로 성과 확인
        ↓
  ROAS 낮은 캠페인 식별
        ↓
Higgsfield 로 교체용 소재 생성
        ↓
flmo 스튜디오에 이미지 올려 광고 초안 생성
        ↓
  광고 관리자에서 검토 후 게재
```

소재 생성을 이 앱 안에서 이어서 하려면 MCP 커넥터로 붙이고, 그게 안 되면
Higgsfield 에서 만든 이미지를 내려받아 스튜디오에 올리면 됩니다. 결과는 같습니다.

## 참고

- 생성 계열 도구는 비동기로 돌아갑니다. 이 앱의 도구 호출 타임아웃은 5분입니다.
- 공식 서버 외에 커뮤니티가 만든 로컬 MCP 구현체들도 있습니다. 모델 종류가 더
  많은 대신 직접 API 키를 관리해야 하고, 그런 서버는 Bearer 토큰 방식이라
  이 앱에서 바로 붙습니다.
- 샷리스트·프롬프트 설계는 이 저장소가 아니라 `seedance-director-pro` 스킬 영역입니다.

## 링크

- [Higgsfield MCP](https://higgsfield.ai/mcp)
- [Higgsfield CLI](https://higgsfield.ai/cli)
