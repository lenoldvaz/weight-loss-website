import * as fs from "fs";
import * as crypto from "crypto";
import * as https from "https";

const svc = JSON.parse(fs.readFileSync("docs/academic-empire-462216-p6-46948c402fb2.json", "utf-8")) as { client_email: string; private_key: string };

function base64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

async function getToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(Buffer.from(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const payload = base64url(Buffer.from(JSON.stringify({
    iss: svc.client_email,
    scope: "https://www.googleapis.com/auth/webmasters.readonly",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600, iat: now,
  })));
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${payload}`);
  const sig = base64url(sign.sign(svc.private_key));
  const jwt = `${header}.${payload}.${sig}`;
  return new Promise<string>((resolve, reject) => {
    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const req = https.request({ hostname: "oauth2.googleapis.com", path: "/token", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } }, (r) => {
      let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => { const p = JSON.parse(d) as { access_token?: string }; p.access_token ? resolve(p.access_token) : reject(p); });
    });
    req.write(body); req.end();
  });
}

async function main() {
  const token = await getToken();
  console.log("Authenticated ✅");
  const result = await new Promise<string>((resolve, reject) => {
    const req = https.request({ hostname: "www.googleapis.com", path: "/webmasters/v3/sites", method: "GET", headers: { Authorization: `Bearer ${token}` } }, (r) => {
      let d = ""; r.on("data", (c) => (d += c)); r.on("end", () => resolve(d));
    });
    req.on("error", reject);
    req.end();
  });
  console.log("GSC properties accessible:\n", JSON.stringify(JSON.parse(result), null, 2));
}

main().catch(console.error);
