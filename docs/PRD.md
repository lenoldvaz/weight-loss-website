# weight-loss.ca — Product Requirements Document (PRD)

**Version**: 1.0
**Date**: 2026-03-15
**Status**: Active

---

## 1. Vision

Build **weight-loss.ca** into the largest SEO-driven weight loss publication on the internet, starting with Canada and expanding to North America. The site is a programmatic content publication — not a blog — generating thousands of targeted pages from structured data templates. Primary revenue: display advertising, affiliate marketing, and lead generation.

---

## 2. Business Goals

| Goal                                 | Target   | Timeline  |
| ------------------------------------ | -------- | --------- |
| Pages indexed by Google              | 3,000    | Month 1   |
| Pages indexed by Google              | 10,000   | Month 3   |
| Monthly organic sessions             | 50,000   | Month 2   |
| Monthly organic sessions             | 250,000  | Month 4   |
| Mediavine approval (50k sessions/mo) | Achieved | Month 2-3 |
| Raptive approval (100k sessions/mo)  | Achieved | Month 3-4 |
| Monthly ad revenue                   | $5,000+  | Month 4   |

---

## 3. Target Market

- **Primary**: Canada (all provinces, focus on ON, BC, AB, QC)
- **Secondary**: United States, Australia, UK (same English content, geo-adapted)
- **Audience**: Adults 25-55 interested in weight loss, healthy eating, fitness, weight loss products and services

---

## 4. Core Architecture

### 4.1 The Programmatic SEO Model

Content is treated as **software output**, not written articles. Claude AI generates structured JSON data, Next.js React components handle all presentation. This means:

- Content and design are fully decoupled
- Redesigns don't require regenerating content
- 10,000+ pages can be generated in hours, not months

### 4.2 Content = Data + Templates

```
taxonomy.json  →  prompt_builder  →  Claude API  →  validated JSON  →  Next.js page
```

### 4.3 Two Content Tracks

**Track A — Programmatic (evergreen)**
Generated once, refreshed quarterly. Location × topic, product × location, comparison, demographic matrices.

**Track B — Trending (recurring)**
Weekly pipeline. Monitor Google Trends + Reddit + Health Canada news → generate 50 fresh articles/week → deploy → submit to GSC.

---

## 5. Niche Taxonomy

The taxonomy is the core asset. ~500 nodes across 7 dimensions:

### By Location

- **Provinces**: Ontario, British Columbia, Alberta, Quebec, Manitoba, Saskatchewan, Nova Scotia, New Brunswick, PEI, Newfoundland
- **Major cities**: Toronto, Vancouver, Calgary, Montreal, Ottawa, Edmonton, Winnipeg, Quebec City, Halifax, Victoria, Kelowna, Saskatoon, Regina

### By Product

- Prescription weight loss drugs (Ozempic, Wegovy, Saxenda, Mounjaro)
- OTC supplements (berberine, green tea extract, CLA, glucomannan)
- Meal delivery kits (HelloFresh Canada, GoodFood, Factor, Cook It)
- Fitness equipment (treadmills, stationary bikes, resistance bands, rowing machines)
- Wearables (Apple Watch, Garmin, Fitbit, Oura Ring)
- Apps (Noom, MyFitnessPal, Cronometer, Lose It!)

### By Service

- Weight loss clinics
- Medical weight loss programs
- Bariatric surgery (Ontario, BC, Alberta)
- Registered dietitians
- Personal trainers
- Online coaching programs

### By Diet

- Keto / ketogenic
- Intermittent fasting (16:8, OMAD, 5:2)
- Carnivore
- Mediterranean
- Plant-based / vegan
- Low-carb
- Calorie counting / CICO
- Paleo

### By Demographic

- Women
- Men
- Over 40 / over 50 / over 60
- Postpartum / after pregnancy
- Menopause
- Teens (16-19)
- Seniors (65+)

### By Condition

- Type 2 diabetes
- PCOS (Polycystic Ovary Syndrome)
- Hypothyroidism
- Insulin resistance
- Sleep apnea
- Depression / emotional eating

### Comparisons

- Diet vs diet (keto vs intermittent fasting, etc.)
- Product vs product (Ozempic vs Wegovy, etc.)
- Service vs service (clinic A vs clinic B)
- App vs app (Noom vs MyFitnessPal, etc.)

---

## 6. Page Templates

### Template 1 — Location × Service

**URL pattern**: `/weight-loss-clinics-[city]` or `/weight-loss-programs-[province]`
**Schema**: title, meta, intro, top_picks[], local_context, faqs[], cta
**Volume**: ~200 pages

### Template 2 — Location × Product

**URL pattern**: `/best-[product]-for-weight-loss-[city-or-province]`
**Schema**: title, meta, intro, product_list[], buying_guide, faqs[], cta
**Volume**: ~500 pages

### Template 3 — Product Review

**URL pattern**: `/[product-name]-review-canada`
**Schema**: title, meta, intro, verdict, pros_cons, ingredients, clinical_evidence, faqs[]
**Volume**: ~200 pages

### Template 4 — A vs B Comparison

**URL pattern**: `/[option-a]-vs-[option-b]`
**Schema**: title, meta, intro, comparison_table, winner_by_category[], faqs[], verdict
**Volume**: ~300 pages

### Template 5 — How-To / Informational

**URL pattern**: `/how-to-[topic]-canada` or `/[topic]-for-[demographic]`
**Schema**: title, meta, intro, steps[], tips[], common_mistakes[], faqs[], cta
**Volume**: ~500 pages

### Template 6 — Demographic × Topic

**URL pattern**: `/weight-loss-for-[demographic]-canada`
**Schema**: title, meta, intro, key_challenges[], strategies[], product_recommendations[], faqs[]
**Volume**: ~200 pages

### Template 7 — Condition × Topic

**URL pattern**: `/weight-loss-with-[condition]-canada`
**Schema**: title, meta, intro, medical_context, strategies[], cautions[], faqs[], cta
**Volume**: ~150 pages

### Template 8 — Best X in Y (List)

**URL pattern**: `/best-[category]-canada` or `/best-[category]-[province]`
**Schema**: title, meta, intro, ranked_list[], methodology, faqs[], cta
**Volume**: ~300 pages

### Template 9 — Trending Article (weekly)

**URL pattern**: `/[trending-keyword-slug]`
**Schema**: title, meta, intro, body_sections[], key_takeaways[], faqs[], cta
**Volume**: ~50/week

---

## 7. SEO Strategy

### 7.1 On-Page

- Deterministic title tags from templates (never AI-generated)
- JSON-LD schema: `FAQPage`, `MedicalWebPage`, `LocalBusiness`, `Product`, `Review`
- Internal linking: every page links to 3-5 related pages (location hub → city pages, etc.)
- Canonical URLs, sitemap.xml auto-generated

### 7.2 E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

Weight loss is YMYL (Your Money, Your Life) — Google applies strict quality standards:

- Author bylines on all pages (at minimum 2-3 credible personas)
- "Reviewed by [RD/Dietitian]" badge on health claim pages
- Editorial policy page
- Citations to Health Canada, Statistics Canada, peer-reviewed journals
- Clear "About Us" establishing Canadian expertise

### 7.3 Technical SEO

- Static Site Generation (SSG) via Next.js — every page pre-rendered
- Core Web Vitals optimized (LCP < 2.5s, CLS < 0.1)
- Mobile-first design
- Sitemap submitted to Google Search Console
- Robots.txt properly configured
- Hreflang tags for future US/international expansion

### 7.4 Content Quality Bar

Every page must:

1. Answer the search query better than current top 10 results
2. Include at least one interactive element (tool, calculator, checklist, comparison table)
3. Be genuinely useful without a search engine (the "would I bookmark this?" test)
4. Contain original Canadian data points or context

---

## 8. Monetization Strategy

### Phase 1 — Affiliate (Month 1+)

- Amazon.ca product affiliate links (8% on supplements, equipment)
- iHerb affiliate program
- Meal kit referral programs (HelloFresh CA, GoodFood)
- Supplement brand direct affiliate programs

### Phase 2 — Display Ads (Month 4-5 at 50k sessions)

- Apply to Mediavine ($10-30 RPM at 50k sessions/mo = $500-1,500/mo)
- Upgrade to Raptive at 100k sessions/mo ($15-40 RPM = $1,500-4,000/mo)
- Google AdSense as fallback during ramp-up

### Phase 3 — Lead Generation (Month 3+)

- Weight loss clinic directory — charge clinics $99-299/month for featured listing
- Dietitian/trainer directory — similar model
- Contact form referrals to clinics (pay-per-lead)

### Phase 4 — Sponsored Content (Month 6+)

- Branded articles for supplement/program companies ($500-2,000 per article)
- Newsletter sponsorships (build email list via content upgrades)

---

## 9. Analytics & Data Layer

### 9.1 Tag Management — Google Tag Manager (GTM)

GTM is the single container for all tracking pixels and scripts. All analytics, ad pixels, and third-party scripts are loaded through GTM — nothing is hardcoded into Next.js except the GTM snippet itself.

- **Container ID**: env var `NEXT_PUBLIC_GTM_ID`
- GTM snippet injected in `src/app/layout.tsx` (both `<head>` and `<noscript>` tags)
- All event pushes go through `window.dataLayer`

### 9.2 Data Layer Schema

A well-structured `dataLayer` is populated on every page load and key user interaction. This is the source of truth for all downstream analytics and ad targeting.

#### Page-level data (pushed on every route)

```js
window.dataLayer.push({
  event: "page_view",
  page: {
    path: "/weight-loss-clinics-toronto",
    template: "location-service", // template type
    title: "Weight Loss Clinics in Toronto (2026)",
    category: "clinics",
    location: "toronto",
    province: "ontario",
    demographic: null, // populated where applicable
    condition: null, // populated where applicable
    diet: null, // populated where applicable
    word_count: 1840,
    has_calculator: true,
    has_comparison_table: false,
    content_generated_at: "2026-03-15",
  },
  site: {
    domain: "weight-loss.ca",
    language: "en-CA",
    country: "CA",
    currency: "CAD",
  },
  user: {
    new_vs_returning: "new", // populated by GA4 client ID lookup
    session_id: "<uuid>",
  },
});
```

#### Custom events to track

| Event name           | Trigger                              | Key parameters                                                   |
| -------------------- | ------------------------------------ | ---------------------------------------------------------------- |
| `affiliate_click`    | Outbound affiliate link click        | `link_url`, `affiliate_program`, `product_name`, `page_template` |
| `cta_click`          | Any CTA button click                 | `cta_text`, `cta_position`, `page_template`                      |
| `calculator_use`     | User interacts with a calculator     | `calculator_type`, `input_values`, `result`                      |
| `checklist_complete` | User checks all items in a checklist | `checklist_type`, `page_path`                                    |
| `faq_expand`         | User expands an FAQ accordion        | `faq_question`, `faq_position`                                   |
| `scroll_depth`       | User scrolls 25 / 50 / 75 / 100%     | `depth_pct`, `page_template`                                     |
| `email_signup`       | Newsletter/lead form submitted       | `form_location`, `page_template`                                 |
| `clinic_lead`        | Clinic contact form submitted        | `clinic_name`, `city`, `province`                                |
| `ad_flag_enabled`    | Ad serving flag toggled on           | `trigger`, `session_count`                                       |
| `search_query`       | Internal site search used            | `query`, `results_count`                                         |

### 9.3 GA4 — Google Analytics 4

- **Measurement ID**: env var `NEXT_PUBLIC_GA4_ID`
- Loaded via GTM (not directly via `gtag.js`)
- Enhanced measurement enabled: scrolls, outbound clicks, site search, video engagement
- Custom dimensions mirroring data layer:
  - `page_template` (text)
  - `content_location` (text)
  - `content_province` (text)
  - `has_interactive_element` (boolean)
  - `affiliate_program` (text)
- Conversion events:
  - `email_signup` → primary conversion
  - `clinic_lead` → primary conversion
  - `affiliate_click` → secondary conversion
- Audiences to build:
  - High-intent visitors (3+ pages, affiliate click)
  - Returning visitors
  - Province-segmented audiences (for geo-targeted ad campaigns)
  - Template-specific audiences (clinic seekers, product researchers)

### 9.4 Google Search Console

- Property: `weight-loss.ca` (domain-level property, not URL-prefix)
- Verification: DNS TXT record
- Sitemap submitted: `https://weight-loss.ca/sitemap.xml`
- API access enabled for URL inspection and indexing submissions (used by `scripts/deploy/index_submitter.js`)

### 9.5 Plausible Analytics (Privacy-First Complement)

- Lightweight script, cookieless, GDPR-compliant
- Used as a fast, clean traffic dashboard without sampling
- Domain: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- Custom goals mirroring key GA4 events: affiliate clicks, email signups, CTA clicks

### 9.6 Microsoft Clarity (Heatmaps & Session Recording)

- Free heatmaps and session recordings to identify UX friction
- Loaded via GTM
- Project ID: env var `NEXT_PUBLIC_CLARITY_ID`
- Filter recordings to high-value sessions (affiliate clicks, form starts)

---

## 10. Advertising Strategy

### 10.1 Ad Serving Feature Flag

All ad-serving integrations are controlled by a single environment variable:

```bash
NEXT_PUBLIC_ADS_ENABLED=false   # Set to true when threshold is reached
NEXT_PUBLIC_ADS_SESSION_THRESHOLD=5000   # Sessions/month to auto-enable (optional)
```

The `<AdsProvider>` component in `src/components/ads/AdsProvider.tsx` reads this flag and conditionally renders all ad slots. When `false`, slots render as invisible placeholders (correct dimensions, no content) so layout doesn't shift when ads go live.

**Target trigger**: 5,000 monthly sessions → set `NEXT_PUBLIC_ADS_ENABLED=true` in Vercel env vars → redeploy.

### 10.2 Google AdSense (v1 Activation)

- Lowest barrier to entry — activate alongside the ad flag
- Publisher ID: env var `NEXT_PUBLIC_ADSENSE_CLIENT_ID`
- Auto ads enabled initially; transition to manual placement for higher RPM
- Ad slots: above-the-fold banner, in-content (after paragraph 3), sidebar (desktop), sticky footer (mobile)

### 10.3 Google Ad Manager (GAM) — Programmatic Direct

- GAM is the ad server that unifies all demand sources (AdSense, DSPs, direct deals)
- Network code: env var `NEXT_PUBLIC_GAM_NETWORK_CODE`
- All ad slots defined in GAM and rendered via GPT (Google Publisher Tag) loaded through GTM
- Enables header bidding, floor prices, and direct-sold inventory alongside programmatic

### 10.4 Header Bidding — Prebid.js

- Prebid.js runs client-side auction before GAM, maximizing yield across multiple SSPs
- Configured demand partners (activate as traffic scales):
  - **AppNexus / Xandr** — broad programmatic demand
  - **Rubicon / Magnite** — strong Canadian CPMs
  - **PubMatic** — video and display
  - **Index Exchange** — Canadian publisher strength
  - **Amazon TAM (Transparent Ad Marketplace)** — Amazon first-party demand
- Prebid config stored in `src/lib/ads/prebid.config.ts`
- Target: header bidding timeout 1,000ms to protect Core Web Vitals

### 10.5 DSP Integrations (Demand-Side Platforms)

The following DSPs can buy inventory on weight-loss.ca through GAM/Prebid once the ad flag is enabled:

| DSP               | Access Method    | Notes                                                |
| ----------------- | ---------------- | ---------------------------------------------------- |
| Google DV360      | GAM direct       | First-party Google demand; highest fill rate         |
| The Trade Desk    | Prebid / OpenRTB | Premium CPMs; strong health & wellness advertisers   |
| Amazon DSP        | Amazon TAM       | Health product advertisers; strong Canadian coverage |
| Xandr (Microsoft) | Prebid           | Access to Microsoft Advertising demand               |
| Criteo            | Prebid           | Retargeting-heavy; good for supplement advertisers   |

### 10.6 Mediavine / Raptive (Managed Programmatic)

- **Mediavine**: Apply at 50,000 sessions/month — replaces manual header bidding setup with their managed solution (~$10-30 RPM)
- **Raptive**: Apply at 100,000 sessions/month — premium managed ad partner (~$15-40 RPM)
- Both include their own header bidding stack; at this stage, Prebid.js is deprecated in favour of their managed solution

### 10.7 Ad Slot Layout

| Slot name       | Position              | Sizes                   | Notes                               |
| --------------- | --------------------- | ----------------------- | ----------------------------------- |
| `header-banner` | Below site header     | 728×90, 320×50 (mobile) | Above the fold — highest CPM        |
| `in-content-1`  | After paragraph 3     | 300×250, 336×280        | Native-feeling; highest viewability |
| `in-content-2`  | After paragraph 7     | 300×250                 | Only on long-form pages             |
| `sidebar-top`   | Desktop right rail    | 300×250, 300×600        | Desktop only                        |
| `sticky-footer` | Fixed bottom (mobile) | 320×50                  | Mobile only; dismissible            |
| `below-content` | End of article        | 728×90, 300×250         | Last resort fill                    |

### 10.8 Ad-Related Compliance

- GDPR/PIPEDA consent banner required before ad pixels fire (Canadian users)
- Use a Consent Management Platform (CMP) loaded via GTM — **Cookiebot** or **OneTrust** recommended
- GTM configured with consent mode v2: analytics and ad storage blocked until consent granted
- `ads.txt` file at `https://weight-loss.ca/ads.txt` listing all authorized sellers

---

## 11. Weekly Recurring Pipeline

```
Monday:    Keyword discovery
           - Pull Google Trends API (weight loss, Canada)
           - Scrape r/loseit, r/keto trending posts
           - Check Health Canada news feed
           - Output: top_50_keywords_[date].json

Tuesday:   Brief generation
           - Run brief_generator.js with Claude API
           - Output: article_briefs_[date].json

Wednesday: Content generation
           - Run content_generator.js (50 concurrent workers)
           - Validate all outputs against schema
           - Output: /data/content/trending/[date]/*.json

Thursday:  Deploy
           - Git push → Vercel auto-deploy
           - Sitemap regenerated automatically

Friday:    Index submission
           - Submit new URLs to Google Search Console API
           - Log in TASKS_COMPLETED.md
```

---

## 10. Tech Stack

| Layer             | Tool                          | Notes                                |
| ----------------- | ----------------------------- | ------------------------------------ |
| Framework         | Next.js 15 (App Router)       | SSG for all programmatic pages       |
| Hosting           | Vercel                        | Auto-deploy on git push              |
| Domain            | weight-loss.ca                | Register via Namecheap or Cloudflare |
| AI                | Claude API (claude-haiku-4-5) | ~$0.003/page for generation          |
| Database          | Supabase (PostgreSQL)         | For clinic directory, user data      |
| Tag management    | Google Tag Manager (GTM)      | Single container for all pixels      |
| Analytics         | GA4 + Google Search Console   | GA4 via GTM; GSC for SEO indexing    |
| Analytics (alt)   | Plausible                     | Cookieless, privacy-first dashboard  |
| Heatmaps          | Microsoft Clarity             | Session recordings, heatmaps         |
| Ad server         | Google Ad Manager (GAM)       | Unified ad serving + direct deals    |
| Header bidding    | Prebid.js                     | Multi-SSP auction; flag-gated        |
| CMP               | Cookiebot / OneTrust          | GDPR/PIPEDA consent; GTM consent v2  |
| Schema validation | Zod                           | Runtime validation of all AI output  |
| Styling           | Tailwind CSS                  | Utility-first, fast iteration        |
| Email             | Resend                        | Newsletters, transactional           |

---

## 11. Launch Checklist

**Infrastructure**

- [ ] Domain registered (weight-loss.ca)
- [ ] Vercel project created and linked
- [ ] GitHub repo created and connected to Vercel
- [ ] All environment variables set in Vercel dashboard
- [ ] DEPLOYMENT.md completed

**App**

- [ ] Next.js app scaffolded (TypeScript, Tailwind, Zod)
- [ ] GTM snippet added to `src/app/layout.tsx`
- [ ] Data layer `page_view` push wired up on every route change
- [ ] `AdsProvider` component built with `NEXT_PUBLIC_ADS_ENABLED` flag
- [ ] Ad slot placeholder components built (correct dimensions, no content when flag is off)
- [ ] `ads.txt` created at `public/ads.txt`
- [ ] Consent management banner (Cookiebot/OneTrust) loaded via GTM

**Analytics**

- [ ] GTM container created and published
- [ ] GA4 property created; Measurement ID added as env var
- [ ] GA4 tag + all custom event tags configured in GTM
- [ ] GA4 custom dimensions created (page_template, content_location, etc.)
- [ ] Plausible account created; script added via GTM
- [ ] Microsoft Clarity project created; snippet added via GTM
- [ ] Google Search Console property created (domain-level)
- [ ] GSC API key created for programmatic URL submissions

**Content**

- [ ] Taxonomy JSON built (500+ nodes)
- [ ] First 3 page templates built (Location×Service, How-To, Review)
- [ ] Claude API generation script written and tested
- [ ] First 500 pages generated and validated
- [ ] Sitemap.xml auto-generation working
- [ ] First 500 pages deployed to Vercel
- [ ] URLs submitted to Google Search Console
- [ ] E-E-A-T elements in place (About, Authors, Editorial Policy)

**Advertising (activate at 5,000 sessions/month)**

- [ ] Google AdSense account created; publisher ID stored as env var
- [ ] GAM network created; network code stored as env var
- [ ] Prebid.js config written (`src/lib/ads/prebid.config.ts`)
- [ ] At least 2 SSP demand partners configured in Prebid (AppNexus, Rubicon)
- [ ] `NEXT_PUBLIC_ADS_ENABLED` flipped to `true` in Vercel; redeployed
- [ ] Ad rendering verified across all slot positions and breakpoints

**Pipeline**

- [ ] Weekly trending pipeline tested end-to-end
