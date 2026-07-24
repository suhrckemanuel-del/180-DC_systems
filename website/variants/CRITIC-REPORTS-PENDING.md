# Pending Critic reports + state checkpoint (2026-07-16)

Builder subagents for V7–V10 died on the account session limit (resets 11:30pm Europe/Berlin) before editing anything. The four Critic reports below are the source of truth for the fixes to apply. Main session is applying them directly (re-spawning would hit the same limit). Delete this file once all four variants complete their pipeline.

## Status at checkpoint
- V1–V5: FINAL, deployed, Lighthouse logged.
- V6-deck: **FINAL** (round-3 fixes applied + logged, deployed 2026-07-16). Lighthouse: index 98/95/100/100 147KB, for-clients 99/100/100/100 139KB.
- V7-polder: round-2 Critic received (below). Fixes NOT yet applied.
- V8-courant: **round-2 fixes APPLIED + logged (2026-07-16)** — reserved photo well, masthead nowrap, mobile folio-bar scroll, classifieds one-frame/stack, clip-out coupon mobile rebuild, rule hierarchy, confident placeholder, house-ad jump line, rail differentiation. Verified. Needs round 3.
- V9-pamflet: **round-1 fixes APPLIED + logged (2026-07-16)** — edge-to-edge sheet, two-column manifesto/services, Gratis black bar (font bug fixed), hero scaled up, facts 4-up with €0 enlarged, manifesto orphans hand-broken, stamped form, type sizes raised. Verified. Needs rounds 2–3.
- V10-ledger: **round-2 fixes APPLIED + logged (2026-07-16)** — sticky+scroll-spy margin, mobile inline-expand, margin contrast to ink, team frames merged into 4×2 named grid, hero staged, ∅ struck rows, marker↔entry bond, for-clients form/changelog. Verified via screenshots. Still needs round 3 (fresh Critic, after reset).
- Branch-awards deck: rendered, both eval passes applied (visual QA + compliance), re-checked once. Three EVIDENCE blockers remain (board-only, not fixable here): (1) "3 clients re-engaged" vs 18 clients/21 projects arithmetic — confirm the 3 client/project pairs or drop to 2; (2) Greenhouse for the Future scope unconfirmed — if it collapses into The Green Table, "7 clients" → 6; consider swapping in Barefoot College International; (3) Climate Cleanup on slide 5 appears nowhere else in the deck — confirm it's a distinct client or the "7" drops. All logged in EVIDENCE-LEDGER.md / PROJECT-PROVENANCE.md. Design/formatting/compliance/typography: DONE and verified.

## Rounds still owed
- V9: rounds 1, 2, 3 (round-1 report below; 2–3 still to run)
- V10: rounds 2, 3 (round-2 report below; round 3 to run)
- V7: rounds 2, 3 (round-2 report below; round 3 to run)
- V8: rounds 2, 3 (round-2 report below; round 3 to run)

---

## V9-pamflet — round 1 (rank 3/10)
Thesis: Dutch protest-pamphlet brutalism — no images, enormous type, one green, hard rules, wheat-paste manifesto.
1. Dead right third on desktop — content pinned to ~820px left column on 1440. Kill max-width; display type to 64px margins both sides; THE WORK / WE BELIEVE as two-col grid (number+heading left, description right ~48ch) so rules span full sheet.
2. Index hero smaller than for-clients hero. Raise index hero so "DOING GOOD." touches both margins via per-line optical fitting.
3. Mobile hero catastrophic — ~34px, crammed above fold. Index hero ~13vw min (~50px), 3 lines owning first screen; push body + Gratis box below fold.
4. "Gratis. €0." in different typeface reads as a bug. Commit hard: full-width black bar reversed cream type, OR 96px same grotesk green in 6px black box, second-loudest object.
5. THE WORK (p1) vs THE FRONTS (p2) same list two ways. Adopt p2's ruled treatment on p1 incl. identical number column width.
6. Mobile manifesto orphans (3 of 4). text-wrap:balance on display h3 + hand-authored <br> for the four claims.
7. Type too small where voice lives. Eyebrows 13px/0.12em, nav 12px, NOG NIET box body 9→12px.
8. Contact form generic. Full-measure fields, no box, 4px black bottom rule per field, label 13px caps, input 24px grotesk, submit full-width black bar.
9. €0 stat orphans to its own row. Four-up with €0 last, set larger.
DO NOT BREAK: NOG NIET dashed placeholders; ENGINEERS. DESIGNERS. ECONOMISTS. (green on last); 4px black rules; SIGNED exec board block.

## V10-ledger — round 2 (rank 3/10)
Thesis: radical transparency as layout — every claim has a numbered evidence-margin entry (source/date/status), unverifiable lines struck as "cannot claim yet," footer is a public changelog.
1. Evidence margin quits after Account 02; entries stranded thousands of px from markers. Make margin position:sticky top:96px + scroll-spy (entering section's entries to top, rest dim 40%). Degrade w/o JS. NON-NEGOTIABLE.
2. Mobile dumps all citations into one bottom slab. Each superscript = tap target expanding its entry inline beneath its paragraph (2px left-rule mono, 180ms). Bottom slab becomes appendix.
3. Margin mono ~9–10px green on cream fails AA twice. Margin body 12.5px/1.5 IBM Plex Mono ink #1a1a1a; green only for E-labels + verified chips.
4. Account 02 excellent — DO NOT TOUCH. One nit: struck rows use "—" in value col; use light ∅ or empty cell.
5. Team frames wrecked by 7+1 wrap + anonymous while table sits below. 4x2 grid, name+office inside each frame under pending chip, delete duplicate table.
6. Colour discipline breaks between pages: "six lines of work" grey on index, green on for-clients (reads as link, borderline AA). Grey on both; green only for verified/evidence semantics.
7. for-clients changelog wraps into 60px sliver. Match ledger page: date col 96px, text fills remainder.
8. Hero not staged (~44px, only 1.5x h2). Hero ~64px/1.05, break "A consultancy that shows its receipts," / "starting with this page."; run E1/E2 into margin level with hero + hairline leader rule.
9. No marker↔entry bond. Hover/focus [E4] → entry gets 2px green left rule + paper warms 4%; hover entry → marker inverts. 120ms, no movement.
10. Account 01 intro has measles (6 superscripts/4 lines). Cap 2 markers/para in intro, clause-ends only.
11. for-clients form half-width. Inputs full column, name/org 2-up. Keep honest preview note.

## V7-polder — round 2 (rank 3/10)
Thesis: Dutch polder as design system — horizontal strata (sky/dike/field/water), NAP datum line annotating elevation, parcel-strip grids, quality system drawn as the pump.
1. NAP datum line doesn't exist (just a costumed section eyebrow). Persistent fixed left-gutter gauge (28–36px, full-height), ticks every 0.20m, labelled indicator sliding on scroll. Eyebrows become short flags anchored to gauge. Degrade w/o JS.
2. Value ramp inverts at top — near-black ±0.00 sits above lighter bands, breaking the descent. "What we are" → mid-tone; strictly monotonic luminance ramp top→bottom; emphasis from rule weight/type scale not value.
3. Three near-identical sages read as banding. Step tied to metric — 1 visible step per 0.30m, min ~10% luminance between bands; cut palette to ~6.
4. Pump is a postage stamp (1/3 of thesis). Make it the full-bleed structure of that section — copy sits inside the machine, labels 11px mono min. for-clients pump section has no drawing — add one.
5. Hero image is a sidebar. Hero IS the cross-section, full width: sky+headline at +1.20, dike crown at datum, sub-copy+buttons below on field at −2.0m, water table hatched right.
6. Mobile inverts the parcels (vertical strips → horizontal cards) under the sentence explaining strips. Horizontal-scroll rail, ~62% vw per parcel so 02 peeks; parcel numbers pinned on top edge rule. Fix nav wrap.
7. Parcel stagger reads as misalignment. Either flush-top all six with rhythm in strip FILLS (alternating tint), or draw a faint diagonal baseline rule labelled in cm.
8. Mono labels below AA everywhere (~10px mid-green on pale). 11px min, 0.08em, darkened green clearing 4.5:1 on every bg (one token). Honesty-tag hatch to 6% behind text or inset on solid plate.
9. Eight empty squares read as broken images. Fill with hatch + mono "PLOT RESERVED" matching honesty-tag device.
DO NOT BREAK: footer payoff (NAP −6.76M … STILL DRY. THAT'S THE WHOLE IDEA.); amber hatched "not yet reclaimed" tags (fix contrast, keep idea); stat row — nit: "1st" label wraps to two lines, set one line.

## V8-courant — round 2 (rank 3/10)
Thesis: Dutch broadsheet front page — masthead, column rules, serif headlines w/ decks+bylines, captioned photos, recruitment as classifieds, honesty rules as editorial colophon.
HONESTY CONSTRAINT: no stock photos as team/work. For note 1, print a reserved photo-well with real caption, visibly a placeholder — NOT a stock photo.
1. Zero photographs (thesis promises captioned photos). Add a designed, correctly-proportioned reserved photo well (2-col under lead headline, 1-col in classifieds) with real editorial caption marked awaiting the shoot — confident element, not a dev-stub.
2. Three "awaiting copy" boxes read as unfinished. Reduce to ONE per page; solid hairline box, bold green standing head (— NOG NIET GEDRUKT), body at surrounding size/colour not olive-11px.
3. Mobile masthead wraps to two lines. white-space:nowrap + clamp(1.75rem,11vw,5rem).
4. Mobile nav = 4 stacked centred lines. Horizontal scrolling folio strip, hairline above/below, 10px caps, · separators, active underlined.
5. Mobile classifieds two-col at 390px (~20ch, unreadable). One column below 640px, 3px rule between, keep boxed frames.
6. Mobile clip-out form destroyed. Full-width single column below 720px, intro above coupon. Keep dashed cut-line + ✂.
7. Rule weights uniformly 1px — no pacing. 3-weight system: 3px below masthead + above Kleine advertenties; 1px between stories; 0.5px in tables/boxes; 1 vertical column rule between classifieds pair.
8. "READ KATERN 2" is a web button. Make it a boxed house ad / "TURN TO KATERN 2 →" jump line in the paper's serif. Same for POST THE LETTER.
9. Op-Ed headline orphans "gaps"; rail is 5 identical boxes. text-wrap:balance + tighter width → "Why we print / our gaps". Rail differentiated by kind: De Koersen boxed stat, Op-Ed unboxed w/ thick rule above, Redactie plain ruled list, Colophon black panel as only inverted element.
DO NOT BREAK: justified 3-col body w/ hyphenation; green drop cap; ✂ KNIP UIT coupon (protect on mobile); black colophon panel w/ red ✗ (give more room); Dienstregeling table.
