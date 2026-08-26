/**
 * 첫 실행 준비. 사용자가 손댈 게 없도록 필요한 것을 알아서 만든다.
 * - .env.local 이 없으면 만들고 암호화 키를 생성해 넣는다
 * - 의존성이 없으면 설치한다
 * - 빌드가 없거나 소스보다 오래됐으면 다시 빌드한다
 */
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// fileURLToPath 를 써야 윈도우 경로(선행 슬래시)가 깨지지 않는다.
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ENV_FILE = path.join(ROOT, ".env.local");
const NODE_MODULES = path.join(ROOT, "node_modules");
const BUILD_ID = path.join(ROOT, ".next", "BUILD_ID");

/** 최소 Node 버전. Next 15 가 요구하는 선. */
const MIN_NODE_MAJOR = 20;

export function log(message) {
  process.stdout.write(`${message}\n`);
}

export function checkNodeVersion() {
  const major = Number(process.versions.node.split(".")[0]);
  if (major < MIN_NODE_MAJOR) {
    throw new Error(
      `Node.js ${MIN_NODE_MAJOR} 이상이 필요합니다 (현재 ${process.versions.node}).\n` +
        "https://nodejs.org 에서 LTS 버전을 설치하세요.",
    );
  }
}

/** .env.local 을 읽어 process.env 에 채운다. 이미 있는 값은 덮어쓰지 않는다. */
export function loadEnvFile() {
  if (!fs.existsSync(ENV_FILE)) return;

  for (const line of fs.readFileSync(ENV_FILE, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index < 0) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

/**
 * 암호화 키를 확보한다. 없으면 새로 만들어 .env.local 에 적는다.
 *
 * 키가 바뀌면 저장된 설정을 복호화할 수 없으므로, 이미 있으면 절대 건드리지 않는다.
 */
export function ensureEncryptionKey() {
  loadEnvFile();
  if (process.env.FLMO_ENCRYPTION_KEY) return false;

  const key = crypto.randomBytes(32).toString("base64");
  const block =
    "\n# 자동 생성된 설정 암호화 키입니다.\n" +
    "# 이 값이 바뀌면 저장해 둔 계정 연결 정보를 읽을 수 없습니다. 지우지 마세요.\n" +
    `FLMO_ENCRYPTION_KEY=${key}\n`;

  if (fs.existsSync(ENV_FILE)) {
    fs.appendFileSync(ENV_FILE, block);
  } else {
    fs.writeFileSync(ENV_FILE, block.trimStart(), { mode: 0o600 });
  }
  fs.chmodSync(ENV_FILE, 0o600);

  process.env.FLMO_ENCRYPTION_KEY = key;
  return true;
}

function run(command, args, label) {
  return new Promise((resolve, reject) => {
    log(`  ${label}…`);
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      shell: process.platform === "win32",
    });

    let tail = "";
    const collect = (chunk) => {
      tail = (tail + chunk).slice(-4000);
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${label} 실패 (종료 코드 ${code})\n${tail}`));
    });
  });
}

export async function ensureDependencies() {
  if (fs.existsSync(path.join(NODE_MODULES, "next"))) return false;
  await run("npm", ["install", "--no-audit", "--no-fund"], "의존성 설치");
  return true;
}

/** 소스가 빌드보다 새로우면 다시 빌드해야 한다. */
function newestSourceTime() {
  let newest = 0;

  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else newest = Math.max(newest, fs.statSync(full).mtimeMs);
    }
  };

  walk(path.join(ROOT, "src"));
  for (const file of ["package.json", "next.config.ts", "tsconfig.json"]) {
    const full = path.join(ROOT, file);
    if (fs.existsSync(full)) newest = Math.max(newest, fs.statSync(full).mtimeMs);
  }

  return newest;
}

export async function ensureBuild() {
  const built = fs.existsSync(BUILD_ID) ? fs.statSync(BUILD_ID).mtimeMs : 0;
  if (built > newestSourceTime()) return false;

  await run("npm", ["run", "build"], "빌드");
  return true;
}
