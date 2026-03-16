# weight-loss.ca — Lenold's Action Items

**Last Updated**: 2026-03-15

> Only items that require **Lenold's** action: account signups, DNS changes, approvals, credentials, decisions. Build tasks are tracked in `PLAN.md`.

---

## ✅ Done

- [x] Register weight-loss.ca domain
- [x] Create Vercel account and link to GitHub repo
- [x] Create GitHub repo (github.com/lenoldvaz/weight-loss-website)
- [x] Create DataForSEO account (accounts@discovery-kitchen.com)
- [x] Obtain Google Ads developer token
- [x] Create Google Cloud service account and download JSON key
- [x] Complete Google Ads OAuth flow (Client ID + Secret + Refresh Token)

---

## 🔲 To Do

### Vercel & GitHub
- [ ] Connect Vercel project to GitHub repo (vercel.com → Project Settings → Git → Connect Repository) so every `git push` auto-deploys

### DNS & Domain
- [ ] Point weight-loss.ca DNS to Vercel (add Vercel nameservers or A/CNAME records at your registrar)

### Google
- [ ] Verify domain in Google Search Console (add DNS TXT record at registrar)
- [ ] Create GTM container at tagmanager.google.com — save the Container ID as `NEXT_PUBLIC_GTM_ID`
- [ ] Create GA4 property at analytics.google.com — save the Measurement ID as `NEXT_PUBLIC_GA4_ID`
- [ ] Create Microsoft Clarity project at clarity.microsoft.com — save Project ID as `NEXT_PUBLIC_CLARITY_ID`
- [ ] Enable Google Search Console API and create a service account key for URL submissions

### Analytics
- [ ] Create Plausible account at plausible.io — add weight-loss.ca as a site

### Reddit
- [ ] Create Reddit API app at reddit.com/prefs/apps (needed for trending pipeline in Phase 6)

### Affiliates (start when content is live)
- [ ] Apply to Amazon.ca affiliate program (associates.amazon.ca)
- [ ] Apply to iHerb affiliate program
- [ ] Apply to HelloFresh Canada and GoodFood referral programs

### Advertising (activate at ~5,000 sessions/month)
- [ ] Create Google AdSense account — save Publisher ID as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- [ ] Create Google Ad Manager (GAM) network — save Network Code as `NEXT_PUBLIC_GAM_NETWORK_CODE`
- [ ] Submit Mediavine application (at 50,000 sessions/month)

### Credentials
- [ ] Add Anthropic API key to `.env.local` and Vercel env vars (needed for automated generation scripts in Phase 4)
- [ ] Add all new env var IDs (GTM, GA4, Clarity, Plausible) to Vercel dashboard
