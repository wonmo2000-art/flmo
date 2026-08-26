import SettingsPanel from "@/components/settings/SettingsPanel";
import { getSettingsView, type SettingsView } from "@/lib/settings/store";

export const dynamic = "force-dynamic";

const EMPTY: SettingsView = {
  meta: { configured: false, fromEnv: false },
  musinsa: { utmSource: "meta", utmMedium: "cpc" },
  anthropic: { configured: false, model: "claude-opus-5" },
  mcp: [],
};

export default async function SettingsPage() {
  let settings = EMPTY;
  let keyError: string | null = null;

  try {
    settings = await getSettingsView();
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

      <SettingsPanel initial={settings} />
    </>
  );
}
