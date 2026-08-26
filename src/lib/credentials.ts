import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { decrypt, encrypt, maskToken } from "./crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const CREDENTIALS_FILE = path.join(DATA_DIR, "credentials.json");

export interface Credentials {
  /** act_ 접두사를 포함한 광고 계정 ID */
  adAccountId: string;
  /** 시스템 사용자 장기 액세스 토큰 (평문) */
  accessToken: string;
  /** 검증 시 확인한 계정 이름 — 화면 표시용 */
  accountName?: string;
  /** 계정 통화 코드 (KRW, USD …) — 금액 포맷에 사용 */
  currency?: string;
  /** 마지막 저장 시각 (ISO) */
  savedAt: string;
}

/** UI 로 내려보내도 안전한 형태. 토큰이 마스킹되어 있다. */
export interface CredentialsSummary {
  configured: boolean;
  adAccountId?: string;
  accountName?: string;
  currency?: string;
  maskedToken?: string;
  savedAt?: string;
  /** 환경변수로 주입된 값인지 여부 (UI 에서 수정 불가로 표시) */
  source?: "env" | "file";
}

interface StoredShape {
  version: 1;
  adAccountId: string;
  /** encrypt() 로 암호화된 토큰 */
  accessToken: string;
  accountName?: string;
  currency?: string;
  savedAt: string;
}

/**
 * 환경변수에 자격증명이 있으면 그걸 우선한다.
 * CI·크론처럼 UI 를 못 쓰는 환경을 위한 경로.
 */
function fromEnv(): Credentials | null {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!adAccountId || !accessToken) return null;

  return {
    adAccountId: normalizeAdAccountId(adAccountId),
    accessToken,
    savedAt: "env",
  };
}

/** 사용자가 `1234` 로 넣든 `act_1234` 로 넣든 `act_1234` 로 통일한다. */
export function normalizeAdAccountId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("act_") ? trimmed : `act_${trimmed.replace(/^act/, "")}`;
}

export async function loadCredentials(): Promise<Credentials | null> {
  const env = fromEnv();
  if (env) return env;

  let raw: string;
  try {
    raw = await fs.readFile(CREDENTIALS_FILE, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }

  const stored = JSON.parse(raw) as StoredShape;
  return {
    adAccountId: stored.adAccountId,
    accessToken: decrypt(stored.accessToken),
    accountName: stored.accountName,
    currency: stored.currency,
    savedAt: stored.savedAt,
  };
}

export async function saveCredentials(
  input: Omit<Credentials, "savedAt">,
): Promise<Credentials> {
  const savedAt = new Date().toISOString();
  const stored: StoredShape = {
    version: 1,
    adAccountId: normalizeAdAccountId(input.adAccountId),
    accessToken: encrypt(input.accessToken),
    accountName: input.accountName,
    currency: input.currency,
    savedAt,
  };

  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  // 파일 권한을 소유자 전용으로. 토큰이 담긴 파일이다.
  await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(stored, null, 2), { mode: 0o600 });

  return { ...input, adAccountId: stored.adAccountId, savedAt };
}

export async function clearCredentials(): Promise<void> {
  try {
    await fs.unlink(CREDENTIALS_FILE);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
}

export async function getCredentialsSummary(): Promise<CredentialsSummary> {
  const credentials = await loadCredentials();
  if (!credentials) return { configured: false };

  return {
    configured: true,
    adAccountId: credentials.adAccountId,
    accountName: credentials.accountName,
    currency: credentials.currency,
    maskedToken: maskToken(credentials.accessToken),
    savedAt: credentials.savedAt,
    source: credentials.savedAt === "env" ? "env" : "file",
  };
}
