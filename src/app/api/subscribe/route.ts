import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = "alerts@weight-loss.ca";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://weight-loss.ca";

export async function POST(req: NextRequest) {
  let email: string;
  let source: string;

  try {
    const body = (await req.json()) as { email?: string; source?: string };
    email = (body.email ?? "").trim().toLowerCase();
    source = body.source ?? "general";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  // Save to Supabase
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/email_subscribers`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        email,
        source,
        subscribed_at: new Date().toISOString(),
      }),
    });

    if (!res.ok && res.status !== 409) {
      const err = await res.text();
      console.error("Supabase insert error:", err);
      return NextResponse.json({ error: "Failed to save subscription. Please try again." }, { status: 500 });
    }
  }

  // Send confirmation email via Resend
  if (RESEND_API_KEY) {
    try {
      const resend = new Resend(RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "You're on the list — Generic Semaglutide Price Alerts",
        html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;max-width:560px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#1e3a2f;padding:24px 32px;">
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#6eb894;">weight-loss.ca</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;line-height:1.3;">
              You're on the list 🇨🇦
            </h1>
            <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6;">
              We'll email you when generic semaglutide prices drop, new Health Canada approvals come in, or new providers launch in Canada.
            </p>

            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px 20px;margin-bottom:24px;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:1px;">Current best prices</p>
              <p style="margin:0 0 4px;font-size:14px;color:#15803d;"><strong>Hims</strong> — $149/mo (consultation included)</p>
              <p style="margin:0 0 4px;font-size:14px;color:#15803d;"><strong>Felix Health</strong> — $150/mo (consultation included)</p>
              <p style="margin:0;font-size:14px;color:#15803d;"><strong>Shoppers / Rexall</strong> — ~$114/mo (need own prescription)</p>
            </div>

            <a href="${SITE_URL}/generic-semaglutide-canada-tracker"
               style="display:inline-block;background:#1e3a2f;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;">
              View full price tracker →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #f1f5f9;">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
              You subscribed at weight-loss.ca. We only email when prices actually change or new generics are approved — no newsletters, no spam.<br>
              <a href="${SITE_URL}" style="color:#94a3b8;">weight-loss.ca</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
        `.trim(),
      });
    } catch (err) {
      // Don't fail the request if email send fails — subscriber is already saved
      console.error("Resend error:", err);
    }
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
