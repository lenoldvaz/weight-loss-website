# CLAUDE.md — weight-loss.ca Project Rules

## Core Rules (Always Follow)

### 1. Task Tracking
- After completing **every step**, append an entry to `docs/TASKS_COMPLETED.md`
- Format: `- [YYYY-MM-DD] [Category] Description of what was done`
- No exceptions — every file created, script written, deployment made, config changed

### 2. Plan Sync
- After completing any **larger piece of work** (a full feature, a new template, a generation run, a deployment), update `docs/PLAN.md`
- Mark completed phases/steps with `[x]` and add a completion date
- If scope changes, update the plan before proceeding

### 3. Deployment Log
- Any time a deployment is made, a new API key is created, a service is configured, or credentials are set, update `docs/DEPLOYMENT.md`
- This file must always be the single source of truth for "how do I get this running again from scratch"

---

## Project Context

**Website**: weight-loss.ca
**Goal**: Become the #1 SEO-driven weight loss publication in Canada and North America
**Model**: Programmatic SEO — generate thousands of pages from structured data templates
**Monetization**: Display ads (Mediavine/Raptive), affiliate links, lead gen for clinics
**Tech Stack**: Next.js (App Router), Vercel, Claude API, Supabase (when needed)

---

## Folder Structure

```
weightloss-website/
├── CLAUDE.md                    ← You are here. Project rules.
├── docs/
│   ├── PRD.md                   ← Master product requirements & SEO strategy
│   ├── PLAN.md                  ← Live project plan with completion tracking
│   ├── TASKS_COMPLETED.md       ← Running log of every completed step
│   └── DEPLOYMENT.md            ← All hosting, API keys, deployment details
├── src/
│   ├── app/                     ← Next.js App Router pages
│   ├── components/              ← React components / page template renderers
│   ├── lib/                     ← Utility functions, API clients
│   └── data/
│       ├── taxonomy/            ← Niche taxonomy JSON files
│       ├── content/             ← Generated page content JSON
│       └── schemas/             ← JSON schemas per page template type
├── scripts/
│   ├── generate/                ← Batch content generation scripts
│   ├── trending/                ← Weekly trending keyword pipeline
│   └── deploy/                  ← Deployment & indexing scripts
└── public/                      ← Static assets
```

---

## Content Generation Rules

- Every generated page must pass JSON schema validation before being written to disk
- Always include Canadian context (CAD prices, Health Canada refs, provincial programs)
- Use deterministic, template-driven titles — never let AI freely generate the `<title>` tag
- Every page must contain at least one interactive element (checklist, calculator, comparison table, FAQ)
- Progressive rollout: max 500 new pages/day to avoid Google spam signals

## Code Style

- TypeScript everywhere
- No `any` types
- Use `zod` for runtime schema validation
- Keep generation scripts idempotent (safe to re-run)
