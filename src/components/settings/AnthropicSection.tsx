"use client";

import { useState } from "react";

import { submit, type Feedback, type SectionProps } from "./common";

const MODELS = [
  { value: "claude-opus-5", label: "Claude Opus 5 — 가장 정확 (권장)" },
  { value: "claude-sonnet-5", label: "Claude Sonnet 5 — 빠르고 저렴" },
  { value: "claude-haiku-4-5", label: "Claude Haiku 4.5 — 가장 저렴" },
];

export default function AnthropicSection({ settings, onUpdate }: SectionProps) {
  const anthropic = settings.anthropic;
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(anthropic.model);
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);

  return (
    <section className="card">
      <h2>Claude API</h2>
      <p className="section-note">
        상품 이미지를 보고 광고 카피를 뽑는 데 씁니다. 키는 암호화되어 서버에만 저장되고,
        저장 전에 실제 호출로 검증합니다. 키 발급은{" "}
        <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
          console.anthropic.com
        </a>
        .
      </p>

      {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

      <div className="status-row" style={{ marginBottom: 20 }}>
        {anthropic.configured ? (
          <>
            <span className="badge badge-ok">● 연결됨</span>
            <span className="muted">키 {anthropic.maskedKey}</span>
            <span className="muted">모델 {anthropic.model}</span>
          </>
        ) : (
          <>
            <span className="badge badge-off">○ 미연결</span>
            <span>카피 자동 생성을 쓰려면 키가 필요합니다.</span>
          </>
        )}
      </div>

      <div className="grid-2">
        <label className="field">
          <span className="label">API 키</span>
          <input
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder={anthropic.configured ? "변경할 때만 입력" : "sk-ant-..."}
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        <label className="field">
          <span className="label">모델</span>
          <select value={model} onChange={(event) => setModel(event.target.value)}>
            {MODELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn-primary"
          disabled={busy !== null || !apiKey}
          onClick={async () => {
            setBusy("save");
            setFeedback(null);
            try {
              onUpdate(
                await submit("/api/settings/anthropic", {
                  method: "POST",
                  json: { apiKey, model },
                }),
              );
              setApiKey("");
              setFeedback({ kind: "success", message: "저장했습니다." });
            } catch (error) {
              setFeedback({ kind: "error", message: (error as Error).message });
            } finally {
              setBusy(null);
            }
          }}
        >
          {busy === "save" ? "검증 후 저장 중…" : "검증하고 저장"}
        </button>

        {anthropic.configured && (
          <button
            type="button"
            className="btn-danger"
            disabled={busy !== null}
            onClick={async () => {
              setBusy("clear");
              onUpdate(await submit("/api/settings/anthropic", { method: "DELETE" }));
              setFeedback({ kind: "info", message: "삭제했습니다." });
              setBusy(null);
            }}
          >
            삭제
          </button>
        )}
      </div>
    </section>
  );
}
