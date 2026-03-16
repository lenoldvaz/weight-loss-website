#!/usr/bin/env node
/**
 * Google Ads OAuth2 CLI — gets a refresh token for the Keyword Planner API
 *
 * Run: node scripts/setup/google-ads-oauth.js
 *
 * You will need:
 *   1. A Google Cloud project with Google Ads API enabled
 *   2. OAuth 2.0 credentials (Desktop App type)
 *
 * Steps to get Client ID + Secret:
 *   1. Go to console.cloud.google.com → project: academic-empire-462216-p6
 *   2. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
 *   3. Application type: Desktop App → name it "weight-loss-ca-ads"
 *   4. Download JSON → copy client_id and client_secret below or set as env vars
 */

const https = require('https');
const http = require('http');
const url = require('url');

// ── Fill these in ─────────────────────────────────────────────────────────────
const CLIENT_ID = process.env.GOOGLE_ADS_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_ADS_CLIENT_SECRET || '';
// ─────────────────────────────────────────────────────────────────────────────

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌  Missing credentials. Set them as env vars:\n');
  console.error('   GOOGLE_ADS_CLIENT_ID=your_client_id \\');
  console.error('   GOOGLE_ADS_CLIENT_SECRET=your_client_secret \\');
  console.error('   node scripts/setup/google-ads-oauth.js\n');
  process.exit(1);
}

const REDIRECT_URI = 'http://localhost:8080';  // Must be in Google Cloud → OAuth client → Authorized redirect URIs
const SCOPES = [
  'https://www.googleapis.com/auth/adwords',
].join(' ');

// Build the auth URL
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', SCOPES);
authUrl.searchParams.set('access_type', 'offline');
authUrl.searchParams.set('prompt', 'consent');

console.log('\n🔑  Google Ads OAuth2 Setup\n');
console.log('1. Open this URL in your browser:\n');
console.log('   ' + authUrl.toString());
console.log('\n2. Sign in with the Google account that has access to the Ads Manager account.');
console.log('3. Approve the permissions.');
console.log('4. You will be redirected to localhost:8080 — the script will capture the code.\n');

// Start local server to catch the redirect
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const code = parsed.query.code;
  const error = parsed.query.error;

  if (error) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h2>❌ Error: ' + error + '</h2><p>Check the terminal.</p>');
    console.error('\n❌  OAuth error:', error);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('<h2>❌ No code received</h2>');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('<h2>✅ Authorization successful! Check your terminal for the refresh token.</h2><p>You can close this tab.</p>');
  server.close();

  // Exchange code for tokens
  const tokenBody = new URLSearchParams({
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  }).toString();

  const tokenReq = https.request(
    {
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(tokenBody),
      },
    },
    (tokenRes) => {
      let data = '';
      tokenRes.on('data', (chunk) => (data += chunk));
      tokenRes.on('end', () => {
        const tokens = JSON.parse(data);
        if (tokens.error) {
          console.error('\n❌  Token exchange failed:', tokens.error, tokens.error_description);
          process.exit(1);
        }

        console.log('\n✅  SUCCESS! Add these to your .env.local:\n');
        console.log('   GOOGLE_ADS_CLIENT_ID=' + CLIENT_ID);
        console.log('   GOOGLE_ADS_CLIENT_SECRET=' + CLIENT_SECRET);
        console.log('   GOOGLE_ADS_REFRESH_TOKEN=' + tokens.refresh_token);
        console.log('\n📋  Also add to Vercel → Project Settings → Environment Variables\n');
      });
    }
  );

  tokenReq.on('error', (e) => {
    console.error('\n❌  Token request error:', e.message);
    process.exit(1);
  });

  tokenReq.write(tokenBody);
  tokenReq.end();
});

server.listen(8080, () => {
  console.log('⏳  Waiting for OAuth redirect on http://localhost:8080 ...\n');
});
