# weight-loss.ca — TODO

**Last Updated**: 2026-08-23

---

## 🔴 DO FIRST — Supabase & Vercel Setup (30 min)

These unlock features already built but not yet active. Do in this order.

### ~~1. Create `semaglutide_news` table in Supabase~~ ✅ Done
### ~~2. Add `CRON_SECRET` to Vercel~~ ✅ Done
### ~~3. Add `RESEND_API_KEY` to Vercel~~ ✅ Done

### 4. Trigger first news fetch
Run this in your terminal — replace `YOUR_CRON_SECRET` with the value you set in Vercel:
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://weight-loss.ca/api/cron/fetch-news
```
Should return `{"ok":true,"fetched":XX,"new":XX}`. Then `/semaglutide-news` will show articles.
The cron will also run automatically every day at 8am ET without you doing anything.

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
- [ ] Check `/sitemap.xml` in browser — confirm all new pages appear
- [ ] Visit each new page on mobile and desktop — screenshot any layout issues and share with Claude
- [ ] GSC: submit `https://weight-loss.ca/sitemap.xml` if not already submitted as primary sitemap
- [ ] **Run `scripts/deploy/glp1_prices_migration.sql` in the Supabase SQL Editor** — this is why `/glp1-prices` still shows hardcoded data instead of live pricing (see `docs/DEPLOYMENT.md` → Database section for details). Takes 2 minutes, no code deploy needed after.

### Claude (on request)
- [x] 2026-08-23 — ~~Create `/glp1-prices` Supabase table SQL~~ Done — see `scripts/deploy/glp1_prices_migration.sql` (includes full seed data, not just empty schema). Waiting on Lenold to run it in Supabase.
- [x] 2026-08-23 — ~~Fix `/clinics` and `/reviews` hub pages~~ Confirmed already fixed — both return HTTP 200, no redirect errors. This item was stale.
- [x] 2026-08-23 — ~~Internal linking audit~~ Confirmed homepage already links glp1-prices/coverage-checker/savings-cards/telehealth; closed related_topics gaps on ozempic-review, wegovy-review, mounjaro-review (had none), berberine-review

---

## 🟠 Month 1 — Content Gaps — ✅ COMPLETE (2026-08-23)

- [x] `/generic-semaglutide-vs-ozempic` — was already built 2026-05-21
- [x] `/ozempic-vs-mounjaro-canada` — built 2026-08-23
- [x] `/wegovy-vs-ozempic-canada` — built 2026-08-23
- [x] `/generic-semaglutide-weight-loss-canada` — was already built 2026-05-21
- [x] `/generic-semaglutide-coverage-by-province` — was already built 2026-05-21
- [x] `/how-much-does-ozempic-cost-in-canada` — built 2026-08-23
- [x] `/is-ozempic-covered-by-insurance-canada` — built 2026-08-23
- [x] `/mounjaro-canada-price` — built 2026-08-23
- [x] `ozempic-review.json` / `wegovy-review.json` — already had generic-semaglutide pricing; also fixed truncated `verdict_summary` on both (data corruption found during audit) and updated related_topics

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
- [x] 2026-08-23 — ~~Add `lastModified` from actual file mtime to sitemap~~ Confirmed already done (`getFileMtime()` in `src/app/sitemap.ts`) — this item was stale
- [x] 2026-08-23 — ~~Add Article/Review/Product JSON-LD~~ Confirmed already wired into all 9 templates via `JsonLd` component — this item was stale
- [ ] Core Web Vitals: run PageSpeed Insights on `/glp1-prices` and `/` — fix any LCP > 2.5s
- [x] 2026-08-23 — Fixed data corruption found while improving `/contrave-review` and `/berberine-review`: mangled `$` price strings (contrave) and a mid-sentence-truncated verdict summary (berberine). Content quality issue, not a ranking-position issue — still worth adding a comparison table to contrave next.
- [ ] Improve `/contrave-review` (position 41, closest to page 1) — add comparison table, stronger Canadian angle
- [ ] Improve `/berberine-review` (position 60, 13 impressions) — evidence summary and pricing are solid now; consider adding a table comparing it to Ozempic/generic semaglutide

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
