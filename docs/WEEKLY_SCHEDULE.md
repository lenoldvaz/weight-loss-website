# weight-loss.ca — Weekly Operating Schedule

**Created**: 2026-08-23
**Goal**: #1 on hundreds of long-tail Canadian GLP-1/weight-loss queries, compounding into topical authority. This is not a "#1 on 'weight loss'" plan — that term is owned by Healthline/WebMD/Novo Nordisk's own domain and isn't a realistic 12-month target. Long-tail dominance is what actually gets you there.

The three levers, in order of current bottleneck severity:
1. **Distribution** (backlinks, indexing) — the site has content Google barely trusts yet. This is the #1 constraint right now.
2. **Cadence** (new pages weekly, on a rhythm Google can learn) — content velocity without a rhythm looks like spam; with one, it looks like a real publication.
3. **Technical trust** (Core Web Vitals, structured data, E-E-A-T) — table stakes, mostly done, needs periodic re-checking.

---

## Daily (Lenold — 5-10 min)

Do this every day, ideally same time. GSC indexing quota resets daily and doesn't bank — skipping a day is quota wasted forever.

- [ ] GSC → URL Inspection → request indexing for up to 10 URLs (prioritize newest pages first)
- [ ] Quick scan of `/semaglutide-news` — anything big enough to share on social/LinkedIn?
- [ ] If a backlink/guest-post reply landed in your inbox, respond same-day — journalist queries (Connectively) are time-sensitive

```bash
npx tsx scripts/seo/gsc.ts queue   # see what's not yet indexed, prioritized
```

---

## Weekly (Lenold — 1 hour, pick a fixed slot e.g. Monday AM)

### Outreach block (35 min) — the actual bottleneck
- [ ] Connectively (connectively.us): respond to 3+ relevant health/diet journalist queries
- [ ] 1 new dietitian/health blog contacted (guest post or data-use offer) — target: 5 total by end of Month 1, then 1/week ongoing
- [ ] Check status on any pending directory submissions (CARP, Canadian Obesity Network) or clinic outreach

### Review block (20 min)
- [ ] Run the weekly report (below), skim rankings movement and new indexing
- [ ] Review whatever I generated that week — spot-check 1-2 pages for accuracy/tone before they've been live long
- [ ] Flag anything broken/off on mobile

### Housekeeping (5 min)
- [ ] Confirm no pending Vercel/Supabase env var or migration items sitting undone (I'll always flag these explicitly, but a weekly glance catches drift)

```bash
npx tsx scripts/seo/gsc.ts report     # full weekly digest: coverage + queries + wins + errors
```

---

## Weekly (Claude — on the same cadence, no need to ask each time)

Ping me at the start of the week (or just say "weekly run") and I'll do this block in one pass:

1. **Content**: 3-5 new pages targeting keyword gaps (see rotating backlog below) — comparisons, pricing/coverage articles, or province/city pages, validated against schema + built before handoff
2. **Fix pass**: spot-check 2-3 existing pages for the kind of data corruption we found in contrave/berberine (truncated fields, mangled prices) — this class of bug is invisible until read closely
3. **Internal linking**: make sure anything new week's content gets linked from `related_topics` on at least 2 existing high-traffic pages
4. **Technical**: rotate through Core Web Vitals checks, structured data audits, sitemap sanity — one technical item per week, not all at once
5. **Docs sync**: `TASKS_COMPLETED.md`, `PLAN.md`, `TODO.md`, `DEPLOYMENT.md` updated same-day per CLAUDE.md rules
6. **Report back**: what shipped, what's blocked on you (env vars, migrations, account signups), and next week's content targets

---

## Content backlog — pick 3-5/week, roughly in this order

Rotate breadth (new keyword clusters) with depth (strengthening what's already ranking near page 1 — currently `contrave-review` pos ~41, `berberine-review` pos ~60).

**Remaining Month 1-2 gaps:**
- [ ] Province pages: Saskatchewan, Nova Scotia, New Brunswick generic-semaglutide pages (Ontario/BC/Alberta/Quebec/Manitoba already done)
- [ ] `/zepbound-canada-price` — mirrors `mounjaro-canada-price` pattern, Zepbound demand is rising
- [ ] `/saxenda-vs-ozempic-canada` — comparison, moderate search volume
- [ ] City-level GLP-1 pricing pages for top 5 metros (Toronto, Vancouver, Calgary, Montreal, Ottawa) — location × product template already exists, unused
- [ ] Best-list template: `/best-glp1-telehealth-canada`, `/best-weight-loss-clinics-canada` — unlocks a template type with zero pages currently

**Depth (existing page improvements):**
- [ ] `/contrave-review` — add comparison table (in progress per TODO)
- [ ] `/berberine-review` — add Ozempic/generic-semaglutide comparison table
- [ ] Spot-check remaining 16 product-review pages for the same truncation/corruption pattern found in 3 of them this week

**Month 2+ (once Month 1 gaps close):**
- [ ] Build seed files for unused templates (demographic-topic, condition-topic, best-list, location-product) — ~200 pages of headroom
- [ ] Stand up `scripts/trending/` pipeline for automated weekly content (currently doesn't exist — was Phase 6 on the original plan, never started)

---

## Monthly checkpoint (first Monday of the month)

- [ ] Re-run this schedule's assumptions against `docs/TODO.md` Goals & Milestones table — update targets if pace is ahead/behind
- [ ] Review which backlink outreach converted — double down on what worked
- [ ] Reassess: is distribution or content the bigger bottleneck now? Rebalance the weekly split if so.

---

## Why this order

Content velocity is not currently the bottleneck — there's a real backlog of unused templates and enough runway to generate hundreds more pages. The site's actual constraint is **authority and trust signals**: a 5-month-old site with near-zero backlinks doesn't outrank Healthline on page count alone. That's why the weekly hour is weighted 35/20/5 toward outreach over content review — outreach is the lever content can't substitute for, and it's the one lever only you can pull.
