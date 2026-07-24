# Golden set — the four variants under real client evaluation

**Weekend entry point (2026-07-24).** This is the doc to read first when picking the website work back up. It ties together the four "golden set" variants the branch will A/B and human-label this semester, what state they're in, and what's next.

## The four golden-set variants
The branch is choosing between (and human-labeling) these four, not all eleven. The other seven stay as parents/reference.

| # | Variant | Thesis | Live |
|---|---|---|---|
| V2 | **Port** | Industrial / harbour — container geometry, manifest tables, crane silhouettes | [/v2-port/](https://180dc-variants.pages.dev/v2-port/) |
| V3 | **De Stijl** | Dutch modernist — Mondrian grids, primary planes, the black line as the design | [/v3-destijl/](https://180dc-variants.pages.dev/v3-destijl/) |
| V7 | **Polder** | Landscape strata — NAP datum descent, parcels, the quality system as the pump | [/v7-polder/](https://180dc-variants.pages.dev/v7-polder/) |
| V11 | **Lumen** | Clean institutional clarity — white-dominant, one green accent, the calm register of a university consultancy society (Imperial College Union's consultancy page was the reference, not the template) | [/v11-lumen/](https://180dc-variants.pages.dev/v11-lumen/) |

All four are **born correct on the 2026-07-23 client rebrand** (V2/V3/V7 were retrofitted; V11 was built already-correct):
- Verified 180DC green `#78B038` / AA-safe `#4A7322` — never the invented pine-green.
- Real globe logo + branch lockup; green favicons.
- "Uniquely affordable / low-cost" everywhere — no "pro bono / €0 / free".
- Project Manager (not Team Leader); Branch President / Branch Vice-President.
- Mission + dedicated Our Work sections; two real consulting cycles (Oct–Jan, Mar–Jun); recruitment windows (Sept, Jan/Feb); both roles described; one-click "Work with us" → booking form.
- Every gap is a visible honest placeholder (no invented clients/numbers/photos/logos).

Ground truth: [`_brand/BRAND.md`](_brand/BRAND.md). Shared copy spec (forked from `content.md`, which is unchanged and still canonical for the other seven variants): [`content-v2v3v7.md`](content-v2v3v7.md).

## How to verify / work on them
- **Automated gate:** `node tools/eval-v2v3v7.mjs` — checks terminology, brand green, logo/favicon, IA sections, CTA routing, cycles, recruitment windows, and the full honesty-placeholder register across all four. Must be **0 FAIL** before deploy. (Currently 0 FAIL / 0 WARN.)
- **Mobile overflow:** `node tools/check-overflow.mjs <urls>` — asserts no horizontal scroll at 390px.
- **Screenshots:** `node tools/shoot.mjs <outdir> <urls>` (desktop 1440 + mobile 390); element clips via `tools/clip-mobile.mjs`.
- **Rubric:** [`EVAL-RUBRIC.md`](EVAL-RUBRIC.md) — the functionality / mobile / cleanness / AI-slop scoring used for the human-facing review.
- **Local preview:** `node tools/build-dist.mjs` then `npx http-server ../dist -p 8123 -s`; visit `/v{2,3,7,11}-…/`.
- **Deploy:** `tools/deploy-cf.ps1` → https://180dc-variants.pages.dev/ (never commit `website/.env`).

## What's next (the to-do list)
1. **Human labeling of the golden set.** These four are the ones to put in front of labelers / the President for a real preference read. (Ties into the reviewer-v2 golden-set labeling workstream under `tools/quality-reviewer/v2/`.)
2. **Critic rounds.** V11 has had **zero** Critic rounds; V2/V3/V7 completed rounds before the rebrand but their content changed substantially, so they deserve a fresh round too. Standard pipeline in [`RESUME-STATE.md`](RESUME-STATE.md) / [`CRITIC-REPORTS-PENDING.md`](CRITIC-REPORTS-PENDING.md).
3. **Gallery card + Lighthouse for V11.** The root gallery (`gallery/index.html`) and `tools/thumbs.mjs` don't yet include V11 — add a card + thumbnail + Lighthouse numbers when the Critic pipeline runs.
4. **Resolve the shared blockers** (below).

## Shared blockers (flagged, not resolved — need a human)
1. **Monday.com roster confirmation.** The `monday` MCP needs interactive OAuth (`/mcp` or `claude mcp`), which isn't available in a non-interactive session. All four variants show the live-page roster snapshot with a visible "pending confirmation against Monday.com" flag. Confirm the board on Monday, then drop the flag.
2. **"First multi-city branch" sign-off.** Confirmed verbatim on 180dc.org today and kept as-is; a one-line confirmation from Stefan Kluwer (Branch President) is recommended before treating it as fully final for a formal deck/site.
3. **Real content** for the reserved slots: case studies (with consent), team photos, member testimonials, partner logos, live form backend, and the recruitment/events portal links.
