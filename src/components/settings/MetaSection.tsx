"use client";

import { useState } from "react";

import { submit, type Feedback, type SectionProps } from "./common";

export default function MetaSection({ settings, onUpdate }: SectionProps) {
  const meta = settings.meta;
  const [adAccountId, setAdAccountId] = useState(meta.adAccountId ?? "");
  const [accessToken, setAccessToken] = useState("");
  const [pageId, setPageId] = useState(meta.pageId ?? "");
  const [instagramActorId, setInstagramActorId] = useState(meta.instagramActorId ?? "");
  const [pixelId, setPixelId] = useState(meta.pixelId ?? "");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  async function run(label: string, task: () => Promise<void>) {
    setBusy(label);
    setFeedback(null);
    try {
      await task();
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <section className="card">
        <h2>메타 광고 계정</h2>
        <p className="section-note">
          리포트 조회와 광고 생성 모두 이 자격증명을 씁니다. 발급 절차는{" "}
          <code>docs/setup-meta.md</code> 를 보세요.
        </p>

        {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

        {meta.fromEnv && (
          <div className="alert alert-info">
            환경변수로 주입된 값이 우선 적용됩니다. 여기서 저장해도 환경변수가 있는 한 그쪽이
            사용됩니다.
          </div>
        )}

        <div className="status-row" style={{ marginBottom: 20 }}>
          {meta.configured ? (
            <>
              <span className="badge badge-ok">● 연결됨</span>
              <span>
                <strong>{meta.accountName ?? "이름 미확인"}</strong> · {meta.adAccountId}
                {meta.currency ? ` · ${meta.currency}` : ""}
              </span>
              <span className="muted">토큰 {meta.maskedToken}</span>
            </>
          ) : (
            <>
              <span className="badge badge-off">○ 미연결</span>
              <span>계정 ID 와 액세스 토큰을 입력하세요.</span>
            </>
          )}
        </div>

        <div className="grid-2">
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
            <span className="help">비즈니스 관리자 → 광고 계정</span>
          </label>

          <label className="field">
            <span className="label">액세스 토큰</span>
            <input
              type="password"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
              placeholder={meta.configured ? "변경할 때만 입력" : "EAAG..."}
              autoComplete="off"
              spellCheck={false}
            />
            <span className="help">
              조회만 하려면 <code>ads_read</code>, 광고 생성까지 하려면{" "}
              <code>ads_management</code>
            </span>
          </label>
        </div>

        <hr className="divider" />

        <p className="section-note" style={{ marginBottom: 14 }}>
          아래 세 값은 <strong>광고 생성</strong>에만 필요합니다. 리포트만 볼 거면 비워도 됩니다.
        </p>

        <div className="grid-2">
          <label className="field">
            <span className="label">페이스북 페이지 ID</span>
            <input
              type="text"
              value={pageId}
              onChange={(event) => setPageId(event.target.value)}
              placeholder="1234567890"
              autoComplete="off"
            />
            <span className="help">광고 크리에이티브가 귀속될 페이지. 없으면 광고를 못 만듭니다.</span>
          </label>

          <label className="field">
            <span className="label">인스타그램 계정 ID</span>
            <input
              type="text"
              value={instagramActorId}
              onChange={(event) => setInstagramActorId(event.target.value)}
              placeholder="선택"
              autoComplete="off"
            />
            <span className="help">비우면 페이스북에만 노출됩니다.</span>
          </label>

          <label className="field">
            <span className="label">픽셀 ID</span>
            <input
              type="text"
              value={pixelId}
              onChange={(event) => setPixelId(event.target.value)}
              placeholder="선택"
              autoComplete="off"
            />
            <span className="help">전환(구매) 최적화를 쓰려면 필요합니다.</span>
          </label>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            disabled={busy !== null || !adAccountId || (!accessToken && !meta.configured)}
            onClick={() =>
              run("save", async () => {
                const next = await submit("/api/settings/meta", {
                  method: "POST",
                  json: { adAccountId, accessToken, pageId, instagramActorId, pixelId },
                });
                onUpdate(next);
                setAccessToken("");
                setFeedback({ kind: "success", message: "저장했습니다." });
              })
            }
          >
            {busy === "save" ? "검증 후 저장 중…" : "검증하고 저장"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            disabled={busy !== null}
            onClick={() =>
              run("verify", async () => {
                const response = await fetch("/api/settings/meta/verify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    adAccountId: adAccountId || undefined,
                    accessToken: accessToken || undefined,
                  }),
                });
                const data = await response.json();
                if (!response.ok || !data.ok) throw new Error(data.error ?? "연결 확인 실패");
                setFeedback({
                  kind: "success",
                  message: `연결 성공 — ${data.account.name ?? data.account.id} (${data.account.currency ?? "통화 미확인"})`,
                });
              })
            }
          >
            {busy === "verify" ? "확인 중…" : "연결만 확인"}
          </button>

          {meta.configured && !meta.fromEnv && (
            <button
              type="button"
              className="btn-danger"
              disabled={busy !== null}
              onClick={() =>
                run("clear", async () => {
                  onUpdate(await submit("/api/settings/meta", { method: "DELETE" }));
                  setAdAccountId("");
                  setAccessToken("");
                  setFeedback({ kind: "info", message: "삭제했습니다." });
                })
              }
            >
              삭제
            </button>
          )}
        </div>
      </section>
    </>
  );
}
