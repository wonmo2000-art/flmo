"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { CredentialsSummary } from "@/lib/credentials";
import { formatDateTime } from "@/lib/format";

interface Props {
  initial: CredentialsSummary;
}

type Feedback = { kind: "error" | "success" | "info"; message: string } | null;

export default function SetupForm({ initial }: Props) {
  const router = useRouter();
  const [summary, setSummary] = useState(initial);
  const [adAccountId, setAdAccountId] = useState(initial.adAccountId ?? "");
  const [accessToken, setAccessToken] = useState("");
  const [busy, setBusy] = useState<"save" | "verify" | "clear" | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const isEnvManaged = summary.source === "env";

  async function handleVerify() {
    setBusy("verify");
    setFeedback(null);
    try {
      const response = await fetch("/api/setup/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 입력값이 비어 있으면 서버가 저장된 자격증명으로 확인한다.
        body: JSON.stringify({
          adAccountId: adAccountId || undefined,
          accessToken: accessToken || undefined,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        setFeedback({ kind: "error", message: data.error ?? "연결 확인에 실패했습니다." });
        return;
      }
      setFeedback({
        kind: "success",
        message: `연결 성공 — ${data.account.name ?? data.account.id} (${data.account.currency ?? "통화 미확인"})`,
      });
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setBusy("save");
    setFeedback(null);
    try {
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adAccountId, accessToken }),
      });
      const data = await response.json();

      if (!response.ok) {
        setFeedback({ kind: "error", message: data.error ?? "저장에 실패했습니다." });
        return;
      }

      setSummary(data);
      setAccessToken("");
      setFeedback({ kind: "success", message: "저장했습니다. 리포트 화면에서 조회할 수 있습니다." });
      router.refresh();
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function handleClear() {
    setBusy("clear");
    setFeedback(null);
    try {
      await fetch("/api/setup", { method: "DELETE" });
      setSummary({ configured: false });
      setAdAccountId("");
      setAccessToken("");
      setFeedback({ kind: "info", message: "저장된 자격증명을 삭제했습니다." });
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <section className="card">
        <h2>연결 상태</h2>
        <p className="subtitle">현재 저장된 메타 광고 계정 자격증명입니다.</p>

        {summary.configured ? (
          <div className="status-row">
            <span className="badge badge-ok">● 연결됨</span>
            <span>
              <strong>{summary.accountName ?? "이름 미확인"}</strong> · {summary.adAccountId}
              {summary.currency ? ` · ${summary.currency}` : ""}
            </span>
            <span className="muted">토큰 {summary.maskedToken}</span>
            {summary.savedAt && summary.savedAt !== "env" && (
              <span className="muted">저장 {formatDateTime(summary.savedAt)}</span>
            )}
            {isEnvManaged && <span className="badge">환경변수로 주입됨</span>}
          </div>
        ) : (
          <div className="status-row">
            <span className="badge badge-off">○ 미연결</span>
            <span>아래에서 광고 계정 ID 와 액세스 토큰을 입력하세요.</span>
          </div>
        )}
      </section>

      <section className="card">
        <h2>자격증명 입력</h2>
        <p className="subtitle">
          입력한 토큰은 저장 전에 실제 Graph API 호출로 검증하고, AES-256-GCM 으로 암호화해
          서버의 <code>.data/</code> 에만 보관합니다. 브라우저에는 남기지 않습니다.
        </p>

        {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

        {isEnvManaged && (
          <div className="alert alert-info">
            환경변수(<code>META_AD_ACCOUNT_ID</code>, <code>META_ACCESS_TOKEN</code>)로 주입된
            값이 우선 적용됩니다. 여기서 저장해도 환경변수가 있는 한 그쪽이 사용됩니다.
          </div>
        )}

        <form onSubmit={handleSave}>
          <label className="field">
            <span className="label">광고 계정 ID</span>
            <input
              type="text"
              value={adAccountId}
              onChange={(event) => setAdAccountId(event.target.value)}
              placeholder="act_1234567890"
              autoComplete="off"
              spellCheck={false}
            />
            <span className="help">
              비즈니스 관리자 → 광고 계정에서 확인. <code>act_</code> 없이 숫자만 넣어도 됩니다.
            </span>
          </label>

          <label className="field">
            <span className="label">액세스 토큰</span>
            <textarea
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              placeholder={summary.configured ? "변경할 때만 입력하세요" : "EAAG..."}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="help">
              시스템 사용자 장기 토큰 권장. 조회만 할 거면 <code>ads_read</code> 권한이면
              충분합니다.
            </span>
          </label>

          <div className="actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={busy !== null || !adAccountId || !accessToken}
            >
              {busy === "save" ? "검증 후 저장 중…" : "검증하고 저장"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleVerify}
              disabled={busy !== null}
            >
              {busy === "verify" ? "확인 중…" : "연결만 확인"}
            </button>
            {summary.configured && !isEnvManaged && (
              <button
                type="button"
                className="btn-danger"
                onClick={handleClear}
                disabled={busy !== null}
              >
                삭제
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
