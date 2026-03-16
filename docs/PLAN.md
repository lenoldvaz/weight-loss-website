# weight-loss.ca — Live Project Plan

**Last Updated**: 2026-03-15
**Current Phase**: Phase 0 — Foundation Setup

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
- [ ] Register weight-loss.ca domain
- [ ] Create Vercel account / project
- [ ] Set up GitHub repository
- [ ] Configure environment variables

---

## Phase 1 — Next.js App Scaffold
*Goal: Working Next.js app deployed to Vercel with 0 pages*

- [ ] Initialize Next.js 15 project with TypeScript and Tailwind
- [ ] Configure project structure (App Router)
- [ ] Set up Zod for schema validation
- [ ] Create base layout (header, footer, nav)
- [ ] Create sitemap.xml auto-generation
- [ ] Create robots.txt
- [ ] Deploy skeleton to Vercel
- [ ] Connect custom domain weight-loss.ca
- [ ] Set up Google Search Console property
- [ ] Install Plausible or Google Analytics

---

## Phase 2 — Taxonomy & Schemas
*Goal: The complete niche taxonomy and page template schemas defined*

- [ ] Build `data/taxonomy/locations.json` (provinces + cities)
- [ ] Build `data/taxonomy/products.json`
- [ ] Build `data/taxonomy/services.json`
- [ ] Build `data/taxonomy/diets.json`
- [ ] Build `data/taxonomy/demographics.json`
- [ ] Build `data/taxonomy/conditions.json`
- [ ] Build `data/schemas/` — one Zod schema per page template
- [ ] Define all 9 page template schemas
- [ ] Write prompt templates for each schema type

---

## Phase 3 — First 3 Page Templates
*Goal: 3 fully functional page templates rendering real content*

- [ ] Template 1: Location × Service (`/weight-loss-clinics-[city]`)
- [ ] Template 2: How-To / Informational (`/how-to-[topic]-canada`)
- [ ] Template 3: Product Review (`/[product]-review-canada`)
- [ ] Internal linking between pages
- [ ] JSON-LD schema markup (FAQPage, MedicalWebPage)
- [ ] Mobile-responsive design
- [ ] Core Web Vitals check (LCP < 2.5s)

---

## Phase 4 — Content Generation Pipeline
*Goal: Automated pipeline that takes taxonomy → generates → validates → writes content JSON*

- [ ] Write `scripts/generate/prompt_builder.js`
- [ ] Write `scripts/generate/content_generator.js` (Claude API, 50 concurrent)
- [ ] Write `scripts/generate/validate.js` (Zod validation)
- [ ] Write `scripts/generate/write_content.js`
- [ ] End-to-end test with 10 pages
- [ ] Generate first 500 pages across 3 templates
- [ ] Validate all 500 outputs
- [ ] Deploy to Vercel
- [ ] Submit URLs to Google Search Console

---

## Phase 5 — Scale to 3,000 Pages
*Goal: 3,000 pages live, indexed, and ranking*

- [ ] Complete all 9 page templates
- [ ] Generate full first batch (~3,000 pages) across all templates
- [ ] Set up auto-sitemap covering all pages
- [ ] Internal linking strategy implemented
- [ ] E-E-A-T elements: About, Authors, Editorial Policy pages
- [ ] Affiliate links integrated (Amazon.ca, iHerb)
- [ ] Monitor GSC for indexing progress
- [ ] Monitor Core Web Vitals at scale

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

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Folder structure & docs | 2026-03-15 | ✅ Done |
| Next.js app on Vercel | TBD | ⬜ Pending |
| First 500 pages live | TBD | ⬜ Pending |
| 3,000 pages live | TBD | ⬜ Pending |
| First Google rankings | TBD | ⬜ Pending |
| 50k monthly sessions | TBD | ⬜ Pending |
| Mediavine approved | TBD | ⬜ Pending |
| 10,000 pages live | TBD | ⬜ Pending |
