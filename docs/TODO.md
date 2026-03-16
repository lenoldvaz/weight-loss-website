# weight-loss.ca — Lenold's Action Items

**Last Updated**: 2026-03-16

> Only items that require **Lenold's** action: account signups, DNS changes, approvals, credentials, decisions. Build tasks are tracked in `PLAN.md`.

---

## 🔲 Immediate (do these now)

### DNS — SSL broken on www.weight-loss.ca
- [ ] In Cloudflare DNS: set `A` record `@` → `76.76.21.21` to **grey cloud (DNS-only)**
- [ ] In Cloudflare DNS: set `CNAME` record `www` → `cname.vercel-dns.com` to **grey cloud (DNS-only)**
- Orange cloud = Cloudflare proxies SSL = Vercel can't issue its own cert = ERR_SSL_VERSION_OR_CIPHER_MISMATCH

### Content generation
- [ ] Run `npm run generate -- --all` to generate remaining ~96 pages (leave running ~35 min)
- [ ] After done: `git add src/data/content/ && git commit -m "content: batch 1" && git push`

---

## 🔲 Next Up (build tasks)

### Images
- [ ] Build Nano Banana 2 (Google Imagen / Gemini 3.1 Flash Image) image generation pipeline
  - Add `hero_image_query` to seeds, generate image after content, store `hero_image: { url, alt }` in JSON
  - Cost: ~$0.067/image at 1K res → ~$7 for current 103 seeds, ~$200 for 3,000 pages
  - Same GCP project (academic-empire-462216-p6) already configured

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

- [x] Register weight-loss.ca domain
- [x] Create Vercel account and link to GitHub repo (auto-deploy on push ✅)
- [x] Create GitHub repo (github.com/lenoldvaz/weight-loss-website)
- [x] Create DataForSEO account (accounts@discovery-kitchen.com)
- [x] Obtain Google Ads developer token
- [x] Create Google Cloud service account (academic-empire-462216-p6) and download JSON key
- [x] Complete Google Ads OAuth flow (Client ID + Secret + Refresh Token)
- [x] Verify domain in Google Search Console (DNS TXT record added)
- [x] GTM container created — ID: `GTM-TG5WJTV7`
- [x] GA4 property created — Measurement ID: `G-GWXLDMY1ZB`
- [x] Add Anthropic API key to `.env.local` ✅
- [x] Add `GOOGLE_SERVICE_ACCOUNT_JSON` secret to GitHub repo Actions secrets ✅
- [x] Add service account as Owner in Google Search Console ✅
- [x] Set `ADMIN_PASSWORD=qwedsa@123!` in `.env.local` and Vercel ✅
- [x] Admin panel live at weight-loss.ca/admin ✅
