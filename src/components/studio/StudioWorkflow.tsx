"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { COPY_TONES, type CopyResult, type CopyTone } from "@/lib/copy/tones";
import { formatCurrency } from "@/lib/format";
import { CALL_TO_ACTIONS, COPY_LIMITS } from "@/lib/meta/adConstants";
import type { MusinsaProduct } from "@/lib/musinsa/types";
import type { SettingsView } from "@/lib/settings/store";

import { prepareImage, type PreparedImage } from "./imageUtils";

interface PublishResult {
  campaignId: string;
  adSetId: string;
  ads: { adId: string; filename: string }[];
  managerUrl: string;
  landingUrl: string;
}

type Feedback = { kind: "error" | "success" | "info"; message: string } | null;

export default function StudioWorkflow({ settings }: { settings: SettingsView }) {
  const fileInput = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<PreparedImage[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [productInput, setProductInput] = useState("");
  const [product, setProduct] = useState<MusinsaProduct | null>(null);

  const [tone, setTone] = useState<CopyTone>("trendy");
  const [variantCount, setVariantCount] = useState(3);
  const [extraInstruction, setExtraInstruction] = useState("");
  const [copy, setCopy] = useState<CopyResult | null>(null);
  const [selected, setSelected] = useState(0);

  const [headline, setHeadline] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  const [campaignName, setCampaignName] = useState("");
  const [objective, setObjective] = useState<"traffic" | "sales">("traffic");
  const [dailyBudget, setDailyBudget] = useState(10000);
  const [callToAction, setCallToAction] = useState<string>("SHOP_NOW");
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(34);
  const [genders, setGenders] = useState<"all" | "1" | "2">("all");

  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [result, setResult] = useState<PublishResult | null>(null);

  const currency = settings.meta.currency ?? "KRW";

  async function addFiles(files: FileList | File[]) {
    setFeedback(null);
    const incoming = Array.from(files).slice(0, 5 - images.length);
    if (incoming.length === 0) {
      setFeedback({ kind: "info", message: "이미지는 최대 5장까지 올릴 수 있습니다." });
      return;
    }

    try {
      const prepared = await Promise.all(incoming.map(prepareImage));
      setImages((previous) => [...previous, ...prepared]);
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    }
  }

  async function lookupProduct() {
    setBusy("product");
    setFeedback(null);
    try {
      const response = await fetch("/api/musinsa/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productInput }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "상품 정보를 가져오지 못했습니다.");

      setProduct(data as MusinsaProduct);
      if (!campaignName && data.name) {
        setCampaignName(`${data.name} - ${new Date().toISOString().slice(0, 10)}`);
      }
      if (data.warning) setFeedback({ kind: "info", message: data.warning });
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  async function generateCopy() {
    if (images.length === 0) {
      setFeedback({ kind: "error", message: "이미지를 먼저 올려주세요." });
      return;
    }

    setBusy("copy");
    setFeedback(null);
    try {
      const response = await fetch("/api/studio/copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: { base64: images[0].base64, mediaType: images[0].mediaType },
          product: product
            ? {
                name: product.name,
                brand: product.brand,
                price: product.price,
                description: product.description,
              }
            : undefined,
          tone,
          variantCount,
          extraInstruction: extraInstruction || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "카피 생성에 실패했습니다.");

      const generated = data as CopyResult;
      setCopy(generated);
      applyVariant(generated, 0);
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  function applyVariant(source: CopyResult, index: number) {
    const variant = source.variants[index];
    if (!variant) return;
    setSelected(index);
    setHeadline(variant.headline);
    setMessage(variant.message);
    setDescription(variant.description);
  }

  async function publish() {
    setBusy("publish");
    setFeedback(null);
    setResult(null);
    try {
      const response = await fetch("/api/studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignName,
          objective,
          dailyBudget,
          landingUrl: product?.url ?? productInput,
          headline,
          message,
          description: description || undefined,
          callToAction,
          targeting: {
            countries: ["KR"],
            ageMin,
            ageMax,
            genders: genders === "all" ? undefined : [Number(genders)],
          },
          images: images.map((image) => ({ filename: image.filename, base64: image.base64 })),
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "광고 생성에 실패했습니다.");

      setResult(data as PublishResult);
      setFeedback({
        kind: "success",
        message: "광고 초안을 만들었습니다. 모두 일시중지 상태이므로 아직 노출되지 않습니다.",
      });
    } catch (error) {
      setFeedback({ kind: "error", message: (error as Error).message });
    } finally {
      setBusy(null);
    }
  }

  const canPublish =
    images.length > 0 &&
    Boolean(campaignName && headline && message) &&
    Boolean(product?.url ?? productInput) &&
    settings.meta.configured &&
    Boolean(settings.meta.pageId);

  return (
    <>
      {feedback && <div className={`alert alert-${feedback.kind}`}>{feedback.message}</div>}

      {/* 1. 이미지 */}
      <section className="card">
        <div className="step-head">
          <span className="step-num" data-done={images.length > 0}>
            1
          </span>
          <h2>상품 이미지</h2>
        </div>
        <p className="subtitle">
          최대 5장. 각 이미지가 별도 광고가 되어 소재별 성과를 따로 볼 수 있습니다. 긴 변 1440px
          로 자동 축소됩니다.
        </p>

        <div
          className="dropzone"
          data-over={dragOver}
          onClick={() => fileInput.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            void addFiles(event.dataTransfer.files);
          }}
        >
          이미지를 끌어다 놓거나 클릭해서 선택하세요
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(event) => {
            if (event.target.files) void addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {images.length > 0 && (
          <div className="thumbs">
            {images.map((image, index) => (
              <div key={`${image.filename}-${index}`} className="thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.preview} alt={image.filename} />
                <button
                  type="button"
                  aria-label="삭제"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                >
                  ×
                </button>
                <div className="thumb-name">
                  {image.width}×{image.height}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2. 무신사 링크 */}
      <section className="card">
        <div className="step-head">
          <span className="step-num" data-done={Boolean(product)}>
            2
          </span>
          <h2>무신사 상품 링크</h2>
        </div>
        <p className="subtitle">
          상품 페이지 주소나 상품 번호를 넣으면 상품명·가격·대표 이미지를 읽어옵니다. UTM 은
          광고를 만들 때 자동으로 붙습니다.
        </p>

        <div className="filters">
          <label className="field" style={{ flex: 1, minWidth: 280 }}>
            <span className="label">상품 URL 또는 번호</span>
            <input
              type="text"
              value={productInput}
              onChange={(event) => setProductInput(event.target.value)}
              placeholder="https://www.musinsa.com/products/1234567"
              spellCheck={false}
            />
          </label>
          <button
            type="button"
            className="btn-secondary"
            disabled={busy !== null || !productInput}
            onClick={lookupProduct}
          >
            {busy === "product" ? "불러오는 중…" : "상품 불러오기"}
          </button>
        </div>

        {product && (
          <div className="product-preview">
            {product.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.imageUrl} alt={product.name ?? "상품"} />
            )}
            <div>
              <div style={{ fontWeight: 650 }}>{product.name ?? "상품명 미확인"}</div>
              {product.brand && <div className="muted">{product.brand}</div>}
              {product.price && (
                <div style={{ marginTop: 4 }}>{formatCurrency(product.price, "KRW")}</div>
              )}
              <div className="server-url" style={{ marginTop: 6 }}>
                {product.url}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. 카피 */}
      <section className="card">
        <div className="step-head">
          <span className="step-num" data-done={Boolean(headline && message)}>
            3
          </span>
          <h2>광고 카피</h2>
        </div>
        <p className="subtitle">
          이미지를 분석해 서로 다른 소구점의 카피를 만듭니다. 마음에 드는 안을 고르고 직접
          고쳐도 됩니다.
        </p>

        {!settings.anthropic.configured ? (
          <div className="alert alert-info">
            Claude API 키가 없어 자동 생성을 쓸 수 없습니다.{" "}
            <Link href="/settings">설정</Link>에서 등록하거나, 아래에 직접 입력하세요.
          </div>
        ) : (
          <>
            <div className="filters" style={{ marginBottom: 16 }}>
              <label className="field">
                <span className="label">톤</span>
                <select value={tone} onChange={(event) => setTone(event.target.value as CopyTone)}>
                  {COPY_TONES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="label">안 개수</span>
                <select
                  value={variantCount}
                  onChange={(event) => setVariantCount(Number(event.target.value))}
                >
                  {[2, 3, 4, 5].map((count) => (
                    <option key={count} value={count}>
                      {count}개
                    </option>
                  ))}
                </select>
              </label>

              <label className="field" style={{ flex: 1, minWidth: 240 }}>
                <span className="label">추가 지시 (선택)</span>
                <input
                  type="text"
                  value={extraInstruction}
                  onChange={(event) => setExtraInstruction(event.target.value)}
                  placeholder="예: 신학기 프로모션, 무료배송 강조"
                />
              </label>

              <button
                type="button"
                className="btn-primary"
                disabled={busy !== null || images.length === 0}
                onClick={generateCopy}
              >
                {busy === "copy" ? "생성 중…" : "카피 생성"}
              </button>
            </div>

            {copy && (
              <>
                <div className="alert alert-info">
                  <strong>이미지에서 읽은 것</strong>
                  <br />
                  {copy.observed.category} · {copy.observed.colors.join(", ")} ·{" "}
                  {copy.observed.material}
                  {copy.observed.details.length > 0 && ` · ${copy.observed.details.join(", ")}`}
                </div>

                <div className="variant-list" style={{ marginBottom: 20 }}>
                  {copy.variants.map((variant, index) => (
                    <div
                      key={index}
                      className="variant"
                      data-selected={selected === index}
                      onClick={() => applyVariant(copy, index)}
                    >
                      <div className="variant-headline">{variant.headline}</div>
                      <div className="variant-message">{variant.message}</div>
                      <div className="variant-angle">
                        {variant.description} · {variant.angle}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <CopyField
          label="헤드라인"
          value={headline}
          onChange={setHeadline}
          limit={COPY_LIMITS.headline}
        />
        <CopyField
          label="본문 문구"
          value={message}
          onChange={setMessage}
          limit={COPY_LIMITS.message}
          multiline
        />
        <CopyField
          label="링크 설명"
          value={description}
          onChange={setDescription}
          limit={COPY_LIMITS.description}
        />
      </section>

      {/* 4. 캠페인 설정 */}
      <section className="card">
        <div className="step-head">
          <span className="step-num" data-done={Boolean(campaignName)}>
            4
          </span>
          <h2>캠페인 설정</h2>
        </div>
        <p className="subtitle">
          여기서 만든 캠페인·광고세트·광고는 <strong>전부 일시중지 상태</strong>입니다. 광고
          관리자에서 직접 켜야 노출이 시작됩니다.
        </p>

        <div className="grid-2">
          <label className="field">
            <span className="label">캠페인 이름</span>
            <input
              type="text"
              value={campaignName}
              onChange={(event) => setCampaignName(event.target.value)}
              placeholder="상품명 - 날짜"
            />
          </label>

          <label className="field">
            <span className="label">목표</span>
            <select
              value={objective}
              onChange={(event) => setObjective(event.target.value as "traffic" | "sales")}
            >
              <option value="traffic">트래픽 — 링크 클릭 최적화</option>
              <option value="sales">판매 — 구매 전환 최적화 (픽셀 필요)</option>
            </select>
            {objective === "sales" && !settings.meta.pixelId && (
              <span className="help" style={{ color: "var(--danger)" }}>
                픽셀 ID 가 설정되지 않았습니다. 설정에서 입력하세요.
              </span>
            )}
          </label>

          <label className="field">
            <span className="label">일 예산</span>
            <input
              type="text"
              inputMode="numeric"
              value={dailyBudget.toLocaleString("ko-KR")}
              onChange={(event) => {
                const digits = event.target.value.replace(/[^\d]/g, "");
                setDailyBudget(digits ? Number(digits) : 0);
              }}
            />
            <span className="help">{formatCurrency(dailyBudget, currency)} / 일</span>
          </label>

          <label className="field">
            <span className="label">행동 유도 버튼</span>
            <select
              value={callToAction}
              onChange={(event) => setCallToAction(event.target.value)}
            >
              {CALL_TO_ACTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span className="label">연령</span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="number"
                min={13}
                max={65}
                value={ageMin}
                onChange={(event) => setAgeMin(Number(event.target.value))}
              />
              <span className="muted">~</span>
              <input
                type="number"
                min={13}
                max={65}
                value={ageMax}
                onChange={(event) => setAgeMax(Number(event.target.value))}
              />
            </div>
          </label>

          <label className="field">
            <span className="label">성별</span>
            <select
              value={genders}
              onChange={(event) => setGenders(event.target.value as "all" | "1" | "2")}
            >
              <option value="all">전체</option>
              <option value="2">여성</option>
              <option value="1">남성</option>
            </select>
          </label>
        </div>

        {!settings.meta.pageId && (
          <div className="alert alert-error">
            페이스북 페이지 ID 가 없어 광고를 만들 수 없습니다.{" "}
            <Link href="/settings">설정</Link>에서 입력하세요.
          </div>
        )}

        <div className="actions">
          <button
            type="button"
            className="btn-primary"
            disabled={busy !== null || !canPublish}
            onClick={publish}
          >
            {busy === "publish" ? "만드는 중…" : "광고 초안 만들기 (일시중지 상태)"}
          </button>
        </div>
      </section>

      {result && (
        <section className="card">
          <h2>생성 완료</h2>
          <p className="subtitle">
            모두 일시중지 상태입니다. 광고 관리자에서 검토 후 켜세요.
          </p>
          <div className="result-links">
            <div>캠페인 {result.campaignId}</div>
            <div>광고세트 {result.adSetId}</div>
            {result.ads.map((ad) => (
              <div key={ad.adId}>
                광고 {ad.adId} — {ad.filename}
              </div>
            ))}
            <div style={{ marginTop: 8 }}>랜딩 {result.landingUrl}</div>
          </div>
          <div className="actions" style={{ marginTop: 16 }}>
            <a href={result.managerUrl} target="_blank" rel="noreferrer">
              <button type="button" className="btn-primary">
                광고 관리자에서 열기
              </button>
            </a>
          </div>
        </section>
      )}
    </>
  );
}

function CopyField({
  label,
  value,
  onChange,
  limit,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  limit: number;
  multiline?: boolean;
}) {
  const over = value.length > limit;

  return (
    <label className="field">
      <span className="label">
        {label}
        <span className="count" data-over={over}>
          {value.length} / {limit}
        </span>
      </span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}
