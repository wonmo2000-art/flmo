import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

import { decrypt, encrypt, maskToken } from "../crypto";
import { DEFAULT_SETTINGS, type McpServerConfig, type Settings } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
/** 초기 버전이 쓰던 파일. 처음 읽을 때 한 번 마이그레이션한다. */
const LEGACY_FILE = path.join(DATA_DIR, "credentials.json");

interface StoredShape {
  version: 2;
  /** Settings 전체를 JSON 직렬화해 암호화한 값. */
  payload: string;
  updatedAt: string;
}

/** 사용자가 `1234` 로 넣든 `act_1234` 로 넣든 `act_1234` 로 통일한다. */
export function normalizeAdAccountId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;
  return trimmed.startsWith("act_") ? trimmed : `act_${trimmed.replace(/^act/, "")}`;
}

async function readFileIfExists(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

/** v1 형식(자격증명만 담던 파일)을 v2 설정 구조로 옮긴다. */
async function migrateLegacy(): Promise<Settings | null> {
  const raw = await readFileIfExists(LEGACY_FILE);
  if (!raw) return null;

  const legacy = JSON.parse(raw) as {
    adAccountId: string;
    accessToken: string;
    accountName?: string;
    currency?: string;
  };

  const settings: Settings = {
    ...DEFAULT_SETTINGS,
    meta: {
      adAccountId: legacy.adAccountId,
      accessToken: decrypt(legacy.accessToken),
      accountName: legacy.accountName,
      currency: legacy.currency,
    },
  };

  await writeSettings(settings);
  await fs.unlink(LEGACY_FILE).catch(() => undefined);
  return settings;
}

async function readSettings(): Promise<Settings> {
  const raw = await readFileIfExists(SETTINGS_FILE);
  if (!raw) {
    return (await migrateLegacy()) ?? structuredClone(DEFAULT_SETTINGS);
  }

  const stored = JSON.parse(raw) as StoredShape;
  const parsed = JSON.parse(decrypt(stored.payload)) as Settings;
  return { ...structuredClone(DEFAULT_SETTINGS), ...parsed, mcp: parsed.mcp ?? [] };
}

async function writeSettings(settings: Settings): Promise<void> {
  const stored: StoredShape = {
    version: 2,
    payload: encrypt(JSON.stringify(settings)),
    updatedAt: new Date().toISOString(),
  };

  await fs.mkdir(DATA_DIR, { recursive: true, mode: 0o700 });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(stored, null, 2), { mode: 0o600 });
}

/**
 * 환경변수가 있으면 메타 설정을 덮어쓴다.
 * CI·크론처럼 UI 를 못 쓰는 환경을 위한 경로다.
 */
function applyEnvOverrides(settings: Settings): Settings {
  const adAccountId = process.env.META_AD_ACCOUNT_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  if (!adAccountId || !accessToken) return settings;

  return {
    ...settings,
    meta: {
      ...settings.meta,
      adAccountId: normalizeAdAccountId(adAccountId),
      accessToken,
    },
  };
}

export async function getSettings(): Promise<Settings> {
  return applyEnvOverrides(await readSettings());
}

/** 섹션 하나만 갈아끼운다. 나머지 섹션은 그대로 둔다. */
export async function updateSection<K extends keyof Settings>(
  section: K,
  value: Settings[K],
): Promise<Settings> {
  const settings = await readSettings();
  const next = { ...settings, [section]: value };
  await writeSettings(next);
  return applyEnvOverrides(next);
}

export async function clearSection(section: keyof Settings): Promise<Settings> {
  const settings = await readSettings();
  const next = { ...settings };
  if (section === "mcp") next.mcp = [];
  else delete next[section];
  await writeSettings(next);
  return applyEnvOverrides(next);
}

export async function upsertMcpServer(server: McpServerConfig): Promise<McpServerConfig[]> {
  const settings = await readSettings();
  const existing = settings.mcp.findIndex((item) => item.id === server.id);
  const mcp = [...settings.mcp];

  if (existing >= 0) mcp[existing] = { ...mcp[existing], ...server };
  else mcp.push(server);

  await writeSettings({ ...settings, mcp });
  return mcp;
}

export async function removeMcpServer(id: string): Promise<McpServerConfig[]> {
  const settings = await readSettings();
  const mcp = settings.mcp.filter((item) => item.id !== id);
  await writeSettings({ ...settings, mcp });
  return mcp;
}

/** 메타 설정을 쓰기 전에 필수값이 있는지 확인한다. */
export function requireMeta(settings: Settings): {
  adAccountId: string;
  accessToken: string;
} {
  if (!settings.meta?.adAccountId || !settings.meta.accessToken) {
    throw new Error("메타 광고 계정이 연결되지 않았습니다. 설정에서 먼저 연결하세요.");
  }
  return { adAccountId: settings.meta.adAccountId, accessToken: settings.meta.accessToken };
}

/** UI 로 내려보내도 안전한 형태. 모든 비밀값이 마스킹되어 있다. */
export interface SettingsView {
  meta: {
    configured: boolean;
    adAccountId?: string;
    accountName?: string;
    currency?: string;
    maskedToken?: string;
    pageId?: string;
    instagramActorId?: string;
    pixelId?: string;
    fromEnv: boolean;
  };
  musinsa: {
    brandName?: string;
    storeUrl?: string;
    utmSource: string;
    utmMedium: string;
    utmCampaign?: string;
  };
  anthropic: { configured: boolean; maskedKey?: string; model: string };
  mcp: (Omit<McpServerConfig, "bearerToken"> & { hasToken: boolean })[];
}

export async function getSettingsView(): Promise<SettingsView> {
  const settings = await getSettings();
  const fromEnv = Boolean(process.env.META_AD_ACCOUNT_ID && process.env.META_ACCESS_TOKEN);

  return {
    meta: {
      configured: Boolean(settings.meta?.adAccountId && settings.meta.accessToken),
      adAccountId: settings.meta?.adAccountId,
      accountName: settings.meta?.accountName,
      currency: settings.meta?.currency,
      maskedToken: settings.meta?.accessToken ? maskToken(settings.meta.accessToken) : undefined,
      pageId: settings.meta?.pageId,
      instagramActorId: settings.meta?.instagramActorId,
      pixelId: settings.meta?.pixelId,
      fromEnv,
    },
    musinsa: {
      brandName: settings.musinsa?.brandName,
      storeUrl: settings.musinsa?.storeUrl,
      utmSource: settings.musinsa?.utmSource ?? "meta",
      utmMedium: settings.musinsa?.utmMedium ?? "cpc",
      utmCampaign: settings.musinsa?.utmCampaign,
    },
    anthropic: {
      configured: Boolean(settings.anthropic?.apiKey),
      maskedKey: settings.anthropic?.apiKey ? maskToken(settings.anthropic.apiKey) : undefined,
      model: settings.anthropic?.model ?? "claude-opus-5",
    },
    mcp: settings.mcp.map(({ bearerToken, ...rest }) => ({
      ...rest,
      hasToken: Boolean(bearerToken),
    })),
  };
}
