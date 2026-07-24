# Eval Rubric — V2/V3/V7 rebrand pass

Two layers. **Layer A** is automated (`tools/eval-v2v3v7.mjs`) and must pass (0 FAIL) before deploy. **Layer B** is a screenshot review (desktop + mobile) scoring the four things the client cares about: functionality, mobile use, overall cleanness, and absence of AI slop. Run Layer B per variant on `dist/` served locally.

## Layer A — automated (run: `node tools/eval-v2v3v7.mjs`)
Covers, per variant: terminology compliance (no pro bono/free/€0/team lead/Vice President), approved cost language present, brand green `#78B038`/`#4A7322` swapped in (no invented pine-green left), globe logo + a lockup referenced, favicon not orange + brand-green, Mission + Our Work sections present, `#join`/`#team`/`#partners` anchors, primary CTA → `for-clients.html#intake` with the `#intake` target existing, both consulting cycles stated + no generic week framing, both recruitment windows, the full honesty placeholder register, no broken in-page anchors, all `<img>` have alt. **Gate: 0 FAIL.** WARNs are read and judged.

## Layer B — screenshot review (desktop 1440px + mobile 390px)
Score each dimension 1–5; a variant ships at **≥4 on every dimension** or gets one fix loop.

### B1. Functionality
- [ ] Every nav item scrolls/links to a real target; three doors go to the right places.
- [ ] "Work with us" lands **directly on the booking form** (one click, no extra scroll).
- [ ] Intake form renders with all fields + label association; submit is inert (placeholder note visible).
- [ ] All internal links (for-clients, guide, index anchors) resolve in the served `dist/` tree.
- [ ] No console errors; logo/lockup images actually load (not broken).

### B2. Mobile use (390px viewport)
- [ ] No horizontal scroll / body overflow.
- [ ] Nav is usable (wraps or collapses; tap targets ≥ ~40px).
- [ ] Hero headline doesn't clip or overlap; lockup scales down.
- [ ] Tables/manifests/parcel grids reflow to one column, not squashed.
- [ ] Board portrait slots + case cards stack cleanly; no text overlapping frames.
- [ ] Form fields are full-width and comfortably tappable.

### B3. Overall cleanness (the client's "reduce clutter")
- [ ] A first-time visitor can tell in <5s where to go for **who we are/what we do**, **apply**, **get a project**.
- [ ] Generous white space; brand green reads as accent, not a wall of saturated colour.
- [ ] Section rhythm is clear; headings are legible; nothing competes for the eye at once.
- [ ] Decorative codes/jargon are muted, not shouting over the content.
- [ ] Consistent spacing/type scale; no orphaned or doubled placeholders.

### B4. AI-slop removal (copy quality)
- [ ] No empty hype ("cutting-edge", "leverage synergies", "unlock", "in today's fast-paced world", "we are thrilled/excited to").
- [ ] No hollow tricolons or padding; every sentence carries a fact or a concrete promise.
- [ ] No em-dash-itis / uniform rhythm; varied, human sentence lengths.
- [ ] Placeholders read as honest reservations, not fake content.
- [ ] Nothing invented: no fake clients, numbers, photos, testimonials, or logos.
- [ ] Terminology is on-brand (affordable not free; Project Manager not team lead; Branch President/Vice-President).

## Verdict format (per variant)
`V<N>: A=<pass/fail, #FAIL #WARN> · B1 B2 B3 B4 scores · top issues · ship / one-fix-loop`

## Results — 2026-07-24 (rebrand pass)

**Layer A** (`node tools/eval-v2v3v7.mjs`): **0 FAIL, 0 WARN across all three variants.** Terminology, brand green, logo/favicon, IA sections, CTA routing, cycles, recruitment windows, and the full placeholder register all verified clean by the automated pass.

**Extra automated check** (`node tools/check-overflow.mjs`, all 6 pages at 390px): **zero horizontal overflow** — including V7's Our Work section, which uses `grid-column: span 2` on a grid that collapses to one column at the mobile breakpoint (the highest-risk layout in this pass); it reflows cleanly with no clipping.

**Layer B** (screenshot review, desktop 1440px + mobile 390px, `tools/shoot.mjs` + `tools/clip-mobile.mjs`), all six pages:

| Variant | B1 Functionality | B2 Mobile | B3 Cleanness | B4 AI-slop | Verdict |
|---|---|---|---|---|---|
| V2 Port | 5 — nav, doors, CTA→#intake, form all correct | 5 — crew/work/role grids reflow to 1-col cleanly, no overlap | 4 — generous white space now vs. the old saturated cargo blocks; container-code chrome still present but muted | 5 — no hype language, placeholders read as honest reservations | **ship** |
| V3 De Stijl | 5 — same | 5 — Mondrian cells stack cleanly, portrait squares hold their aspect ratio | 5 — white-dominant now, De Stijl discipline intact, best signal-to-noise of the three | 5 | **ship** |
| V7 Polder | 5 — same | 5 — parcels/stages/board all reflow, `span 2` case cards verified non-overflowing | 4 — NAP-band descent adds inherent visual density; Join+Partners sharing one band tone got a divider rule to keep them legible as separate sections | 5 | **ship** |

**V11 Lumen (added 2026-07-24, golden-set addition):** clean-institutional variant built already-correct on the rebrand spec. Layer A: **0 FAIL, 0 WARN** (eval extended to cover it). Overflow: clean at 390px on both pages. Layer B: B1 5 (nav/CTA/form correct, one-click to booking), B2 5 (cards/roster/timeline stack cleanly, nav scroll-row on mobile), B3 5 (white-dominant, one green accent, highest clarity of the set — the whole point of the variant), B4 5 (no hype, honest placeholders, on-brand terminology). **Ship.** Still owes standard Critic rounds (has had none).

No one-fix loops triggered — all four cleared ≥4 on every dimension on first pass. One a11y nit caught in review and fixed immediately: V3 and V7 both had `aria-current="page"` on the `#mission` nav link, which is meant for distinguishing separate pages, not a same-page anchor — removed from both. One pre-existing, out-of-scope item left untouched: V7's guide.html still references a `.stratum--sky2` CSS class dropped in an earlier (pre-rebrand) round — cosmetic only, confined to the guide, not part of this pass.
