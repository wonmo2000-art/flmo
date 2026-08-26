"use client";

import { useState } from "react";

import { withUtm } from "@/lib/musinsa/url";

import { submit, type Feedback, type SectionProps } from "./common";

export default function MusinsaSection({ settings, onUpdate }: SectionProps) {
  const musinsa = settings.musinsa;
  const [brandName, setBrandName] = useState(musinsa.brandName ?? "");
  const [storeUrl, setStoreUrl] = useState(musinsa.storeUrl ?? "");
  const [utmSource, setUtmSource] = useState(musinsa.utmSource);
  const [utmMedium, setUtmMedium] = useState(musinsa.utmMedium);
  const [utmCampaign, setUtmCampaign] = useState(musinsa.utmCampaign ?? "");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  let preview = "";
  try {
    preview = withUtm("https://www.musinsa.com/products/1234567", {
      source: utmSource || "meta",
      medium: utmMedium || "cpc",
      campaign: utmCampaign || "캠페인이름",
      content: "소재이름",
    });
  } catch {
    preview = "";
  }

  return (
    <section className="card">
      <h2>무신사</h2>
      <p className="section-note">
        무신사는 상품 조회용 공개 API 를 제공하지 않습니다 (파트너 API 는 주문 연동 전용).
        그래서 상품 정보는 <strong>상품 페이지 URL 을 읽어</strong> 가져오고, 성과 구분은
        <strong> UTM 파라미터</strong>로 합니다. 여기서 정한 값이 광고를 만들 때 랜딩 URL 에
        자동으로 붙습니다.
      </p>

      {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

      <div className="grid-2">
        <label className="field">
          <span className="label">브랜드명</span>
          <input
            type="text"
            value={brandName}
            onChange={(event) => setBrandName(event.target.value)}
            placeholder="카피 생성에 참고됩니다"
          />
        </label>

        <label className="field">
          <span className="label">무신사 스토어 URL</span>
          <input
            type="text"
            value={storeUrl}
            onChange={(event) => setStoreUrl(event.target.value)}
            placeholder="https://www.musinsa.com/brand/..."
            spellCheck={false}
          />
        </label>

        <label className="field">
          <span className="label">utm_source</span>
          <input type="text" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} />
        </label>

        <label className="field">
          <span className="label">utm_medium</span>
          <input type="text" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} />
        </label>

        <label className="field">
          <span className="label">utm_campaign</span>
          <input
            type="text"
            value={utmCampaign}
            onChange={(event) => setUtmCampaign(event.target.value)}
            placeholder="비우면 캠페인 이름에서 자동 생성"
          />
        </label>
      </div>

      {preview && (
        <div className="alert alert-info" style={{ wordBreak: "break-all" }}>
          <strong>미리보기</strong>
          <br />
          {preview}
        </div>
      )}

      <div className="actions">
        <button
          type="button"
          className="btn-primary"
          disabled={busy || !utmSource || !utmMedium}
          onClick={async () => {
            setBusy(true);
            setFeedback(null);
            try {
              onUpdate(
                await submit("/api/settings/musinsa", {
                  method: "POST",
                  json: { brandName, storeUrl, utmSource, utmMedium, utmCampaign },
                }),
              );
              setFeedback({ kind: "success", message: "저장했습니다." });
            } catch (error) {
              setFeedback({ kind: "error", message: (error as Error).message });
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "저장 중…" : "저장"}
        </button>
      </div>
    </section>
  );
}
