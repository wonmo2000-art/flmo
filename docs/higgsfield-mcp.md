# Higgsfield MCP 연결

Higgsfield 는 공식 호스팅 MCP 서버를 제공합니다. 별도 API 키 없이 Higgsfield 계정으로
인증하며, 이미지·영상 생성 모델을 에이전트에서 바로 호출할 수 있습니다.

```
https://mcp.higgsfield.ai/mcp
```

## 이 프로젝트와의 관계

MCP 는 **에이전트(Claude) 쪽 커넥터**이지, 이 웹앱의 의존성이 아닙니다.
연결해도 `flmo` 코드에는 변화가 없습니다. 대신 이런 작업 흐름이 열립니다.

```
flmo 리포트로 성과 확인
        ↓
  ROAS 낮은 캠페인 식별
        ↓
Higgsfield MCP 로 교체용 소재 생성
        ↓
  메타 광고 관리자에 업로드
```

즉 **리포트(이 앱) → 판단 → 소재 생성(MCP)** 의 앞뒤를 잇는 역할입니다.
소재 업로드까지 자동화하려면 `ads_management` 권한과 Marketing API 쓰기 연동이
추가로 필요합니다 (현재 미구현).

## 연결 방법

MCP 커넥터는 코드가 아니라 계정 설정에서 붙입니다. 저장소에서 할 일은 없습니다.

**claude.ai (웹·데스크톱)**
1. 설정 → 커넥터 → 커스텀 커넥터 추가
2. URL 에 `https://mcp.higgsfield.ai/mcp` 입력
3. Higgsfield 계정으로 OAuth 인증

**Claude Code (CLI)**
```bash
claude mcp add --transport http higgsfield https://mcp.higgsfield.ai/mcp
```

연결되면 `/mcp` 로 인증 상태와 사용 가능한 도구를 확인할 수 있습니다.

## 참고

- 생성은 비동기로 돌아갑니다. 에이전트가 폴링하다가 완료되면 결과를 돌려줍니다.
- 공식 서버 외에 커뮤니티가 만든 로컬 MCP 구현체들도 있습니다. 모델 종류가 더 많은
  대신 직접 API 키를 관리해야 합니다.
- 샷리스트·프롬프트 설계는 이 저장소가 아니라 `seedance-director-pro` 스킬 쪽 영역입니다.

## 링크

- [Higgsfield MCP](https://higgsfield.ai/mcp)
- [Higgsfield CLI](https://higgsfield.ai/cli)
