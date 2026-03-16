# weight-loss.ca — Deployment & Infrastructure Reference

**Last Updated**: 2026-03-15
*This file is the single source of truth for all hosting, credentials, and deployment details.*
*Update this file every time a new service is added, a key is rotated, or a deployment process changes.*

---

## Domain

| Field | Value |
|-------|-------|
| Domain | weight-loss.ca |
| Registrar | TBD (Namecheap or Cloudflare recommended) |
| DNS Provider | TBD |
| SSL | Auto (via Vercel) |

> **TODO**: Register domain and fill in registrar login details

---

## Hosting — Vercel

| Field | Value |
|-------|-------|
| Platform | Vercel |
| Plan | TBD (Free → Pro as traffic scales) |
| Account email | TBD |
| Project URL | TBD (e.g. `weightloss-website.vercel.app`) |
| Production URL | https://weight-loss.ca |
| Vercel dashboard | https://vercel.com/dashboard |
| Deploy trigger | Git push to `main` branch |
| Build command | `npm run build` |
| Output directory | `.next` |

### How to deploy manually
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

> **TODO**: Create Vercel account, link GitHub repo, fill in project URL

---

## Source Control — GitHub

| Field | Value |
|-------|-------|
| Repository | TBD (e.g. `github.com/[username]/weightloss-website`) |
| Default branch | `main` |
| Vercel integration | Auto-deploy on push to `main` |

> **TODO**: Create GitHub repo and link to Vercel

---

## AI — Claude API (Anthropic)

| Field | Value |
|-------|-------|
| Provider | Anthropic |
| Dashboard | https://console.anthropic.com |
| Model used | `claude-haiku-4-5-20251001` (generation), `claude-sonnet-4-6` (quality checks) |
| API key env var | `ANTHROPIC_API_KEY` |
| Est. cost per page | ~$0.003 (Haiku) |
| Est. cost per 10k pages | ~$30 |

### Setting the API key
```bash
# In .env.local (never commit this file)
ANTHROPIC_API_KEY=sk-ant-...

# In Vercel dashboard: Settings → Environment Variables
# Add ANTHROPIC_API_KEY = sk-ant-...
```

> **TODO**: Create API key at console.anthropic.com and store securely

---

## Analytics

### Google Search Console
| Field | Value |
|-------|-------|
| Property | TBD (weight-loss.ca) |
| Verification method | TBD (HTML tag or DNS) |
| Dashboard | https://search.google.com/search-console |

### Plausible Analytics (Privacy-first)
| Field | Value |
|-------|-------|
| Account | TBD |
| Dashboard | https://plausible.io |
| Script | Added to `src/app/layout.tsx` |

> **TODO**: Set up both after domain is live

---

## SEO Data APIs

### DataForSEO (Primary SEO Data Source)

| Field | Value |
|-------|-------|
| Provider | DataForSEO |
| Dashboard | https://app.dataforseo.com |
| Account email | TBD |
| API login env var | `DATAFORSEO_LOGIN` |
| API password env var | `DATAFORSEO_PASSWORD` |
| Auth method | Basic Auth: `base64(login:password)` |
| Billing model | Pay-as-you-go (min $50 deposit) |
| Est. monthly cost | $20-60/mo for our pipeline |

**Endpoints we use:**

| Endpoint | Purpose | Cost |
|----------|---------|------|
| Google Ads API | Keyword search volume + CPC | ~$0.05/task (1-1000 kws) |
| Labs: Bulk Keyword Difficulty | KD score 0-100 | ~$0.01/task |
| Google Trends API | Trending keywords in Canada | $0.00225/call |
| Labs: Related Keywords | Keyword ideas from seed | ~$0.01/call |
| SERP API | Rank checking, SERP analysis | $0.0006/call |
| Labs: Keywords for Site | Competitor keyword gaps | ~$0.01/call |

**Setup:**
1. Register at dataforseo.com
2. Deposit $50 (trial balance available before deposit)
3. Get login + password from dashboard
4. Set env vars (see Environment Variables section)

> **TODO**: Register account and fill in credentials

---

### Google Ads API (Keyword Planner — Free)

| Field | Value |
|-------|-------|
| Provider | Google |
| Dashboard | https://ads.google.com/aw/apicenter |
| Developer token | TBD |
| API env var | `GOOGLE_ADS_DEVELOPER_TOKEN` |
| Client ID env var | `GOOGLE_ADS_CLIENT_ID` |
| Client Secret env var | `GOOGLE_ADS_CLIENT_SECRET` |
| Refresh token env var | `GOOGLE_ADS_REFRESH_TOKEN` |
| Canada geo target code | `2124` |
| Node.js package | `google-ads-api` |

**Setup:**
1. Create a Google Ads Manager account (not a regular Ads account)
2. Go to ads.google.com/aw/apicenter → Apply for developer token
3. Start with Explorer access (2,880 ops/day); apply for Basic access for production
4. No ad spend required — this is a myth
5. Approval can take days to weeks — **apply immediately**

> **TODO**: Apply for developer token, complete OAuth setup

---

### Google Search Console API (Free)

| Field | Value |
|-------|-------|
| Provider | Google |
| Dashboard | https://search.google.com/search-console |
| Service account key | TBD (JSON file, stored securely) |
| Env var | `GOOGLE_SERVICE_ACCOUNT_KEY` (base64-encoded JSON) |
| Node.js package | `googleapis` |
| Used for | URL indexing submissions, query/ranking data |

> **TODO**: Create Google Cloud project, enable GSC API, create service account

---

### Reddit API (Trending Topics — Free)

| Field | Value |
|-------|-------|
| App type | Script (for server-side use) |
| Dashboard | https://www.reddit.com/prefs/apps |
| Client ID env var | `REDDIT_CLIENT_ID` |
| Client Secret env var | `REDDIT_CLIENT_SECRET` |
| User Agent | `weight-loss-ca-bot/1.0` |
| Rate limit | 100 requests/minute (OAuth) |
| Used for | Scraping r/loseit, r/keto, r/canada trending posts weekly |

> **TODO**: Create Reddit app at reddit.com/prefs/apps

---

## Database — Supabase (Phase 3+)

*Not needed until clinic directory feature is built.*

| Field | Value |
|-------|-------|
| Provider | Supabase |
| Dashboard | https://supabase.com/dashboard |
| Project URL | TBD |
| Anon key env var | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Service key env var | `SUPABASE_SERVICE_ROLE_KEY` |
| Database URL env var | `DATABASE_URL` |

---

## Environment Variables Reference

All environment variables required to run the project:

```bash
# .env.local — local development (never commit)

# AI - Content Generation
ANTHROPIC_API_KEY=                  # Claude API key (console.anthropic.com)

# SEO Data
DATAFORSEO_LOGIN=                   # DataForSEO account email
DATAFORSEO_PASSWORD=                # DataForSEO API password
GOOGLE_ADS_DEVELOPER_TOKEN=         # Google Ads API developer token
GOOGLE_ADS_CLIENT_ID=               # Google OAuth client ID
GOOGLE_ADS_CLIENT_SECRET=           # Google OAuth client secret
GOOGLE_ADS_REFRESH_TOKEN=           # Google OAuth refresh token
GOOGLE_SERVICE_ACCOUNT_KEY=        # base64-encoded GSC service account JSON

# Trending Content
REDDIT_CLIENT_ID=                   # Reddit app client ID
REDDIT_CLIENT_SECRET=               # Reddit app client secret

# Analytics & Tag Management
NEXT_PUBLIC_GTM_ID=                 # Google Tag Manager container ID (GTM-XXXXXXX)
NEXT_PUBLIC_GA4_ID=                 # GA4 Measurement ID (G-XXXXXXXXXX)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=       # weight-loss.ca
NEXT_PUBLIC_CLARITY_ID=             # Microsoft Clarity project ID

# Advertising (activate at 5,000 sessions/month)
NEXT_PUBLIC_ADS_ENABLED=false       # Flip to true when ready
NEXT_PUBLIC_ADSENSE_CLIENT_ID=      # Google AdSense publisher ID (ca-pub-XXXXXXXXX)
NEXT_PUBLIC_GAM_NETWORK_CODE=       # Google Ad Manager network code

# Database (Phase 3+)
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=          # Supabase service role key
DATABASE_URL=                       # Postgres connection string
```

Set all of these in **Vercel Dashboard → Project → Settings → Environment Variables** for production.

---

## Deployment Runbook

### First-time setup
1. Register `weight-loss.ca` at Namecheap or Cloudflare
2. Create GitHub repo, push code
3. Create Vercel account → Import GitHub repo
4. Add all environment variables in Vercel dashboard
5. Point DNS: `A record → 76.76.21.21` (Vercel IP) + `CNAME www → cname.vercel-dns.com`
6. Vercel auto-provisions SSL certificate
7. Create Google Search Console property, verify via DNS TXT record
8. Submit sitemap: `https://weight-loss.ca/sitemap.xml`

### Regular deployment (automated)
```bash
git add .
git commit -m "feat: [description]"
git push origin main
# Vercel auto-deploys in ~60 seconds
```

### Content generation run
```bash
# Generate new content batch
node scripts/generate/content_generator.js --template location-service --limit 100

# Validate outputs
node scripts/generate/validate.js --dir data/content/location-service

# Push to trigger deploy
git add data/content/
git commit -m "content: add [N] location-service pages"
git push origin main
```

### Weekly trending run
```bash
# Run full weekly pipeline
node scripts/trending/keyword_scout.js       # Monday
node scripts/trending/brief_generator.js     # Tuesday
node scripts/trending/content_generator.js   # Wednesday
git push origin main                          # Thursday (auto-deploy)
node scripts/trending/index_submitter.js     # Friday
```

---

## Cost Estimates

| Service | Plan | Est. Monthly Cost |
|---------|------|-------------------|
| Vercel | Pro (needed at scale) | $20/mo |
| Anthropic Claude API | Pay-per-use | $30-100/mo |
| DataForSEO | Pay-as-you-go | $20-60/mo |
| Google Ads API | Free | $0 |
| Google Search Console API | Free | $0 |
| Reddit API | Free tier | $0 |
| Namecheap domain | Annual | ~$15/yr |
| Supabase | Free tier | $0 (until scale) |
| Plausible | Starter | $9/mo |
| Microsoft Clarity | Free | $0 |
| **Total** | | **~$80-190/mo** |

**Revenue potential at 100k sessions/mo**: $1,500-4,000/mo (display ads alone)

---

## Deployment Log

| Date | What was deployed | Who | Notes |
|------|-------------------|-----|-------|
| 2026-03-15 | Initial project structure and docs | Setup | No app code yet |
