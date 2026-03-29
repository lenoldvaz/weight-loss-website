# weight-loss.ca — TODO

**Last Updated**: 2026-03-28
**Site age**: 12 days | **Indexed**: 5/111 pages | **Impressions**: 95 | **Clicks**: 0

---

## 📅 Daily Routine

### Lenold — daily (5 min)
- [ ] GSC → URL Inspection → request indexing for 10 pages (quota resets daily)
- [ ] Check if any new pages appeared in GSC analytics

### Claude — on request
- `npx tsx scripts/seo/gsc.ts coverage` — check indexing status
- `npx tsx scripts/seo/gsc.ts analytics` — check clicks/impressions
- `npx tsx scripts/seo/gsc.ts inspect <url>` — inspect any specific page

---

## 🔴 This Week (urgent)

### Lenold
- [ ] GSC → request indexing for `/clinics` and `/reviews` — still showing redirect error from old crawl (Mar 17), need fresh crawl now that 308 redirect is fixed
- [ ] GSC → request indexing batch 2 (10 pages today):
  1. `https://weight-loss.ca/clinics`
  2. `https://weight-loss.ca/reviews`
  3. `https://weight-loss.ca/how-to-speed-up-metabolism`
  4. `https://weight-loss.ca/how-to-lose-weight-without-exercise`
  5. `https://weight-loss.ca/dietitians-calgary`
  6. `https://weight-loss.ca/dietitians-toronto`
  7. `https://weight-loss.ca/noom-review`
  8. `https://weight-loss.ca/wegovy-review`
  9. `https://weight-loss.ca/how-to-lose-arm-fat`
  10. `https://weight-loss.ca/how-to-lose-thigh-fat`
- [ ] Verify GA4 is firing: open weight-loss.ca in browser → GA4 Realtime report → confirm pageview appears
- [ ] Vercel → delete old www sitemap from GSC (submit `https://weight-loss.ca/sitemap.xml` as the only one)

### Claude
- [ ] Audit internal linking — verify hub pages link to all content pages (Google can't discover the 98 unindexed pages without links)
- [ ] Check RelatedLinks component is wired in all 9 templates
- [ ] Add `lastModified` from actual file mtime to sitemap (currently all pages show same timestamp — fix to reflect real update dates)

---

## 🟡 This Month (week 2–4)

### Lenold — backlinks (single biggest unlock)
- [ ] Sign up for Connectively (connectively.us — replacement for HARO) — respond to health/nutrition journalist queries 3x/week
- [ ] Email 5 Canadian dietitian blogs offering a guest post or data collaboration
- [ ] Submit weight-loss.ca to Canadian health directories (CARP, Canadian Obesity Network partner pages)
- [ ] Reach out to 3 Canadian weight loss clinics to link to your city page (offer free listing)

### Lenold — analytics
- [ ] Create Microsoft Clarity project at clarity.microsoft.com → add `NEXT_PUBLIC_CLARITY_ID` to Vercel env vars
- [ ] Confirm Plausible or keep GA4 (decision: pick one as primary dashboard)

### Claude — content quality
- [ ] Improve `/contrave-review` — currently position 41 with 40 impressions, closest to page 1. Add comparison table, update dosing info, strengthen Canadian angle (OHIP coverage, cost in CAD)
- [ ] Improve `/berberine-review` — position 60, 13 impressions. Same treatment.
- [ ] Add `Article` JSON-LD schema to how-to pages (currently only HowTo + FAQPage schema)
- [ ] Add `Review` + `Product` JSON-LD to all product-review pages
- [ ] Core Web Vitals audit — run PageSpeed Insights, fix any LCP > 2.5s issues

---

## 🟢 Month 2–3 (once first batch indexed)

### Lenold
- [ ] Apply to Amazon.ca affiliate program (associates.amazon.ca) — add links to product review pages
- [ ] Apply to iHerb affiliate program
- [ ] Apply to HelloFresh Canada affiliate program
- [ ] Create Google AdSense account (activate at ~5,000 sessions/month)

### Claude
- [ ] Build seed files for 6 new templates (comparison, demographic-topic, condition-topic, best-list, trending-article, location-product) — unlocks ~200+ more pages
- [ ] Generate those ~200 pages
- [ ] Weekly trending pipeline (scripts/trending/) — 50 new articles/week automated
- [ ] Build homepage properly (replace "coming soon" with real content: featured reviews, top how-tos, province selector)

---

## 📊 Goals & Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| 10 pages indexed | Week 2 | 🔄 In progress (5/10) |
| 50 pages indexed | Week 4 | ⬜ |
| All 111 pages indexed | Month 2 | ⬜ |
| First click in GSC | Month 1–2 | ⬜ |
| Position ≤ 20 on any keyword | Month 2–3 | ⬜ (`contrave-review` at 41 now) |
| 500 sessions/month | Month 3–4 | ⬜ |
| 5,000 sessions/month (ads) | Month 6 | ⬜ |
| 50,000 sessions/month (Mediavine) | Month 12 | ⬜ |

---

## ✅ Done

- [x] Fix www → non-www domain redirect (Vercel: 308 permanent, confirmed 200 OK on all pages) ✅
- [x] Fix Cloudflare DNS (grey cloud) — SSL confirmed ✅
- [x] Submit non-www sitemap to GSC (`https://weight-loss.ca/sitemap.xml`, 111 pages) ✅
- [x] GSC redirect errors fixed on /how-to, /how-to-lose-belly-fat, /how-to-lose-face-fat, /contrave-review ✅
- [x] All 103 seed pages generated and live (60 location-service, 25 how-to, 18 product-review) ✅
- [x] E-E-A-T pages: About, Editorial Policy, Contact, Privacy Policy ✅
- [x] Hub pages enhanced with JSON-LD + SEO content + cross-links ✅
- [x] Admin content browser with keyword data, sort/filter ✅
- [x] DataForSEO keyword data for all 83 tracked slugs ✅
- [x] All 9 page templates built ✅
- [x] Admin CMS with Tiptap rich text editor ✅
- [x] Hero image pipeline (Gemini, priority list) ✅
- [x] GitHub Actions auto-indexing on content push ✅
- [x] GSC script (`scripts/seo/gsc.ts`) — direct API access for coverage, analytics, inspect, sitemaps ✅
- [x] sitemap.xml — dynamic, covers all 111 pages ✅
- [x] robots.txt — admin blocked, sitemap referenced ✅
- [x] Google service account as GSC Owner ✅
- [x] GA4 + GTM installed ✅
- [x] Register weight-loss.ca + Vercel + GitHub ✅
