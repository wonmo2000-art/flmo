import Link from "next/link";

import StudioWorkflow from "@/components/studio/StudioWorkflow";
import { getSettingsView } from "@/lib/settings/store";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  let settings;
  try {
    settings = await getSettingsView();
  } catch (error) {
    return (
      <section className="card">
        <div className="alert alert-error" style={{ whiteSpace: "pre-line", marginBottom: 0 }}>
          {(error as Error).message}
        </div>
      </section>
    );
  }

  if (!settings.meta.configured) {
    return (
      <section className="card">
        <h2>먼저 메타 광고 계정을 연결하세요</h2>
        <p className="subtitle">
          광고를 만들려면 광고 계정과 페이스북 페이지 연결이 필요합니다.
        </p>
        <Link href="/settings">
          <button type="button" className="btn-primary">
            설정하러 가기
          </button>
        </Link>
      </section>
    );
  }

  return <StudioWorkflow settings={settings} />;
}
