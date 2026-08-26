import SetupForm from "@/components/SetupForm";
import { getCredentialsSummary, type CredentialsSummary } from "@/lib/credentials";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  let summary: CredentialsSummary = { configured: false };
  let keyError: string | null = null;

  try {
    summary = await getCredentialsSummary();
  } catch (error) {
    keyError = (error as Error).message;
  }

  return (
    <>
      {keyError && (
        <section className="card">
          <div className="alert alert-error" style={{ whiteSpace: "pre-line", marginBottom: 0 }}>
            {keyError}
          </div>
        </section>
      )}

      <SetupForm initial={summary} />

      <section className="card">
        <h2>준비물 체크리스트</h2>
        <p className="subtitle">
          아래 순서대로 하면 조회용 토큰이 나옵니다. 자세한 설명은{" "}
          <code>docs/setup-meta.md</code> 를 보세요.
        </p>
        <ol className="steps">
          <li>
            <a href="https://business.facebook.com" target="_blank" rel="noreferrer">
              비즈니스 관리자
            </a>
            에서 광고 계정 ID 확인 (<code>act_</code> 로 시작하는 숫자)
          </li>
          <li>
            <a href="https://developers.facebook.com/apps" target="_blank" rel="noreferrer">
              Meta for Developers
            </a>
            에서 앱 생성 → 유형 &quot;비즈니스&quot;
          </li>
          <li>비즈니스 설정 → 사용자 → 시스템 사용자 추가 (역할: 관리자)</li>
          <li>
            시스템 사용자에 광고 계정 배정 → 자산 추가 → 광고 계정 → 권한{" "}
            <code>광고 실적 보기</code>
          </li>
          <li>
            &quot;새 토큰 생성&quot; → 앱 선택 → 권한 <code>ads_read</code> 체크 → 만료{" "}
            <code>없음</code>
          </li>
          <li>발급된 토큰을 위 입력란에 붙여넣고 저장</li>
        </ol>
      </section>
    </>
  );
}
