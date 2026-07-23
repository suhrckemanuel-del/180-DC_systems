# 180DC Brand Facts — verified 2026-07-23

Sourced live from 180dc.org (global) and 180dc.org/branches/Delft-Rotterdam. Use this file as ground truth for the V2/V3/V7 rebrand pass — do not re-guess these values.

## Color — corrected

**Every one of the ten built variants invented a deep pine/forest green (`#00693C`-family). That is wrong.** The actual 180DC mark is a bright lime/grass green.

Sampled by pixel-clustering the three official logo files (see below) — tight, consistent cluster across all three independent files:

| Token | Hex | Use | AA contrast on white |
|---|---|---|---|
| `--green` (brand, exact) | `#78B038` | logo, large decorative type, backgrounds, buttons (with white/dark text on top), icons | 2.60 — **fails AA for text**, decorative/large-surface use only |
| `--green-deep` (AA-safe text) | `#4A7322` | body links, small text, anything that must pass WCAG AA on white | 5.58 — passes AA normal text |
| `--green-darkest` (extra safety) | `#3D6B1C` | optional, for very small text or low-vision contexts | 6.33 |

Pair with **generous white** (`#FFFFFF` or near-white `#FAFBF9`) per the client's explicit "more white" note — the ten built variants are all much heavier on saturated color/dark bands than 180DC's own site, which is white-dominant with green as accent.

## Logo — official assets, downloaded and checked in

Located in `website/variants/_brand/`:

| File | Source | Dimensions | Use |
|---|---|---|---|
| `180dc-logo-landscape-black.png` | 180dc.org global site | 2619×748, alpha | wide lockup, black text — light backgrounds, headers |
| `180dc-logo-black-text.png` | 180dc.org/branches/Delft-Rotterdam | 1528×1528, alpha | square/compact mark — this is likely "the big green ball" the client means; check it visually first |
| `180dc-logo-white.png` | 180dc.org global site (footer) | 2619×748, alpha | wide lockup, white text — dark backgrounds |

These are large, uncompressed PNGs (180–220 KB) pulled straight from the CDN (converted from AVIF). **Compress to WebP and subset/crop before shipping** — don't ship these raw files to production. Favicons must be regenerated from these marks in green (`#78B038` or `#4A7322` for legibility at tiny size), never orange — orange favicons currently exist on at least V2.

Original source URLs (for reference / re-fetch if needed):
- `https://cdn.prod.website-files.com/63b610d81215b25001c51b2b/6473fc49131edc263274c582_180DEGREES-FULL-CONSULTING-LANDSCAPE%20(1).avif`
- `https://cdn.prod.website-files.com/63c0930a7ee820653e9b5c84/64a3152846fee96fb0908096_TRANSPARENT%20FULL%20BLACK%20TEXT%20(1).avif`
- `https://cdn.prod.website-files.com/63b610d81215b25001c51b2b/6473fd944a0547694b03e237_180DC_Logo_white.avif`

No brand guideline PDF or press kit is linked from 180dc.org — these sampled/downloaded assets are the best available ground truth.

## "First multi-city branch" claim — fact-check result

**Confirmed, not invented.** Verbatim from the live Delft-Rotterdam branch page today: *"We are the first multi-city branch of the world's largest university-based consultancy"* and *"became the first multi-city branch of 180 Degrees Consulting"* after expanding to Erasmus Rotterdam. This is the org's own current public claim, not something built up from web research. The client still asked to fact-check it before it goes further — recommend a one-line confirmation from Stefan Kluwer (Branch President) before treating it as final for a formal deck/site, but there is no reason to believe it's false and it should not simply be deleted; soften only if the board flags it.

## Board roster — live-page snapshot (may be stale — Monday.com is the client's named source of truth)

The `monday` MCP server requires OAuth in an interactive session (`/mcp` or `claude mcp`) — it could not be authorized here. **Do not silently trust this roster as final; the client explicitly said to check Monday.**

| Name | Role (per live page) | Email |
|---|---|---|
| Stefan Kluwer | President | s.kluwer@180dc.org |
| Zhi Yu Yap | Vice President | z.yuyap@180dc.org |
| Phuong Anh Nguyen | Marketing Director | a.nguyen@180dc.org |
| Austeja Kupsyte | Events Director | a.kupsyte@180dc.org |
| Benas Maciulskis | External Relations Director | b.maciulskis@180dc.org |
| Sarayesha Fazila | Human Resources Director | s.fazila@180dc.org |
| James Ward | Consulting Director | j.ward@180dc.org |
| Fredrik Nygaard Løvåsen | Consulting Director | f.nygaard@180dc.org |

Per the terminology doc: "President" → **"Branch President"**, "Vice President" → **"Branch Vice-President"** in any copy. The other four director titles aren't explicitly covered by the Yes/No list; treat them as acceptable "Branch Executive" role titles unless the client corrects them.

## Terminology — full Yes/No table (from `branch-awards/Terminology Requirement.pdf`)

| ✅ Use | ❌ Don't use |
|---|---|
| Branches | Chapters, Offices, Clubs, Societies |
| 180 Degrees | 180Degrees |
| 180 Degrees Consulting | — |
| University-Based Consultancy / Social Impact Consultancy / Non-Profit Social Impact Consultancy / Non-Profit Consultancy | Student Consultancy, Pro Bono Consultancy |
| Junior Consultant (first project) / Senior Consultant (2nd+ project) / Project Manager (leading a project) / Branch Executive (leadership team) / Branch Vice-President / Branch President / Inaugural Branch President (founded a new branch) | Associate Consultant, **Team Leader (use Project Manager instead)**, President (use Branch President), Founder (use Inaugural Branch President), Executive Director (use Branch Director) |
| Consulting Cycle | Consulting Round |
| 180 Degrees Consultants / 180 Degrees Members | 180 Degrees Volunteers, 180 Degrees Students |
| Full names of positions | Acronyms for positions |
| Top University Talent (where possible) | "University Students" (sometimes unavoidable, but "talent" is normally better) |
| Low-Cost / Affordable / **Uniquely Affordable** Consulting Services | **Free**, **Pro-Bono**, **Volunteer** Consulting Services |
| "180 Degrees is the world's leading provider of very affordable, high quality consulting services for non-profits, social enterprises, and socially minded companies." (variations fine) | Anything inconsistent with that description |
| Emails ending `@180dc.org` | Emails ending `@180degreesconsulting.org` or university addresses |
| "Selected as a 180 Degrees Consultant" | "Selected for a 180 Degrees project" |
| "Apply to be a 180 Degrees Consultant" | "Apply to join 180 Degrees" |

**Critical, non-negotiable for this rebrand pass: remove every mention of "pro bono" and "free"/"€0" across V2, V3, V7.** This is a direct conflict with the shared `website/variants/content.md`, which currently says "100% pro bono" and "€0" repeatedly — that file is NOT to be edited as part of this pass (it stays the source of truth for the other 7 variants), but V2/V3/V7 are explicitly authorized to diverge from it on this specific point per the client's direct instruction. Reframe using the approved language: "very affordable," "low-cost," "uniquely affordable" consulting — the org still doesn't charge non-profits in practice, but the client wants brand-consistent phrasing, not a factual change to the underlying offer.
