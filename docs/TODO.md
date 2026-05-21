# weight-loss.ca — TODO

**Last Updated**: 2026-05-21

---

## 🔴 DO FIRST — Supabase & Vercel Setup (30 min)

These unlock features already built but not yet active. Do in this order.

### 1. Create `semaglutide_news` table in Supabase
Go to Supabase dashboard → SQL Editor → run:
```sql
create table semaglutide_news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  source text,
  published_at timestamptz,
  summary text,
  fetched_at timestamptz default now()
);
alter table semaglutide_news enable row level security;
create policy "Public read access" on semaglutide_news for select to anon using (true);
```

### 2. Add `CRON_SECRET` to Vercel
Vercel dashboard → Project → Settings → Environment Variables:
- Key: `CRON_SECRET`
- Value: any random string — generate one with `openssl rand -hex 32`

### 3. Add `RESEND_API_KEY` to Vercel
- Go to resend.com → create an account → get API key
- Add `RESEND_API_KEY` to Vercel environment variables
- In Resend: add `weight-loss.ca` as a sending domain (requires DNS records — Vercel handles DNS if domain is there)

### 4. Trigger first news fetch
After Supabase table is created, hit this URL in a browser (no auth needed before CRON_SECRET is set):
```
https://weight-loss.ca/api/cron/fetch-news
```
Should return `{"ok":true,"fetched":XX,"new":XX}`. Then `/semaglutide-news` will show articles.

### 5. Submit new pages to GSC for indexing
Go to GSC → URL Inspection → request indexing for each:
1. `https://weight-loss.ca/glp1-prices`
2. `https://weight-loss.ca/coverage-checker`
3. `https://weight-loss.ca/savings-cards`
4. `https://weight-loss.ca/telehealth`
5. `https://weight-loss.ca/semaglutide-news`
6. `https://weight-loss.ca/generic-semaglutide-canada-tracker`
7. `https://weight-loss.ca/generic-semaglutide-canada`
8. `https://weight-loss.ca/how-to-get-generic-semaglutide-in-canada`

---

## 🟡 This Week

### Lenold
- [ ] Verify GA4 firing: open weight-loss.ca → GA4 Realtime → confirm pageview appears
- [ ] Check `/sitemap.xml` in browser — confirm all new pages appear (glp1-prices, telehealth, savings-cards, coverage-checker)
- [ ] Visit each new page on mobile and desktop — screenshot any layout issues and share with Claude
- [ ] GSC: submit `https://weight-loss.ca/sitemap.xml` if not already submitted as primary sitemap

### Claude (on request)
- [ ] Create `/glp1-prices` Supabase table SQL so prices can be updated without deploys:
  ```sql
  create table glp1_prices (
    id uuid primary key default gen_random_uuid(),
    pharmacy_name text not null,
    pharmacy_type text not null,
    province text not null,
    drug_name text not null,
    dosage text,
    price_cad numeric,
    dispensing_fee numeric default 0,
    requires_rx boolean default true,
    is_estimate boolean default false,
    url text,
    notes text,
    verified_at date,
    updated_at timestamptz default now()
  );
  alter table glp1_prices enable row level security;
  create policy "Public read access" on glp1_prices for select to anon using (true);
  ```
- [ ] Fix `/clinics` and `/reviews` hub pages — still showing old redirect errors in GSC. Request fresh crawl after fix.
- [ ] Internal linking audit — the 4 new pages (glp1-prices, telehealth, savings-cards, coverage-checker) need to be linked from existing content pages

---

## 🟠 Month 1 — Content Gaps (Claude builds these)

These are high-traffic keyword opportunities we don't have pages for yet.

### Missing comparison pages
- [ ] `/generic-semaglutide-vs-ozempic` — comparison JSON using ComparisonTemplate (search volume: high)
- [ ] `/ozempic-vs-mounjaro-canada` — head-to-head with CAD prices
- [ ] `/wegovy-vs-ozempic-canada` — semaglutide dose comparison

### Missing articles
- [ ] `/generic-semaglutide-weight-loss-canada` — off-label use explainer with doctor quotes
- [ ] `/generic-semaglutide-coverage-by-province` — province-by-province formulary guide (long-form)
- [ ] `/how-much-does-ozempic-cost-in-canada` — exact pricing by pharmacy (drives price comparison traffic)
- [ ] `/is-ozempic-covered-by-insurance-canada` — coverage guide (feeds coverage checker)
- [ ] `/mounjaro-canada-price` — Mounjaro pricing page

### Update existing pages
- [ ] `ozempic-review.json` — add callout about generic availability + price comparison table
- [ ] `wegovy-review.json` — update with current CAD pricing and Poviztra (authorized generic)

---

## 🟡 Month 1 — SEO & Technical

### Lenold — backlinks (biggest unlock for ranking)
- [ ] Sign up for Connectively (connectively.us — replaced HARO) — respond to health/diet journalist queries 3×/week
- [ ] Email 5 Canadian dietitian blogs offering a guest post or data use
- [ ] Submit weight-loss.ca to Canadian health directories (CARP, Canadian Obesity Network)
- [ ] Reach out to 3 Canadian weight loss clinics to link to your city page (offer free listing)

### Lenold — analytics
- [ ] Create Microsoft Clarity project at clarity.microsoft.com → add `NEXT_PUBLIC_CLARITY_ID` to Vercel
- [ ] Confirm GA4 primary dashboard is set up — check Sessions and Top Pages are recording

### Claude — SEO fixes
- [ ] Add `lastModified` from actual file mtime to sitemap (all pages currently show same date — this hurts crawl prioritisation)
- [ ] Add `Article` JSON-LD to all how-to pages
- [ ] Add `Review` + `Product` JSON-LD to all product-review pages
- [ ] Core Web Vitals: run PageSpeed Insights on `/glp1-prices` and `/` — fix any LCP > 2.5s
- [ ] Improve `/contrave-review` (position 41, closest to page 1) — add comparison table, stronger Canadian angle
- [ ] Improve `/berberine-review` (position 60, 13 impressions)

---

## 🟢 Month 2–3 — Monetisation

### Lenold — affiliate programs
- [ ] Apply: Amazon.ca Associates (associates.amazon.ca) — link from supplement review pages
- [ ] Apply: iHerb affiliate program
- [ ] Apply: HelloFresh Canada affiliate
- [ ] Consider: direct clinic affiliate deals (weight loss clinics often pay $50–150/referral)

### Lenold — ads
- [ ] Create Google AdSense account — activate when site hits ~5,000 sessions/month
- [ ] Research Mediavine/Raptive requirements (Mediavine = 50k sessions/mo minimum)

### Claude — scale content
- [ ] Build seed files for remaining templates (comparison, demographic-topic, condition-topic, best-list, trending-article, location-product) — unlocks ~200 more pages
- [ ] Generate those 200 pages in batches (max 500/day to avoid spam signals)
- [ ] Weekly trending pipeline (`scripts/trending/`) — 50 new articles/week automated

---

## 📅 Daily Routine (Lenold — 5 min/day)

- [ ] GSC → URL Inspection → request indexing for 10 pages (quota resets daily)
- [ ] Check if new pages appeared in GSC Search Results
- [ ] Scan `/semaglutide-news` for any big breaking stories to share on social

### Claude — on request
```bash
npx tsx scripts/seo/gsc.ts coverage   # check indexing status
npx tsx scripts/seo/gsc.ts analytics  # clicks/impressions
npx tsx scripts/seo/gsc.ts inspect <url>  # inspect a page
```

---

## 📊 Goals & Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| 10 pages indexed | Week 2 | 🔄 In progress |
| New pages indexed (glp1-prices, telehealth, etc.) | Week 3 | ⬜ |
| 50 pages indexed | Week 4 | ⬜ |
| First click from `/glp1-prices` or `/coverage-checker` | Month 1–2 | ⬜ |
| Position ≤ 20 on any GLP-1 keyword | Month 2–3 | ⬜ |
| 500 sessions/month | Month 3–4 | ⬜ |
| 5,000 sessions/month (AdSense) | Month 6 | ⬜ |
| 50,000 sessions/month (Mediavine) | Month 12 | ⬜ |

---

## ✅ Done

### Site rebuild (May 2026)
- [x] Full design system overhaul — Inter font, dark hero sections, clean zinc/white palette
- [x] Header redesigned — 6 nav links (Prices, Coverage, Savings Cards, Telehealth, Tracker, News)
- [x] Footer redesigned — 3-column with Compare / Tracking / Company sections
- [x] Homepage redesigned — dark hero, feature grid, price preview table (no more "coming soon")
- [x] `/glp1-prices` — filterable price comparison (28 listings, 6 drugs, 15+ pharmacies, client-side filter/sort)
- [x] `/savings-cards` — all 4 Canadian manufacturer programs (Novo Nordisk Care, innoviCares, myzepbound, mymounjaro)
- [x] `/telehealth` — 10 Canadian telehealth providers compared (consult fee, provinces, drug availability)
- [x] `/coverage-checker` — interactive 4-step provincial coverage tool (province × drug × insurance × T2D)
- [x] Sitemap — 4 new pages added (glp1-prices at priority 1.0)

### Automated news pipeline (May 2026)
- [x] `/semaglutide-news` — daily news archive (ISR, grouped by date, source badges)
- [x] `/api/cron/fetch-news` — Vercel cron: 3 Google News RSS feeds, deduplication, Supabase insert
- [x] `vercel.json` — cron schedule (daily 12pm UTC / 8am ET)
- [x] Latest News widget on tracker page (5 most recent, "See all →" link)

### Generic semaglutide content (May 2026)
- [x] `/generic-semaglutide-canada` — full explainer article
- [x] `/how-to-get-generic-semaglutide-in-canada` — 6-step guide
- [x] `/generic-semaglutide-canada-tracker` — ISR tracker with provider pricing, Decision Widget, Price Alert Form
- [x] Email subscribe → `/api/subscribe` → Supabase storage + Resend confirmation

### Infrastructure (March 2026)
- [x] Fix www → non-www redirect (308 permanent)
- [x] Submit sitemap to GSC (111 pages)
- [x] E-E-A-T pages: About, Editorial Policy, Contact, Privacy Policy
- [x] Hub pages with JSON-LD + SEO content
- [x] Admin CMS with Tiptap editor + DataForSEO keyword data
- [x] GA4 + GTM installed
- [x] GSC script for coverage/analytics/inspect
- [x] GitHub Actions auto-indexing on content push
- [x] 103 seed pages generated (60 location-service, 25 how-to, 18 product-review)
