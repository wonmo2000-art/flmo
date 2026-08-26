import "server-only";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";

import type { McpServerConfig } from "../settings/types";

export interface McpToolInfo {
  name: string;
  description?: string;
  /** 입력 스키마의 최상위 속성 이름들 — UI 에서 요약해 보여준다. */
  inputKeys: string[];
}

export interface McpProbeResult {
  ok: boolean;
  serverName?: string;
  serverVersion?: string;
  tools: McpToolInfo[];
  error?: string;
  /** OAuth 가 필요한 서버인지. true 면 브라우저 로그인 안내를 띄운다. */
  needsOAuth?: boolean;
}

const CLIENT_INFO = { name: "flmo", version: "0.1.0" };
const CONNECT_TIMEOUT_MS = 15_000;

function buildTransport(config: McpServerConfig): Transport {
  const url = new URL(config.url);
  const requestInit: RequestInit = config.bearerToken
    ? { headers: { Authorization: `Bearer ${config.bearerToken}` } }
    : {};

  return config.transport === "sse"
    ? new SSEClientTransport(url, { requestInit })
    : new StreamableHTTPClientTransport(url, { requestInit });
}

/** 응답이 401/UnauthorizedError 계열이면 OAuth 가 필요한 서버로 본다. */
function looksLikeAuthFailure(error: unknown): boolean {
  const message = (error as Error)?.message ?? "";
  return (
    (error as Error)?.name === "UnauthorizedError" ||
    /401|unauthor|invalid_token|forbidden/i.test(message)
  );
}

/**
 * MCP 서버에 붙어 도구 목록을 읽고 바로 끊는다.
 * 설정 화면의 "연결 테스트" 가 쓴다.
 */
export async function probeMcpServer(config: McpServerConfig): Promise<McpProbeResult> {
  const client = new Client(CLIENT_INFO, { capabilities: {} });
  let transport: Transport;

  try {
    transport = buildTransport(config);
  } catch (error) {
    return { ok: false, tools: [], error: `URL 이 올바르지 않습니다: ${(error as Error).message}` };
  }

  try {
    await withTimeout(client.connect(transport), CONNECT_TIMEOUT_MS, "연결");

    const version = client.getServerVersion();
    const { tools } = await withTimeout(client.listTools(), CONNECT_TIMEOUT_MS, "도구 목록 조회");

    return {
      ok: true,
      serverName: version?.name,
      serverVersion: version?.version,
      tools: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputKeys: Object.keys(
          (tool.inputSchema as { properties?: Record<string, unknown> })?.properties ?? {},
        ),
      })),
    };
  } catch (error) {
    const needsOAuth = looksLikeAuthFailure(error);
    return {
      ok: false,
      tools: [],
      needsOAuth,
      error: needsOAuth
        ? "인증이 필요한 서버입니다. 액세스 토큰을 입력하거나, OAuth 만 지원하는 서버라면 Claude 커넥터로 연결하세요."
        : (error as Error).message,
    };
  } finally {
    await client.close().catch(() => undefined);
  }
}

/** MCP 도구를 한 번 호출하고 끊는다. */
export async function callMcpTool(
  config: McpServerConfig,
  toolName: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  const client = new Client(CLIENT_INFO, { capabilities: {} });

  try {
    await withTimeout(client.connect(buildTransport(config)), CONNECT_TIMEOUT_MS, "연결");
    // 생성 계열 도구는 오래 걸리므로 호출 타임아웃을 넉넉히 준다.
    return await client.callTool({ name: toolName, arguments: args }, undefined, {
      timeout: 300_000,
    });
  } finally {
    await client.close().catch(() => undefined);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}이(가) ${ms / 1000}초 안에 끝나지 않았습니다.`)), ms),
    ),
  ]);
}
