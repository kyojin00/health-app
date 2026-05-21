import { NextResponse } from "next/server";
import { setAuthCookie, checkPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (!checkPassword(password)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }
  await setAuthCookie();
  return NextResponse.json({ ok: true });
}
