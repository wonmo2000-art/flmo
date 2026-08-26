"use client";

import { useState } from "react";

import type { McpProbeResult } from "@/lib/mcp/client";
import { MCP_PRESETS, type McpTransport } from "@/lib/settings/types";
import { formatDateTime } from "@/lib/format";

import { submit, type Feedback, type SectionProps } from "./common";

export default function McpSection({ settings, onUpdate }: SectionProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [transport, setTransport] = useState<McpTransport>("http");
  const [bearerToken, setBearerToken] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [probes, setProbes] = useState<Record<string, McpProbeResult>>({});

  async function addServer() {
    setBusy("add");
    setFeedback(null);
    try {
      onUpdate(
        await submit("/api/settings/mcp", {
          method: "POST",
          json: { name, url, transport, bearerToken },
        }),
      );
      setName("");
      setUrl("");
      setBearerToken("");
      setFeedback({ kind: "success", message: "등록했습니다. 연결 테스트로 확인해 보세요." });
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function testServer(id: string) {
    setBusy(id);
    setFeedback(null);
    try {
      const response = await fetch("/api/settings/mcp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "연결 테스트에 실패했습니다.");

      setProbes((previous) => ({ ...previous, [id]: data.result }));
      onUpdate(data.settings);
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      <section className="card">
        <h2>MCP 커넥터</h2>
        <p className="section-note">
          MCP 서버를 등록해 두면 이 앱이 서버에 직접 붙어 도구를 호출할 수 있습니다. 예를 들어
          Higgsfield 를 붙이면 광고 소재 생성을 여기서 이어서 할 수 있습니다.
          <br />
          <strong>다만 OAuth 로만 인증하는 서버는 여기서 못 붙습니다.</strong> 그런 서버는 액세스
          토큰을 직접 넣거나, Claude 쪽 커넥터로 연결하세요 (<code>docs/higgsfield-mcp.md</code>).
        </p>

        {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

        {settings.mcp.length > 0 && (
          <div className="server-list">
            {settings.mcp.map((server) => {
              const probe = probes[server.id];
              const check = server.lastCheck;

              return (
                <div key={server.id} className="server">
                  <div className="server-head">
                    <div>
                      <div className="server-name">
                        {server.name}
                        {check && (
                          <span
                            className={`badge ${check.ok ? "badge-ok" : ""}`}
                            style={{ marginLeft: 8 }}
                          >
                            {check.ok ? `● 도구 ${check.toolCount}개` : "○ 연결 실패"}
                          </span>
                        )}
                        {server.hasToken && (
                          <span className="badge" style={{ marginLeft: 6 }}>
                            토큰 있음
                          </span>
                        )}
                      </div>
                      <div className="server-url">
                        {server.transport.toUpperCase()} · {server.url}
                      </div>
                    </div>

                    <div className="actions">
                      <button
                        type="button"
                        className="btn-secondary"
                        disabled={busy !== null}
                        onClick={() => testServer(server.id)}
                      >
                        {busy === server.id ? "연결 중…" : "연결 테스트"}
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        disabled={busy !== null}
                        onClick={async () => {
                          onUpdate(
                            await submit(`/api/settings/mcp?id=${encodeURIComponent(server.id)}`, {
                              method: "DELETE",
                            }),
                          );
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  </div>

                  {check && !check.ok && check.error && (
                    <div className="alert alert-error" style={{ margin: "10px 0 0" }}>
                      {check.error}
                    </div>
                  )}

                  {probe?.ok && probe.tools.length > 0 && (
                    <>
                      <div className="tool-chips">
                        {probe.tools.slice(0, 24).map((tool) => (
                          <span key={tool.name} className="chip" title={tool.description}>
                            {tool.name}
                          </span>
                        ))}
                        {probe.tools.length > 24 && (
                          <span className="chip">+{probe.tools.length - 24}</span>
                        )}
                      </div>
                      {probe.serverName && (
                        <div className="server-url" style={{ marginTop: 8 }}>
                          {probe.serverName} {probe.serverVersion}
                        </div>
                      )}
                    </>
                  )}

                  {check && (
                    <div className="server-url" style={{ marginTop: 8 }}>
                      마지막 확인 {formatDateTime(check.at)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <hr className="divider" />

        <h2 style={{ fontSize: 15 }}>서버 추가</h2>
        <div className="actions" style={{ margin: "10px 0 16px" }}>
          {MCP_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className="btn-secondary"
              onClick={() => {
                setName(preset.name);
                setUrl(preset.url);
                setTransport(preset.transport);
                setFeedback({ kind: "info", message: preset.note });
              }}
            >
              {preset.name} 채우기
            </button>
          ))}
        </div>

        <div className="grid-2">
          <label className="field">
            <span className="label">이름</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Higgsfield"
            />
          </label>

          <label className="field">
            <span className="label">서버 URL</span>
            <input
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://mcp.example.com/mcp"
              spellCheck={false}
            />
          </label>

          <label className="field">
            <span className="label">전송 방식</span>
            <select
              value={transport}
              onChange={(event) => setTransport(event.target.value as McpTransport)}
            >
              <option value="http">Streamable HTTP (기본)</option>
              <option value="sse">SSE (구형 서버)</option>
            </select>
          </label>

          <label className="field">
            <span className="label">액세스 토큰</span>
            <input
              type="password"
              value={bearerToken}
              onChange={(event) => setBearerToken(event.target.value)}
              placeholder="선택 — 인증이 필요한 서버만"
              autoComplete="off"
            />
            <span className="help">Authorization: Bearer 헤더로 전달됩니다.</span>
          </label>
        </div>

        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            disabled={busy !== null || !name || !url}
            onClick={addServer}
          >
            {busy === "add" ? "등록 중…" : "등록"}
          </button>
        </div>
      </section>
    </>
  );
}
