#!/usr/bin/env node
/**
 * flmo 실행기.
 *
 * 설치·키 생성·빌드를 알아서 처리하고 서버를 띄운다.
 * 처음 쓰는 사람이 터미널에서 할 일은 이것 하나뿐이도록 만드는 게 목적이다.
 */
import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

import {
  ROOT,
  checkNodeVersion,
  ensureBuild,
  ensureDependencies,
  ensureEncryptionKey,
  loadEnvFile,
  log,
} from "../scripts/setup.mjs";

const DEFAULT_PORT = 3000;

/** 포트가 비었는지 확인한다. */
function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => server.close(() => resolve(true)));
    server.listen(port, "127.0.0.1");
  });
}

/** 원하는 포트가 막혀 있으면 다음 빈 포트를 찾는다. */
async function pickPort(preferred) {
  for (let port = preferred; port < preferred + 20; port += 1) {
    if (await isPortFree(port)) return port;
  }
  throw new Error(`${preferred} 부터 20개 포트가 모두 사용 중입니다.`);
}

function openBrowser(url) {
  const command =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";

  try {
    spawn(command, [url], {
      stdio: "ignore",
      detached: true,
      shell: process.platform === "win32",
    }).unref();
  } catch {
    // 브라우저를 못 열어도 서버는 돌아간다. 주소를 출력했으니 직접 열면 된다.
  }
}

/**
 * Next 서버를 띄운다.
 *
 * npx 를 거치면 래퍼 프로세스가 하나 더 생겨서, 그걸 죽여도 손자 프로세스가
 * 남아 파이프를 붙잡는다. next 바이너리를 node 로 직접 실행해 자식이 하나만
 * 생기게 한다.
 */
function startServer(port, { dev = false, quiet = false } = {}) {
  const nextBin = path.join(ROOT, "node_modules", "next", "dist", "bin", "next");
  const args = [nextBin, dev ? "dev" : "start", "-p", String(port)];

  return spawn(process.execPath, args, {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port) },
    // quiet 일 때 파이프를 열어두면 자식이 살아 있는 동안 부모가 종료되지 않는다.
    stdio: quiet ? "ignore" : "inherit",
  });
}

/** 자식이 확실히 죽을 때까지 기다린다. */
function stopServer(child) {
  return new Promise((resolve) => {
    if (child.exitCode !== null || child.signalCode !== null) return resolve();

    const force = setTimeout(() => child.kill("SIGKILL"), 3000);
    child.once("close", () => {
      clearTimeout(force);
      resolve();
    });
    child.kill("SIGTERM");
  });
}

/** 서버가 응답할 때까지 기다린다. */
async function waitForServer(baseUrl, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/api/settings`, {
        signal: AbortSignal.timeout(2000),
      });
      if (response.ok || response.status < 500) return;
    } catch {
      // 아직 안 떴다. 잠시 후 다시.
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }

  throw new Error("서버가 제한 시간 안에 시작되지 않았습니다.");
}

/** 준비를 마치고 공통 상태를 돌려준다. */
async function prepare() {
  checkNodeVersion();
  loadEnvFile();

  const createdKey = ensureEncryptionKey();
  if (createdKey) log("  설정 암호화 키를 새로 만들어 .env.local 에 저장했습니다.");

  const installed = await ensureDependencies();
  const built = await ensureBuild();

  return { createdKey, installed, built };
}

/** 서버를 잠깐 띄워 API 를 쓰고 바로 내린다. report·doctor 가 쓴다. */
async function withServer(task) {
  await prepare();

  const port = await pickPort(4300);
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = startServer(port, { quiet: true });

  try {
    await waitForServer(baseUrl);
    return await task(baseUrl);
  } finally {
    await stopServer(server);
  }
}

// ── start ────────────────────────────────────────────────────────

async function commandStart(options) {
  log("flmo 를 준비하는 중입니다…");
  const { installed, built } = await prepare();
  if (installed) log("  의존성 설치를 마쳤습니다.");
  if (built) log("  빌드를 마쳤습니다.");

  const port = await pickPort(options.port ?? DEFAULT_PORT);
  const url = `http://localhost:${port}`;

  log("");
  log(`  flmo 가 ${url} 에서 실행 중입니다.`);
  log("  종료하려면 이 창에서 Ctrl+C 를 누르세요.");
  log("");

  const server = startServer(port);

  if (!options.noOpen) {
    // 서버가 응답하기 시작한 뒤에 열어야 빈 화면을 안 본다.
    void waitForServer(url).then(() => openBrowser(url)).catch(() => undefined);
  }

  const shutdown = () => {
    void stopServer(server).then(() => process.exit(0));
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  server.on("close", (code) => process.exit(code ?? 0));
}

// ── dev ──────────────────────────────────────────────────────────

async function commandDev(options) {
  checkNodeVersion();
  loadEnvFile();
  ensureEncryptionKey();
  await ensureDependencies();

  const port = await pickPort(options.port ?? DEFAULT_PORT);
  log(`개발 서버: http://localhost:${port}`);

  const server = startServer(port, { dev: true });
  process.on("SIGINT", () => void stopServer(server));
  server.on("close", (code) => process.exit(code ?? 0));
}

// ── report ───────────────────────────────────────────────────────

const NUMBER = new Intl.NumberFormat("ko-KR");

/** 한글·전각 문자는 터미널에서 두 칸을 차지한다. 폭 계산에 반영해야 표가 어긋나지 않는다. */
const WIDE = /[\u1100-\u115F\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE6F\uFF00-\uFF60\uFFE0-\uFFE6]/;

function displayWidth(text) {
  return [...String(text)].reduce((sum, char) => sum + (WIDE.test(char) ? 2 : 1), 0);
}

function pad(text, width, align = "left") {
  const value = String(text);
  const padding = " ".repeat(Math.max(0, width - displayWidth(value)));
  return align === "right" ? padding + value : value + padding;
}

function printTable(rows, columns) {
  const widths = columns.map((column) =>
    Math.max(displayWidth(column.label), ...rows.map((row) => displayWidth(column.get(row)))),
  );

  const line = (cells) => cells.join("  ");
  const header = line(columns.map((column, i) => pad(column.label, widths[i], column.align)));

  log(header);
  // 박스 드로잉 문자는 터미널마다 폭이 달라 정렬이 어긋난다. ASCII 로 긋는다.
  log("-".repeat(displayWidth(header)));

  for (const row of rows) {
    log(line(columns.map((column, i) => pad(column.get(row), widths[i], column.align))));
  }
}

async function commandReport(options) {
  const report = await withServer(async (baseUrl) => {
    const params = new URLSearchParams({
      level: options.level ?? "campaign",
      datePreset: options.period ?? "last_7d",
    });

    const response = await fetch(`${baseUrl}/api/report?${params}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "리포트를 불러오지 못했습니다.");
    return data;
  });

  if (options.json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  if (options.csv) {
    const header = "이름,광고비,노출,클릭,링크클릭,CTR,CPC,CPM,전환,전환매출,ROAS";
    const lines = report.rows.map((row) =>
      [
        `"${String(row.name).replace(/"/g, '""')}"`,
        row.spend,
        row.impressions,
        row.clicks,
        row.linkClicks,
        row.ctr.toFixed(2),
        row.cpc.toFixed(0),
        row.cpm.toFixed(0),
        row.purchases,
        row.purchaseValue,
        row.roas.toFixed(2),
      ].join(","),
    );

    const { writeFileSync } = await import("node:fs");
    // 엑셀이 한글을 깨뜨리지 않도록 BOM 을 붙인다.
    writeFileSync(options.csv, `﻿${[header, ...lines].join("\n")}\n`, "utf8");
    log(`CSV 를 저장했습니다: ${path.resolve(options.csv)}`);
    return;
  }

  const summary = report.summary;
  log("");
  log(`  ${report.account.name ?? report.account.id} · ${report.period.label}`);
  log(`  ${report.period.since} ~ ${report.period.until}`);
  log("");
  log(
    `  광고비 ${NUMBER.format(summary.spend)}원   ` +
      `노출 ${NUMBER.format(summary.impressions)}   ` +
      `클릭 ${NUMBER.format(summary.clicks)}   ` +
      `CTR ${summary.ctr.toFixed(2)}%`,
  );
  log(
    `  전환 ${NUMBER.format(summary.purchases)}   ` +
      `매출 ${NUMBER.format(summary.purchaseValue)}원   ` +
      `ROAS ${summary.roas.toFixed(2)}x`,
  );
  log("");

  if (report.rows.length === 0) {
    log("  해당 기간에 집행된 데이터가 없습니다.");
    return;
  }

  printTable(report.rows, [
    { label: "이름", get: (row) => row.name },
    { label: "광고비", align: "right", get: (row) => NUMBER.format(row.spend) },
    { label: "노출", align: "right", get: (row) => NUMBER.format(row.impressions) },
    { label: "클릭", align: "right", get: (row) => NUMBER.format(row.clicks) },
    { label: "CTR", align: "right", get: (row) => `${row.ctr.toFixed(2)}%` },
    { label: "전환", align: "right", get: (row) => NUMBER.format(row.purchases) },
    { label: "ROAS", align: "right", get: (row) => `${row.roas.toFixed(2)}x` },
  ]);
  log("");
}

// ── doctor ───────────────────────────────────────────────────────

async function commandDoctor() {
  log("flmo 상태를 점검합니다…");
  log("");

  // 키 검사 전에 .env.local 을 읽어야 한다.
  loadEnvFile();

  const problems = [];
  /** optional 항목은 비어 있어도 문제로 세지 않는다. */
  const check = (label, ok, detail, optional = false) => {
    if (!ok && !optional) problems.push(label);
    const mark = ok ? "✓" : optional ? "·" : "✗";
    log(`  ${mark} ${label}${detail ? ` — ${detail}` : ""}`);
  };

  check("Node.js", true, process.versions.node);
  check("암호화 키", Boolean(process.env.FLMO_ENCRYPTION_KEY), ".env.local");

  const settings = await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/settings`);
    return response.json();
  });

  check(
    "메타 광고 계정",
    settings.meta?.configured ?? false,
    settings.meta?.configured
      ? `${settings.meta.accountName ?? settings.meta.adAccountId}`
      : "설정 → 메타 광고 탭에서 연결하세요",
  );
  check(
    "페이스북 페이지 ID",
    Boolean(settings.meta?.pageId),
    settings.meta?.pageId ? settings.meta.pageId : "없으면 광고를 만들 수 없습니다 (리포트만 볼 거면 불필요)",
    true,
  );
  check(
    "Claude API",
    settings.anthropic?.configured ?? false,
    settings.anthropic?.configured ? settings.anthropic.model : "카피 자동 생성에만 필요합니다 (선택)",
    true,
  );
  check(
    "MCP 커넥터",
    (settings.mcp?.length ?? 0) > 0,
    settings.mcp?.length ? `${settings.mcp.length}개 등록됨` : "등록된 서버 없음 (선택)",
    true,
  );

  log("");
  if (problems.length === 0) {
    log("  광고를 만들 준비가 됐습니다.");
  } else {
    log(`  ${problems.length}개 항목을 확인하세요: ${problems.join(", ")}`);
    log("  flmo 를 실행하고 설정 화면에서 연결하면 됩니다.");
  }
}

// ── 진입점 ────────────────────────────────────────────────────────

const HELP = `
flmo — 무신사 상품 이미지로 메타 광고를 만들고 성과를 보는 프로그램

사용법
  flmo [start]              앱을 실행하고 브라우저를 엽니다 (기본)
  flmo report               성과를 터미널에 출력합니다
  flmo doctor               연결 상태를 점검합니다
  flmo dev                  개발 서버를 실행합니다

start 옵션
  --port <번호>             사용할 포트 (기본 3000, 막혀 있으면 자동으로 다음 포트)
  --no-open                 브라우저를 열지 않습니다

report 옵션
  --level <단위>            account | campaign | adset | ad  (기본 campaign)
  --period <기간>           today | yesterday | last_7d | last_14d | last_30d
                            this_month | last_month        (기본 last_7d)
  --csv <파일>              결과를 CSV 로 저장합니다
  --json                    원본 JSON 을 출력합니다

예시
  flmo
  flmo report --level ad --period last_30d
  flmo report --csv 8월성과.csv
`.trim();

function parseArgs(argv) {
  const options = {};
  const positional = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }

    const key = arg.slice(2);
    switch (key) {
      case "no-open":
        options.noOpen = true;
        break;
      case "json":
        options.json = true;
        break;
      case "help":
        options.help = true;
        break;
      case "port":
        options.port = Number(argv[++i]);
        break;
      default:
        options[key] = argv[++i];
    }
  }

  return { command: positional[0] ?? "start", options };
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (options.help || command === "help") {
    log(HELP);
    return;
  }

  switch (command) {
    case "start":
      await commandStart(options);
      break;
    case "dev":
      await commandDev(options);
      break;
    case "report":
      await commandReport(options);
      break;
    case "doctor":
      await commandDoctor(options);
      break;
    default:
      log(`알 수 없는 명령입니다: ${command}\n`);
      log(HELP);
      process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`\n오류: ${error.message}\n\n`);
  process.exitCode = 1;
});
