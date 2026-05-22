import { NextRequest, NextResponse } from "next/server";
import { createSign } from "crypto";

export const runtime = "nodejs";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const SA_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const SA_KEY = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  ? Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, "base64").toString("utf-8")
  : "";

const BATCH_SIZE = 10;

function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getIndexingToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(
    Buffer.from(
      JSON.stringify({
        iss: SA_EMAIL,
        scope: "https://www.googleapis.com/auth/indexing",
        aud: "https://oauth2.googleapis.com/token",
        exp: now + 3600,
        iat: now,
      })
    )
  );
  const sign = createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = base64url(sign.sign(SA_KEY));
  const jwt = `${header}.${payload}.${sig}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`Auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

type QueueRow = { url: string };

async function getPendingUrls(): Promise<string[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/indexing_queue?status=eq.pending&order=created_at.asc&limit=${BATCH_SIZE}`,
    {
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
    }
  );
  if (!res.ok) return [];
  const rows = await res.json() as QueueRow[];
  return rows.map((r) => r.url);
}

async function markUrl(url: string, status: "submitted" | "failed") {
  await fetch(`${SUPABASE_URL}/rest/v1/indexing_queue?url=eq.${encodeURIComponent(url)}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
      submitted_at: new Date().toISOString(),
    }),
  });
}

async function submitUrl(token: string, url: string): Promise<boolean> {
  const res = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, type: "URL_UPDATED" }),
  });
  const data = await res.json() as { error?: { status: string } };
  return !data.error;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!SA_EMAIL || !SA_KEY) {
    return NextResponse.json({ error: "Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY" }, { status: 500 });
  }

  try {
    const urls = await getPendingUrls();
    if (urls.length === 0) {
      return NextResponse.json({ ok: true, message: "Queue empty — all URLs submitted", submitted: 0 });
    }

    const token = await getIndexingToken();

    let submitted = 0;
    let failed = 0;
    const results: Array<{ url: string; ok: boolean }> = [];

    for (const url of urls) {
      const ok = await submitUrl(token, url);
      await markUrl(url, ok ? "submitted" : "failed");
      if (ok) submitted++; else failed++;
      results.push({ url, ok });
      await new Promise((r) => setTimeout(r, 300));
    }

    return NextResponse.json({ ok: true, submitted, failed, results });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
