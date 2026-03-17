# weight-loss.ca — Lenold's Action Items

**Last Updated**: 2026-03-16

> Only items that require **Lenold's** action: account signups, DNS changes, approvals, credentials, decisions. Build tasks are tracked in `PLAN.md`.

---

## 🔲 Immediate (do these now)

### Indexing (Lenold actions — highest priority)
- [ ] Submit sitemap at search.google.com/search-console → Sitemaps → `https://weight-loss.ca/sitemap.xml`
- [ ] Manually request indexing for top 10 pages in GSC URL Inspection (see list below), then 10/day for next few days
  1. `https://weight-loss.ca/`
  2. `https://weight-loss.ca/clinics`
  3. `https://weight-loss.ca/how-to`
  4. `https://weight-loss.ca/reviews`
  5. `https://weight-loss.ca/how-to-lose-belly-fat`
  6. `https://weight-loss.ca/how-to-lose-face-fat`
  7. `https://weight-loss.ca/how-to-speed-up-metabolism`
  8. `https://weight-loss.ca/how-to-lose-weight-without-exercise`
  9. `https://weight-loss.ca/contrave-review`
  10. `https://weight-loss.ca/dietitians-calgary`

### Hero images
- [ ] Generate priority hero images: `npx tsx scripts/generate/generate_images.ts --all`

---

## 🔲 Next Up (build tasks)

### SEO & Indexing
- [ ] Add structured data (Article/HowTo/Review schema) to individual article page templates
- [ ] Verify RelatedLinks component is wired into all 9 page templates
- [ ] Core Web Vitals check — run PageSpeed Insights on top 5 pages (target LCP < 2.5s)
- [ ] Get 3–5 quality Canadian backlinks (HARO/Connectively responses, clinic outreach, guest posts)

### Analytics (Lenold actions)
- [ ] Confirm GA4 (G-GWXLDMY1ZB) + GTM (GTM-TG5WJTV7) are firing on production
- [ ] Create Microsoft Clarity project at clarity.microsoft.com — save Project ID as `NEXT_PUBLIC_CLARITY_ID`
- [ ] Create Plausible account at plausible.io — add weight-loss.ca

### Content & Templates
- [ ] Build seed files for 6 new templates (comparison, demographic-topic, condition-topic, best-list, trending-article, location-product) — defer until month 2-3 when first batch is indexed
- [x] Add Tiptap rich text editor to admin CMS for body/intro fields (bold, italic, links) ✅
- [x] Build About, Editorial Policy, Contact, Privacy Policy pages (E-E-A-T) ✅
- [x] Enhance hub pages (clinics, reviews, how-to) with JSON-LD schema + SEO content + cross-links ✅

### Analytics
- [ ] Create Microsoft Clarity project at clarity.microsoft.com — save Project ID as `NEXT_PUBLIC_CLARITY_ID`
- [ ] Create Plausible account at plausible.io — add weight-loss.ca

---

## 🔲 Later

### Reddit
- [ ] Create Reddit API app at reddit.com/prefs/apps (Phase 6 — trending pipeline)

### Affiliates (start when 50+ pages are live)
- [ ] Apply to Amazon.ca affiliate program (associates.amazon.ca)
- [ ] Apply to iHerb affiliate program
- [ ] Apply to HelloFresh Canada and GoodFood referral programs

### Advertising (activate at ~5,000 sessions/month)
- [ ] Create Google AdSense account — save Publisher ID as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- [ ] Create Google Ad Manager (GAM) network — save Network Code as `NEXT_PUBLIC_GAM_NETWORK_CODE`
- [ ] Submit Mediavine application (at 50,000 sessions/month)

---

## ✅ Done

- [x] Fix Cloudflare DNS (grey cloud) — SSL confirmed on weight-loss.ca and www ✅
- [x] GEMINI_API_KEY added to .env.local and Vercel ✅
- [x] All 9 page templates built and wired ✅
- [x] CMS editor in admin panel (edit, regenerate, image generate/upload) ✅
- [x] Hero image pipeline built (Nano Banana 2, priority list ~10% of pages) ✅
- [x] All 103 seed pages generated and live (60 location-service, 25 how-to, 18 product-review) ✅
- [x] DataForSEO keyword data fetched for all slugs (volume, CPC, traffic_potential) ✅
- [x] Admin content browser with keyword data columns, sort/filter controls ✅
- [x] About page with E-E-A-T signals (editorial team, medical reviewer, credentials) ✅
- [x] Editorial Policy page (source hierarchy, medical review process, affiliate disclosure) ✅
- [x] Contact + Privacy Policy (PIPEDA) pages ✅
- [x] Hub pages enhanced with JSON-LD schema + SEO content + cross-links ✅
- [x] Sitemap updated with all static pages ✅
- [x] Register weight-loss.ca domain ✅
- [x] Create Vercel account and link to GitHub repo (auto-deploy on push ✅)
- [x] Create GitHub repo (github.com/lenoldvaz/weight-loss-website) ✅
- [x] Create DataForSEO account (accounts@discovery-kitchen.com) ✅
- [x] Obtain Google Ads developer token ✅
- [x] Create Google Cloud service account (academic-empire-462216-p6) and download JSON key ✅
- [x] Complete Google Ads OAuth flow (Client ID + Secret + Refresh Token) ✅
- [x] Verify domain in Google Search Console (DNS TXT record added) ✅
- [x] GTM container created — ID: `GTM-TG5WJTV7` ✅
- [x] GA4 property created — Measurement ID: `G-GWXLDMY1ZB` ✅
- [x] Add Anthropic API key to `.env.local` ✅
- [x] Add `GOOGLE_SERVICE_ACCOUNT_JSON` secret to GitHub repo Actions secrets ✅
- [x] Add service account as Owner in Google Search Console ✅
- [x] Set `ADMIN_PASSWORD=qwedsa@123!` in `.env.local` and Vercel ✅
- [x] Admin panel live at weight-loss.ca/admin ✅
- [x] Tiptap rich text editor integrated in admin CMS (bold, italic, H2/H3, lists, blockquote, links) ✅
