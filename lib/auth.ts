import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, makeToken } from "./token";

export async function setAuthCookie() {
  const token = await makeToken();
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().delete(COOKIE_NAME);
}

export async function isAuthed(): Promise<boolean> {
  const c = cookies().get(COOKIE_NAME);
  if (!c) return false;
  const expected = await makeToken();
  return c.value === expected;
}

export async function requireAuth() {
  if (!(await isAuthed())) redirect("/login");
}

export function checkPassword(input: string): boolean {
  const expected = process.env.SITE_PASSWORD || "changeme";
  return input === expected;
}
