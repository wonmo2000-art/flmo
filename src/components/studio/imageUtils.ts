"use client";

export interface PreparedImage {
  filename: string;
  /** 데이터 URI 접두사를 뗀 순수 base64. */
  base64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  /** <img src> 에 바로 쓸 수 있는 데이터 URI. */
  preview: string;
  width: number;
  height: number;
}

/** 메타 권장 해상도. 이보다 크면 업로드만 무거워지고 화질 이득이 없다. */
const MAX_EDGE = 1440;
const JPEG_QUALITY = 0.9;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`이미지를 읽지 못했습니다: ${file.name}`));
    };
    image.src = url;
  });
}

/**
 * 이미지를 긴 변 기준 MAX_EDGE 이하로 줄이고 base64 로 바꾼다.
 *
 * 원본을 그대로 올리면 Claude 로 보내는 요청도, 메타로 올리는 요청도 커진다.
 * 투명도가 있는 PNG 는 PNG 로 유지하고, 나머지는 JPEG 로 변환한다.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`이미지 파일이 아닙니다: ${file.name}`);
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const width = Math.round(image.width * scale);
  const height = Math.round(image.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("브라우저가 캔버스를 지원하지 않습니다.");

  const keepAlpha = file.type === "image/png";
  if (!keepAlpha) {
    // JPEG 은 투명도를 모른다. 흰 배경을 깔아야 검게 나오지 않는다.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);

  const mediaType = keepAlpha ? "image/png" : "image/jpeg";
  const dataUrl = canvas.toDataURL(mediaType, JPEG_QUALITY);

  return {
    filename: file.name,
    base64: dataUrl.split(",")[1] ?? "",
    mediaType,
    preview: dataUrl,
    width,
    height,
  };
}
