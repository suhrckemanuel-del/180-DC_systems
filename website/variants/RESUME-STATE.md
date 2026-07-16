# RESUME-STATE — audit before the Cloudflare consolidation

Audited 2026-07-10 against the on-disk tree and each variant's /guide critique log. This file is the single source of truth for what remains.

## Shared assets

| File | State |
|---|---|
| `content.md` | ✅ exists — single source of truth for copy, used by all variants |
| `DIRECTIONS-6-10.md` | ✅ exists — retrospective on V1–V5 + the five invented theses (Deck, Polder, De Courant, Pamflet, Ledger) with build order V6 → V10 → V9 → V7 → V8 |
| `tools/` | deploy.ps1 (Netlify — now legacy), getfont.mjs, shoot.mjs (Playwright screenshots, scroll-aware), lh.mjs (local Lighthouse vs Playwright Chromium), imggen.mjs (gpt-image-2, unused so far), psi.mjs (PSI — quota-dead, superseded by lh.mjs) |

## Variant status (from /guide logs)

| Variant | Built | Critic rounds | Lighthouse (final) | Local tree vs last Netlify deploy |
|---|---|---|---|---|
| v1-blueprint | ✅ | **3/3 complete** + fixes applied | 100/100/100/100, 77–83 KB | in sync (final deployed) |
| v2-port | ✅ | **3/3 complete** + fixes applied | 100/95–97/100/100, 123–230 KB | in sync (final deployed) |
| v3-destijl | ✅ | **3/3 complete** + fixes applied | 100/100/100/100, 141–146 KB | in sync (final deployed) |
| v4-terminal | ✅ | **3/3 complete** + fixes applied | 100/100/100/100, 159–165 KB | in sync (final deployed) |
| v5-soft | ✅ | **3/3 complete** + fixes applied | ⏳ needs final Lighthouse run | **local is newer** — round-3 fixes never deployed (Netlify block hit mid-deploy) |
| v6-deck | ✅ | **1/3** — round-1 notes applied (rev B local) | ⏳ | local (rev B) newer than deployed (rev A) |
| v10-ledger | ✅ | **0/3** — built, never critiqued, never deployed | ⏳ | local only |
| v7-polder | ❌ not built | — | — | — |
| v8-courant | ❌ not built | — | — | — |
| v9-pamflet | ❌ not built | — | — | — |

## What was deployed where (now dead weight)

Per-variant Netlify sites exist at `180dc-v{1..6}-<slug>.netlify.app` (v1–v4 at final state, v5 at round-2 state, v6 at rev A). **Netlify account credits are exhausted — no further deploys possible there.** Per the updated Section 2 these sites are dead weight; the consolidated local tree is canonical. `180dc-delft-rotterdam.netlify.app` (Pinterest privacy policy) stays untouched.

## Cloudflare reconciliation

- `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` present in `website/.env` — **probe succeeded 2026-07-10** (`wrangler whoami`: user token, account `f8bb61d2ed40826b1e8754c121973314`). Pages project `180dc-variants` created; consolidated tree deployed to production — **https://180dc-variants.pages.dev/ live**, subpaths and assets verified 200 (v1 pages/guide/fonts, v5 images). Deploys now via `tools/deploy-cf.ps1` (rebuilds dist, deploys `--branch main`).
- The `dcsystems` Worker noted in Section 2 was **not created by this build session** (this session never touched Cloudflare before the block). It is not the intended deploy target — the target is a **Pages** project `180dc-variants`, not a Worker. Decision: ignore `dcsystems`, do not delete.

## Consolidation plan (executed by `tools/build-dist.mjs`)

- Sources stay canonical in `website/variants/v<N>-<slug>/` (flat pages, `guide.html`).
- A build script assembles `website/variants/dist/` (gitignored): root gallery + `/v<N>-<slug>/` per variant, with `guide.html` relocated to `/v<N>-<slug>/guide/index.html` and links rewritten (`guide.html` → `guide/`; inside guide: `styles.css` → `../styles.css`, `index.html` → `../`, `for-clients.html` → `../for-clients.html`).
- Critique rounds run on local Playwright screenshots served from `dist/` over localhost (validates subpath links at the same time). Deploy the single consolidated tree only when a variant completes round 3.

## HANDOFF UPDATE — 2026-07-11 (context-window offload point)

Live site: **https://180dc-variants.pages.dev/** (gallery + all ten variants). Deploy via `tools/deploy-cf.ps1`. Local Critic screenshots: serve `dist/` with `npx http-server ..\dist -p 8123 -s` from tools/, shoot with `node shoot.mjs <outdir> <urls>`; Lighthouse locally with `node lh.mjs <urls>`. Critic = fresh general-purpose subagent per round: screenshots + one-line thesis only, ranked 5–10 concrete notes, fixes applied + logged in the variant's guide.

| Variant | Rounds done | State |
|---|---|---|
| v1–v5 | 3/3 each | FINAL, deployed, Lighthouse logged |
| v6-deck | 3/3 reports received | **Round-3 fixes NOT yet applied** — the report is logged verbatim below |
| v7-polder | 1/3 | Round-1 fixes applied + logged; needs deploy, rounds 2–3 |
| v8-courant | 1/3 | Round-1 fixes applied + logged; needs deploy, rounds 2–3 |
| v9-pamflet | 0/3 | Built; round-1 Critic died twice on session limits — screenshots ready at %TEMP%\claude\shots\v9r1 (stale-ok, reshoot if in doubt) |
| v10-ledger | 1/3 | Round-1 fixes applied + logged; round-2 Critic died twice — reshoot + rerun |

**V6 round-3 report (apply these, then V6 is final):** (1) mobile for-clients slide 6/6: submit button collides with the slide footer — add ~32px bottom margin below the form; (2) divider ghost numerals clip over the footer bar — clip to content area (overflow hidden wrapper excluding footer), uniform opacity; (3) agenda dot leaders lead nowhere — right-align slide numbers at the margin so leaders connect, suppress leaders <640px; (4) gantt: render wk0/wk1 as milestone diamonds, bars only for project + final, hairline gridlines at wk 3/6/9 (both pages); (5) team slide 11/11: widen name column (no name >2 lines), pin right-column CTA block to bottom; (6) for-clients slides 4–5 repeat the intro deck — compress six-areas to a one-line reference row, different exhibit than the repeated stamp; (7) hero door cards undersized — scale card stack to headline height, metadata wraps only on "·", nav filename truncate on underscore on mobile.

**After all rounds:** final Lighthouse pass (update each guide + the gallery table numbers + thumbnails via `node thumbs.mjs`), write `RECOMMENDATION.md` (ranked top 3 vs client/student/partner audiences per 01-brainstorm.md, + what to steal from non-winners), deploy, commit/push, report URL + spend (images: €0.00 this build; ledger stays ≈ €0.01 of €15).

**Separate workstream — branch-awards deck (LOCAL ONLY, gitignored):** `branch-awards/R2-deck-v2.pptx` (5 slides, 16:9) was regenerated from `build_deck.py` with all presenter feedback applied (slide 1 track-record bullet removed + "Sustainability:" category; slide 3 bulletproof number discs, chips → plain ✓ ACHIEVED / ↻ REBUILT text, alternating row bands; slide 4 spacing; slide 5 rebuilt — 7 clients, SDG names spelled out per row, "9" stat dropped). REMAINING: render slides to PNG (PowerPoint COM export; the old output pptx was file-locked = PowerPoint likely open), then run two eval agents — visual formatting QA per rendered slide (overlaps/clipping/alignment/spacing) and feedback-compliance + cross-slide number consistency + typos — apply findings, re-render, certify submission-ready.

## Remaining pipeline, in order

1. Restructure → dist; verify Cloudflare (`wrangler whoami`); create Pages project `180dc-variants`; initial deploy of the five completed variants + gallery stub.
2. v5 final Lighthouse → guide log.
3. v6-deck rounds 2–3 (local screenshots) → deploy on completion.
4. v10-ledger rounds 1–3 → deploy on completion.
5. Build v9-pamflet, v7-polder, v8-courant (per DIRECTIONS-6-10 order) → 3 rounds each → deploy on completion.
6. Root gallery (screenshot cards, Lighthouse scores, page weights, theses, comparison table) → `RECOMMENDATION.md` → commit/push → final report.

## Budget

OpenAI image spend this build: €0.00 (all imagery is Pexels photography or hand-built SVG/CSS; the only OpenAI cost remains the €0.01 pre-build test in the Section 2 ledger). Total: ≈ €0.01 of €15.
