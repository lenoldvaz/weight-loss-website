# weight-loss.ca — UX & Design Audit

**Date:** May 21, 2026  
**Pages reviewed:** `/generic-semaglutide-canada-tracker`, `weight-loss.ca` (homepage)  
**Issues found:** 8 total — 3 high priority, 3 medium, 2 quick wins

---

## Summary

The tracker page does a strong job with content and SEO but leaves users informed without being helped. The core problems are: no clear decision path for first-time visitors, trust-eroding presentation of estimated prices, and a layout that treats all providers as equally important. The homepage is a missed SEO/navigation opportunity while the site is in "coming soon" mode.

---

## Tracker Page — `/generic-semaglutide-canada-tracker`

### 🔴 HIGH — Provider cards have no visual hierarchy or scan path

**Problem:**  
All 10 provider cards look identical — same weight, same layout, same density. Users can't instantly find the cheapest option or filter by their situation (have a prescription vs. need one). The most important signal (price) is buried at the bottom-right of each card. The eye scans everything equally, which means it finds nothing quickly.

**Recommended fix:**

- Move price to the top-right of each card, displayed large (e.g. 24px+)
- Add a "Best value" badge to Hims and Felix (cheapest all-in options)
- Split the provider list into two tabs or sections:
  - **"I need a prescription included"** → Telehealth clinics
  - **"I already have a prescription"** → Retail/online pharmacies
- Consider a sticky comparison bar at the top of the provider grid showing the cheapest option per tier

---

### 🔴 HIGH — "Coming Soon" providers show a price, creating false confidence

**Problem:**  
PocketPills, Rexall, and London Drugs display `$114/mo` alongside a "Coming Soon" badge. Users will read this as a confirmed price and click through expecting to buy — then be disappointed. An estimated price presented like a confirmed price erodes trust in every number on the page.

**Recommended fix:**

- Label estimated prices clearly: `~$114 est.` with an info tooltip explaining it's derived from the provincial drug plan framework
- OR: Move all "Coming Soon" providers into a collapsible "Expected soon" section below the main grid, separated from available providers
- Add a contextual "Notify me when available" button on each Coming Soon card

---

### 🔴 HIGH — No conversion action — users are informed but not helped

**Problem:**  
The page answers "what exists" but not "what should I do." A first-time visitor doesn't know if they qualify, whether they need a consultation, or which provider suits their situation. There is no CTA, quiz, or recommendation flow to help them take the next step.

**Recommended fix:**  
Add a "Find my best option" decision widget — 3 quick questions:

1. Do you already have a prescription?
2. What province are you in?
3. What matters most: lowest price, fastest access, or most support?

This routes users to a specific provider recommendation. Even a simple text link ("Not sure which is right for you? Start here →") pointing to a short guide would help.

---

### 🟡 MEDIUM — The disclaimer note is styled like an error — it reads as alarming

**Problem:**  
The bold-text note about generics being "approved for Type 2 diabetes only" appears immediately after the hero stats, styled identically to a warning or error state. Many users will read this and assume the page doesn't apply to them — and leave — before reaching the provider list.

**Recommended fix:**

- Restyle as a soft info banner: light blue background, info icon (`ℹ`), collapsible
- Lead with the reassuring framing first: _"Off-label prescribing for weight loss is standard practice in Canada"_ — then add the caveat
- Consider moving it lower on the page, after the provider list intro copy

---

### 🟡 MEDIUM — The HC Approval Tracker table is duplicated as mobile cards

**Problem:**  
The Health Canada approval data appears twice on the page — once as a desktop table and again as stacked mobile cards. On desktop, both versions render visibly. This adds unnecessary page length, looks unpolished, and signals the responsive layout was patched rather than intentionally designed.

**Recommended fix:**  
Implement one table with CSS-only responsive behaviour — collapse to card layout at `max-width: 600px` using `display: block` on `<td>` elements with `data-label` attributes for mobile labels. Remove the duplicate card block entirely.

---

### 🟡 MEDIUM — Hero stats are inert — they should be interactive anchors

**Problem:**  
The three stat pills at the top of the page ("2 generics approved", "$114 lowest price/mo", "10 providers tracked") are compelling at a glance but completely inert. They're doing visual work but not navigational work.

**Recommended fix:**

- `10 providers tracked` → scroll anchor to the provider grid (`#providers`)
- `$114 lowest price/mo` → scroll to and highlight the Shoppers Drug Mart card
- `2 generics approved` → scroll anchor to the HC Approval Tracker table
- Add a subtle hover state (underline or slight bg tint) to signal they're clickable

---

### 🟢 QUICK WIN — No price-drop alert or notify-me CTA on the tracker

**Problem:**  
This is a live tracker with prices actively falling. The homepage has a generic email capture but there's nothing contextual on the tracker — no "Notify me when Costco gets generic semaglutide" or "Alert me when prices drop below $100/mo." That's a natural, high-intent email hook being left on the table.

**Recommended fix:**

- Add an inline "Notify me" button on each Coming Soon provider card
- Add a page-level sticky or inline banner: _"Prices are falling — get alerts when they drop"_ → email capture
- Bonus: Let users set a price threshold (e.g. "Alert me when any provider drops below $X/mo")

---

## Homepage — `weight-loss.ca`

### 🟡 MEDIUM — "Coming Soon" page doesn't surface live content

**Problem:**  
The homepage is gated behind a coming-soon launch page, but content-heavy pages like the tracker are already live, indexed, and valuable. The homepage doesn't link to any of this live content. Users who land on the homepage see only an email capture and leave, never discovering the tracker.

**Recommended fix:**

- Add a prominent banner or card on the homepage pointing to the tracker:  
  _"While you wait: Canada's generic semaglutide price tracker is live →"_
- Consider turning the "What's Coming" section into a mix of coming-soon items and already-live links
- Internally link from the tracker back to the homepage so crawlers and users build a sense of the full site

---

## Priority Order for Implementation

| Priority | Issue                                                 | Effort |
| -------- | ----------------------------------------------------- | ------ |
| 1        | Add "Find my best option" CTA / quiz                  | Medium |
| 2        | Fix Coming Soon estimated pricing presentation        | Low    |
| 3        | Redesign provider cards with price hierarchy + tabs   | Medium |
| 4        | Restyle disclaimer as soft info banner                | Low    |
| 5        | Fix duplicate HC table (remove mobile card duplicate) | Low    |
| 6        | Link homepage to live tracker content                 | Low    |
| 7        | Make hero stats into scroll anchors                   | Low    |
| 8        | Add price-drop email alerts                           | Medium |

---

## Notes

- Issues 2, 4, 5, 6, and 7 are all low-effort and can likely be shipped in a single session
- The "Find my best option" quiz (issue 1) has the highest potential impact on conversions and return visits — it's worth prioritising even if the first version is just a simple decision tree
- The price-drop alert hook (issue 8) is the best email list growth lever on the site right now given how actively prices are moving
