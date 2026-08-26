"use client";

import { useCallback, useEffect, useState } from "react";

import { DATE_PRESETS, REPORT_LEVELS } from "@/lib/meta/fields";
import type { DatePreset, Report, ReportLevel } from "@/lib/meta/types";
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatRoas,
} from "@/lib/format";

export default function ReportView() {
  const [level, setLevel] = useState<ReportLevel>("campaign");
  const [datePreset, setDatePreset] = useState<DatePreset>("last_7d");
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ level, datePreset });
      const response = await fetch(`/api/report?${params}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "리포트를 불러오지 못했습니다.");
        setReport(null);
        return;
      }
      setReport(data as Report);
    } catch (caught) {
      setError((caught as Error).message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [level, datePreset]);

  useEffect(() => {
    void load();
  }, [load]);

  const currency = report?.account.currency ?? "KRW";

  return (
    <>
      <section className="card">
        <h2>조회 조건</h2>
        <p className="subtitle">
          {report
            ? `${report.account.name ?? report.account.id} · ${report.period.since || "-"} ~ ${report.period.until || "-"}`
            : "기간과 단위를 고르면 바로 조회합니다."}
        </p>

        <div className="filters">
          <label className="field">
            <span className="label">단위</span>
            <select
              value={level}
              onChange={(event) => setLevel(event.target.value as ReportLevel)}
            >
              {REPORT_LEVELS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">기간</span>
            <select
              value={datePreset}
              onChange={(event) => setDatePreset(event.target.value as DatePreset)}
            >
              {DATE_PRESETS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button type="button" className="btn-primary" onClick={() => void load()} disabled={loading}>
            {loading ? "불러오는 중…" : "새로고침"}
          </button>
        </div>
      </section>

      {error && (
        <section className="card">
          <div className="alert alert-error">{error}</div>
          <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
            토큰이 만료됐거나 권한이 부족할 수 있습니다. <a href="/setup">설정</a>에서 연결을
            다시 확인해 보세요.
          </p>
        </section>
      )}

      {report && (
        <>
          <section className="card">
            <h2>총계</h2>
            <p className="subtitle">
              {report.period.label} · {formatDateTime(report.generatedAt)} 기준
            </p>
            <div className="summary-grid">
              <Stat label="광고비" value={formatCurrency(report.summary.spend, currency)} />
              <Stat label="노출" value={formatNumber(report.summary.impressions)} />
              <Stat label="도달" value={formatNumber(report.summary.reach)} />
              <Stat label="클릭" value={formatNumber(report.summary.clicks)} />
              <Stat label="CTR" value={formatPercent(report.summary.ctr)} />
              <Stat label="CPC" value={formatCurrency(report.summary.cpc, currency)} />
              <Stat label="CPM" value={formatCurrency(report.summary.cpm, currency)} />
              <Stat label="전환" value={formatNumber(report.summary.purchases)} />
              <Stat
                label="전환 매출"
                value={formatCurrency(report.summary.purchaseValue, currency)}
              />
              <Stat label="ROAS" value={formatRoas(report.summary.roas)} />
              <Stat
                label="전환당 비용"
                value={formatCurrency(report.summary.costPerPurchase, currency)}
              />
            </div>
          </section>

          <section className="card">
            <h2>{REPORT_LEVELS.find((item) => item.value === report.level)?.label} 상세</h2>
            <p className="subtitle">광고비 기준 내림차순 · {report.rows.length}건</p>

            {report.rows.length === 0 ? (
              <div className="empty">해당 기간에 집행된 데이터가 없습니다.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>이름</th>
                      <th>광고비</th>
                      <th>노출</th>
                      <th>클릭</th>
                      <th>링크 클릭</th>
                      <th>CTR</th>
                      <th>CPC</th>
                      <th>CPM</th>
                      <th>빈도</th>
                      <th>전환</th>
                      <th>전환 매출</th>
                      <th>ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((row) => (
                      <tr key={row.id || row.name}>
                        <td>{row.name}</td>
                        <td>{formatCurrency(row.spend, currency)}</td>
                        <td>{formatNumber(row.impressions)}</td>
                        <td>{formatNumber(row.clicks)}</td>
                        <td>{formatNumber(row.linkClicks)}</td>
                        <td>{formatPercent(row.ctr)}</td>
                        <td>{formatCurrency(row.cpc, currency)}</td>
                        <td>{formatCurrency(row.cpm, currency)}</td>
                        <td>{formatNumber(row.frequency, 2)}</td>
                        <td>{formatNumber(row.purchases)}</td>
                        <td>{formatCurrency(row.purchaseValue, currency)}</td>
                        <td>{formatRoas(row.roas)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}
