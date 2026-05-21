// 미들웨어와 서버 양쪽에서 동작하도록 Web Crypto 사용
export const COOKIE_NAME = "hm_auth";

export async function makeToken(): Promise<string> {
  const secret = process.env.SESSION_SECRET || "default-secret-change-me";
  const password = process.env.SITE_PASSWORD || "changeme";
  const data = new TextEncoder().encode(secret + ":" + password);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
