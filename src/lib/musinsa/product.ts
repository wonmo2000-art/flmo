import "server-only";

import type { MusinsaProduct } from "./types";
import { canonicalUrlFor, parseMusinsaUrl } from "./url";

export type { MusinsaProduct };

/** <meta property="og:xxx" content="..."> 를 뽑는다. 속성 순서가 뒤바뀐 경우도 잡는다. */
function readMeta(html: string, property: string): string | undefined {
  const escaped = property.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${escaped}["'][^>]*content=["']([^"']*)["']`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${escaped}["']`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]).trim();
  }
  return undefined;
}

function decodeEntities(input: string): string {
  return input
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

interface JsonLdProduct {
  "@type"?: string | string[];
  name?: string;
  image?: string | string[];
  description?: string;
  brand?: { name?: string } | string;
  offers?: { price?: string | number; priceCurrency?: string } | { price?: string | number }[];
}

/** JSON-LD 블록에서 Product 스키마를 찾는다. og 태그보다 정보가 정확한 편이다. */
function readJsonLd(html: string): JsonLdProduct | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );

  for (const block of blocks) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(block[1].trim());
    } catch {
      continue;
    }

    const candidates: unknown[] = Array.isArray(parsed)
      ? parsed
      : [parsed, ...(((parsed as { "@graph"?: unknown[] })["@graph"] as unknown[]) ?? [])];

    for (const candidate of candidates) {
      const item = candidate as JsonLdProduct;
      const type = item?.["@type"];
      const types = Array.isArray(type) ? type : [type];
      if (types.includes("Product")) return item;
    }
  }

  return null;
}

function firstOffer(offers: JsonLdProduct["offers"]): { price?: number; currency?: string } {
  if (!offers) return {};
  const offer = Array.isArray(offers) ? offers[0] : offers;
  if (!offer) return {};

  const price = Number(offer.price);
  return {
    price: Number.isFinite(price) ? price : undefined,
    currency: (offer as { priceCurrency?: string }).priceCurrency,
  };
}

/**
 * 무신사 상품 페이지를 읽어 광고에 쓸 정보를 뽑는다.
 *
 * 무신사는 상품 조회용 공개 API 를 제공하지 않는다 (파트너 API 는 주문 연동 전용).
 * 그래서 공개된 상품 페이지의 og 태그와 JSON-LD 를 읽는 방식을 쓴다.
 * 페이지 구조가 바뀌면 값이 비어 올 수 있으므로, 실패해도 예외 대신
 * warning 을 담아 돌려주고 사용자가 직접 채우게 한다.
 */
export async function fetchMusinsaProduct(input: string): Promise<MusinsaProduct> {
  const parsed = parseMusinsaUrl(input);
  if (!parsed) {
    throw new Error(
      "무신사 상품 URL 을 인식하지 못했습니다. 상품 페이지 주소나 상품 번호를 넣어주세요.",
    );
  }

  const fallback: MusinsaProduct = {
    goodsNo: parsed.goodsNo,
    url: parsed.canonicalUrl,
  };

  // 스크레이핑 대상만 바꿀 수 있게 한다. 광고에 실리는 canonicalUrl 은 항상 실제 주소다.
  const fetchUrl = process.env.MUSINSA_BASE
    ? `${process.env.MUSINSA_BASE.replace(/\/$/, "")}/products/${parsed.goodsNo}`
    : parsed.canonicalUrl;

  let html: string;
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        // 봇 차단을 피하려고 일반 브라우저 UA 를 쓴다.
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      return {
        ...fallback,
        warning: `상품 페이지를 읽지 못했습니다 (HTTP ${response.status}). 상품명과 이미지를 직접 입력하세요.`,
      };
    }
    html = await response.text();
  } catch (error) {
    return {
      ...fallback,
      warning: `상품 페이지에 접근하지 못했습니다: ${(error as Error).message}. 상품명과 이미지를 직접 입력하세요.`,
    };
  }

  const jsonLd = readJsonLd(html);
  const offer = firstOffer(jsonLd?.offers);
  const ogTitle = readMeta(html, "og:title");
  const ogImage = readMeta(html, "og:image");

  const jsonLdImage = Array.isArray(jsonLd?.image) ? jsonLd?.image[0] : jsonLd?.image;
  const brand =
    typeof jsonLd?.brand === "string" ? jsonLd.brand : jsonLd?.brand?.name;

  const product: MusinsaProduct = {
    ...fallback,
    name: jsonLd?.name ?? ogTitle,
    brand,
    price: offer.price,
    currency: offer.currency ?? "KRW",
    imageUrl: jsonLdImage ?? ogImage,
    description: jsonLd?.description ?? readMeta(html, "og:description"),
  };

  if (!product.name) {
    product.warning =
      "페이지에서 상품 정보를 찾지 못했습니다. 무신사가 구조를 바꿨을 수 있습니다. 직접 입력하세요.";
  }

  return product;
}

export { canonicalUrlFor };
