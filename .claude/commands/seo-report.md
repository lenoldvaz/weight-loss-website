# SEO Progress Report — weight-loss.ca

Run a full SEO progress check for weight-loss.ca. Execute all steps in parallel where possible, then present a single consolidated report.

## Steps

### 1. GSC report (rankings, indexing, wins, queue)
Run the full GSC report script:
```
npx tsx scripts/seo/gsc.ts report
```

### 2. Web search — what's changed in the market
Search for recent news (last 7 days) on:
- "generic semaglutide canada" — new approvals, pricing changes, pharmacy updates
- "apo-semaglutide" OR "semaglutide canada 2026" — new Health Canada decisions
- Any new provincial drug plan announcements (ODB Ontario, BC PharmaCare, RAMQ Quebec) covering generic semaglutide
- Competitor moves: GLP1Prices.ca, Felix Health, Hims Canada, Phoenix Health

Flag anything that requires a content update on weight-loss.ca.

### 3. Supabase queue
```
npx tsx scripts/seo/gsc.ts queue
```

### 4. Verify live site health
Check that these URLs return 200 and have correct structured data:
- https://weight-loss.ca/generic-semaglutide-canada
- https://weight-loss.ca/news-sitemap.xml (should have articles, not empty)

## Output format

Present a single structured report with these sections:

**🔄 Crons** — both crons running? Last run times. Any failures.

**📈 Rankings this week** — top pages by clicks, biggest position movers (wins), new pages appearing in GSC for the first time.

**🔍 Cluster indexing** — status of all 9 generic semaglutide pages. How many indexed vs pending.

**📬 Queue** — submitted / pending / failed counts. Days until empty.

**🗞️ Market news** — bullet list of anything that changed on the internet this week that requires a content update. For each item: what changed, which page(s) need updating, priority (high/medium/low).

**⚠️ Issues** — anything broken or degraded.

**🎯 Next steps** — top 3 actions ranked by SEO impact. Distinguish between what Claude can do now vs what Lenold needs to do (backlinks, outreach).
