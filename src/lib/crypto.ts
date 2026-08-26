import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * FLMO_ENCRYPTION_KEY 로부터 32바이트 키를 만든다.
 * base64 로 넣은 32바이트 값을 그대로 쓰고, 그게 아니면 scrypt 로 늘린다.
 */
function getKey(): Buffer {
  const raw = process.env.FLMO_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error(
      "FLMO_ENCRYPTION_KEY 가 설정되지 않았습니다. .env.local 에 추가하세요.\n" +
        '생성: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"',
    );
  }

  const decoded = Buffer.from(raw, "base64");
  if (decoded.length === 32) return decoded;

  return crypto.scryptSync(raw, "flmo-credential-store", 32);
}

/** 평문을 암호화해 `iv.authTag.ciphertext` (모두 base64url) 형태로 반환한다. */
export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [iv, authTag, ciphertext].map((b) => b.toString("base64url")).join(".");
}

/** encrypt() 가 만든 문자열을 복호화한다. */
export function decrypt(payload: string): string {
  const parts = payload.split(".");
  if (parts.length !== 3) {
    throw new Error("저장된 자격증명 형식이 올바르지 않습니다.");
  }

  const [iv, authTag, ciphertext] = parts.map((p) => Buffer.from(p, "base64url"));
  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("저장된 자격증명이 손상되었습니다.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
}

/** 토큰을 로그·UI 에 보여줄 때 쓰는 마스킹. 앞 4자 + 뒤 4자만 남긴다. */
export function maskToken(token: string): string {
  if (token.length <= 12) return "*".repeat(token.length);
  return `${token.slice(0, 4)}${"*".repeat(12)}${token.slice(-4)}`;
}
