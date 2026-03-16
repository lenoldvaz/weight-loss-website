import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.headers.set(
    "Set-Cookie",
    "admin_session=authenticated; Path=/; HttpOnly; SameSite=Lax"
  );
  return response;
}
