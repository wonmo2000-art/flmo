import Link from "next/link";

import ReportView from "@/components/ReportView";
import { getCredentialsSummary } from "@/lib/credentials";

export const dynamic = "force-dynamic";

export default async function ReportPage() {
  let configured = false;
  try {
    configured = (await getCredentialsSummary()).configured;
  } catch {
    configured = false;
  }

  if (!configured) {
    return (
      <section className="card">
        <h2>먼저 연결이 필요합니다</h2>
        <p className="subtitle">
          메타 광고 계정 ID 와 액세스 토큰을 등록하면 리포트를 조회할 수 있습니다.
        </p>
        <Link href="/setup">
          <button type="button" className="btn-primary">
            설정하러 가기
          </button>
        </Link>
      </section>
    );
  }

  return <ReportView />;
}
