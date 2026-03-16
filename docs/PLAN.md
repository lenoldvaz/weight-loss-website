# weight-loss.ca — Live Project Plan

**Last Updated**: 2026-03-16
**Current Phase**: Phase 3 — Page Templates & Generation Pipeline

---

## Phase 0 — Foundation Setup
*Goal: Project structure, rules, and documentation in place*

- [x] 2026-03-15 — Define project vision and SEO strategy
- [x] 2026-03-15 — Create folder structure
- [x] 2026-03-15 — Create CLAUDE.md (project rules)
- [x] 2026-03-15 — Create PRD.md (master product requirements)
- [x] 2026-03-15 — Create PLAN.md (this file)
- [x] 2026-03-15 — Create TASKS_COMPLETED.md
- [x] 2026-03-15 — Create DEPLOYMENT.md
- [x] 2026-03-15 — Register weight-loss.ca domain
- [x] 2026-03-15 — Create Vercel account / project
- [x] 2026-03-16 — Connect Vercel project to GitHub repo (auto-deploy on push to main)
- [x] 2026-03-15 — Set up GitHub repository (github.com/lenoldvaz/weight-loss-website)
- [x] 2026-03-15 — DataForSEO account created (accounts@discovery-kitchen.com)
- [x] 2026-03-15 — Google Ads developer token obtained (GrPK4Mn7TzCa_u82xVGcuQ)
- [x] 2026-03-15 — Google service account created (academic-empire-462216-p6)
- [x] 2026-03-15 — Created .env.local with all current credentials
- [x] 2026-03-15 — Created .gitignore protecting credentials and JSON keys
- [x] 2026-03-15 — Complete Google Ads OAuth flow (Client ID + Secret + Refresh Token)
- [ ] Create Reddit API app (reddit.com/prefs/apps) — deferred to Phase 6
- [ ] Add Anthropic API key to .env.local (for automated scripts) — deferred, using Claude Code for now

---

## Phase 1 — Next.js App Scaffold ✅ COMPLETE
*Goal: Working Next.js app deployed to Vercel with 0 pages*

- [x] 2026-03-16 — Initialize Next.js 15 project with TypeScript and Tailwind
- [x] 2026-03-16 — Configure project structure (App Router)
- [x] 2026-03-16 — Set up Zod for schema validation
- [x] 2026-03-16 — Create base layout (Header, Footer, EmailCaptureForm components)
- [x] 2026-03-16 — Create sitemap.xml auto-generation (Next.js native)
- [x] 2026-03-16 — Create robots.txt (Next.js native)
- [x] 2026-03-16 — Deploy to Vercel — https://weight-loss-ca.vercel.app (HTTP 200 ✅)
- [x] 2026-03-16 — Coming soon landing page live with full SEO metadata, OG tags, Canadian geo meta
- [x] 2026-03-16 — Connect custom domain weight-loss.ca (added on Vercel, DNS updated)
- [ ] Confirm DNS propagation complete (check weight-loss.ca resolves)
- [ ] Set up Google Search Console property (domain property, verify via DNS TXT)
- [ ] Install Plausible or Google Analytics

---

## Phase 2 — Taxonomy & Schemas
*Goal: The complete niche taxonomy and page template schemas defined*

**Taxonomy (25/25 complete ✅)**
- [x] 2026-03-16 — locations.json (10 provinces, 40 cities)
- [x] 2026-03-16 — products.json (supplements, equipment, wearables, apps, meal kits)
- [x] 2026-03-16 — services.json (clinics, dietitians, trainers, programs)
- [x] 2026-03-16 — diets.json (14 diets with evidence ratings)
- [x] 2026-03-16 — demographics.json (11 audience segments)
- [x] 2026-03-16 — conditions.json (13 medical conditions)
- [x] 2026-03-16 — medications.json (8 weight loss drugs, GLP-1 focused)
- [x] 2026-03-16 — symptoms.json (15 symptoms driving search)
- [x] 2026-03-16 — goals.json (20 outcome-based page seeds)
- [x] 2026-03-16 — body-parts.json (10 targeted areas)
- [x] 2026-03-16 — exercises.json (13 exercise types)
- [x] 2026-03-16 — brands.json (16 named programs/brands)
- [x] 2026-03-16 — providers.json (seed Canadian clinic data)
- [x] 2026-03-16 — procedures.json (6 bariatric + 3 non-surgical)
- [x] 2026-03-16 — ingredients.json (14 supplement ingredients)
- [x] 2026-03-16 — comparisons.json (25 pre-seeded A vs B pairs)
- [x] 2026-03-16 — lifestyles.json (12 lifestyle contexts)
- [x] 2026-03-16 — cultural.json (8 cultural/ethnic contexts)
- [x] 2026-03-16 — timelines.json (9 time-based hooks)
- [x] 2026-03-16 — costs.json (10 pricing search queries)
- [x] 2026-03-16 — seasons.json (7 seasonal hooks + 2 Canadian events)
- [x] 2026-03-16 — tools.json (10 calculators)
- [x] 2026-03-16 — meal-plans.json (15 meal plan types)
- [x] 2026-03-16 — occupations.json (10 occupation contexts)
- [x] 2026-03-16 — questions.json (20 long-tail FAQ seeds)

**Schemas (9/9 complete ✅)**
- [x] 2026-03-16 — location-service.schema.ts
- [x] 2026-03-16 — location-product.schema.ts
- [x] 2026-03-16 — product-review.schema.ts
- [x] 2026-03-16 — comparison.schema.ts
- [x] 2026-03-16 — how-to.schema.ts
- [x] 2026-03-16 — demographic-topic.schema.ts
- [x] 2026-03-16 — condition-topic.schema.ts
- [x] 2026-03-16 — best-list.schema.ts
- [x] 2026-03-16 — trending-article.schema.ts
- [x] 2026-03-16 — index.ts (barrel export + TEMPLATE_SCHEMAS map)
- [x] 2026-03-16 — TypeScript compilation clean (zero errors)

**Phase 2 ✅ COMPLETE**

---

## Phase 3 — Page Templates & Generation Pipeline
*Goal: 3 working page templates + content generation pipeline producing real pages*

**Prompt templates ✅ COMPLETE**
- [x] 2026-03-16 — 9 prompt templates written (scripts/generate/prompts/)

**Generation pipeline ✅ COMPLETE**
- [x] 2026-03-16 — `scripts/generate/types.ts` — seed type definitions
- [x] 2026-03-16 — `scripts/generate/prompt_builder.ts` — seed → prompt + slug routing
- [x] 2026-03-16 — `scripts/generate/content_generator.ts` — Claude API, concurrency, retries
- [x] 2026-03-16 — `scripts/generate/validate.ts` — Zod validation
- [x] 2026-03-16 — `scripts/generate/write_content.ts` — idempotent file writes
- [x] 2026-03-16 — `scripts/generate/run.ts` — CLI entry point
- [x] 2026-03-16 — Seeds: 60 location-service, 25 how-to, 18 product-review
- [x] 2026-03-16 — Dry-run test passed ✅

**React page templates ✅ COMPLETE**
- [x] 2026-03-16 — Template 1: Location × Service (`/weight-loss-clinics-[city]`) — LocationServiceTemplate
- [x] 2026-03-16 — Template 2: How-To (`/how-to-[topic]`) — HowToTemplate
- [x] 2026-03-16 — Template 3: Product Review (`/[product]-review`) — ProductReviewTemplate
- [x] 2026-03-16 — JSON-LD: FAQPage, HowTo, ItemList, LocalBusiness, Product/Review schemas
- [x] 2026-03-16 — RelatedLinks component (internal backlinks, SSG)
- [x] 2026-03-16 — External links use rel="nofollow noreferrer"
- [x] 2026-03-16 — `src/app/[slug]/page.tsx` — catch-all SSG route with generateStaticParams + generateMetadata
- [x] 2026-03-16 — Build clean — 3 pages static ✅

**Remaining Phase 3**
- [ ] Mobile-responsive design verified (visual QA)
- [ ] Core Web Vitals check (LCP < 2.5s)
- [ ] End-to-end test — generate 10 pages via API, validate, check render
- [ ] Generate first 500 pages across 3 templates (Anthropic API now available)
- [ ] Deploy to Vercel, submit URLs to Google Search Console

---

## Phase 4 — Scale to 3,000 Pages
*Goal: All 9 page templates live, 3,000+ pages indexed*

- [ ] Complete all 9 React page templates
- [ ] Generate full first batch (~3,000 pages) across all templates
- [ ] Auto-sitemap updated to include all generated pages
- [ ] Internal linking strategy implemented across all templates
- [ ] E-E-A-T pages built: About, Authors, Editorial Policy
- [ ] Affiliate links integrated (Amazon.ca, iHerb, Felix, HelloFresh)
- [ ] Monitor GSC for indexing progress
- [ ] Core Web Vitals verified at scale

---

## Phase 5 — Analytics, Ads & Monetization
*Goal: Revenue streams active, tracking in place*

- [ ] Google Search Console property created and verified
- [ ] GA4 + GTM installed and events firing
- [ ] Plausible installed (privacy-first dashboard)
- [ ] Microsoft Clarity installed (heatmaps)
- [ ] Amazon.ca affiliate account approved
- [ ] iHerb affiliate account approved
- [ ] Felix Health affiliate set up
- [ ] HelloFresh Canada affiliate set up
- [ ] Meal kit and supplement affiliate links live on pages
- [ ] Google AdSense account created (activate at 5,000 sessions)
- [ ] ads.txt file live at weight-loss.ca/ads.txt
- [ ] Consent banner (Cookiebot/OneTrust) live for PIPEDA

---

## Phase 6 — Weekly Trending Pipeline
*Goal: Automated weekly content engine producing 50 new articles/week*

- [ ] Set up Google Trends API access
- [ ] Write `scripts/trending/keyword_scout.js`
- [ ] Write `scripts/trending/brief_generator.js`
- [ ] Write `scripts/trending/content_generator.js`
- [ ] Write `scripts/trending/index_submitter.js`
- [ ] Test full weekly pipeline end-to-end
- [ ] Schedule via cron (or GitHub Actions)
- [ ] First full weekly run completed

---

## Phase 7 — Monetization
*Goal: Multiple revenue streams active*

- [ ] Amazon.ca affiliate account approved
- [ ] iHerb affiliate account approved
- [ ] Meal kit affiliate programs joined
- [ ] Affiliate links integrated across product pages
- [ ] Clinic directory pages built
- [ ] Google AdSense account created (early revenue)
- [ ] Mediavine application submitted (at 50k sessions)

---

## Phase 8 — Scale to North America
*Goal: Expand content to US, maintain Canadian focus*

- [ ] US location taxonomy built (states + major cities)
- [ ] US-specific content variants generated
- [ ] Hreflang tags implemented
- [ ] US affiliate programs joined
- [ ] Target: 10,000+ total pages

---

## Milestones

| Milestone | Date | Status |
|-----------|------|--------|
| Folder structure & docs | 2026-03-15 | ✅ Done |
| All accounts & credentials set up | 2026-03-15 | ✅ Done |
| Next.js app live on Vercel | 2026-03-16 | ✅ Done |
| Vercel connected to GitHub (auto-deploy) | 2026-03-16 | ✅ Done |
| weight-loss.ca domain added + DNS updated | 2026-03-16 | ✅ Done |
| 25 taxonomy files complete | 2026-03-16 | ✅ Done |
| 9 Zod schemas complete | 2026-03-16 | ✅ Done |
| DNS propagation confirmed | TBD | ⬜ Pending |
| Google Search Console verified | TBD | ⬜ Pending |
| First 500 pages generated + live | TBD | ⬜ Pending |
| 3,000 pages live | TBD | ⬜ Pending |
| First Google rankings | TBD | ⬜ Pending |
| 5,000 monthly sessions (ads activate) | TBD | ⬜ Pending |
| 50,000 monthly sessions | TBD | ⬜ Pending |
| Mediavine approved | TBD | ⬜ Pending |
| 10,000 pages live | TBD | ⬜ Pending |
