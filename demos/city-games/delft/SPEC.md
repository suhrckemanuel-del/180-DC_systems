# Build spec — DELFT: "Ochtendlicht"

Binding spec for the Delft explorable city game. Read these two research documents FIRST — they are part of this spec and contain the detail this file deliberately does not repeat:

- `../research/design-direction.md` — sections (a) craft principles, (c) Delft, (d) UI, (e) avoid-list
- `../research/tech-functionality.md` — all sections; the Appendix constant sheet goes into `TUNE` verbatim

Deliverables (all in this directory):

- `index.html` — the game. One self-contained file, raw WebGL2, no libraries, no external requests, everything procedural. Metre scale (1 u = 1 m), ~700×700 m playable, deterministic from one seed.
- `verify.mjs` — the headless Node harness per tech report §5 (self-contained; stub GL + `window.__game` driving; checks W1–W6, C1–C2, G1, P1, S1).

## Conflict resolutions (these override the research docs where they differ)

1. **UI: design doc wins.** NO compass strip, NO minimap, NO "n/12" counter on fact cards, no persistent HUD of any kind. Wayfinding = distant landmark name labels (hero-demo callout language) + the Tab landmark-list panel (em-dashes for undiscovered). Discovery moment = the teal name + self-drawing hairline treatment. Fact cards: typography-only, brand chrome, 2–3 sentences, auto-dismiss.
2. **Time is frozen at ~8 a.m. Vermeer morning forever.** No day/night toggle, no clock. (The hourly bell stays — the Nieuwe Kerk strikes the real hour with its 4-note chime + strikes.)
3. **No head-bob** (tech doc wins): sprint FOV kick + landing dip only.
4. **Fly mode** is included but gated behind discovering all landmarks ("Je kent de stad. — druk F om te vliegen"), plus always available via `window.__game.state` for verification.
5. **Scale**: 1 u = 1 m per tech doc §0 (the design doc's "1 unit = 4 m" note refers to the old hero demo — ignore it).

## Scope (build in this order, ship what's solid)

MUST — tech report §4.7 items 1–8, with this city's content. Then stretch goals in order: bicycle with bell (§4.2 — in Delft this is the highest-value stretch, prioritize it) → photo mode (§4.3) → 15 collectible hidden Delft Blue tiles (§4.4). Do NOT start a stretch goal until everything before it passes `verify.mjs`.

## Delft content (binding)

- **World**: the historic canal grid — Oude Delft and a second canal axis with cross-canals, humped brick + white wooden bridges (each crest a micro-vista); the Markt with Nieuwe Kerk at one end, Stadhuis facing it, market stalls with cobalt awnings; Oude Kerk leaning honestly (~4°) over its canal; the Kolk basin + southern water gate area composing the *View of Delft* vista; Oostpoort at the far edge; Molen de Roos on the western rim; one hidden hofje behind an unassuming door off Oude Delft (the secret room — no signage, ever); polder light beyond the rim.
- **Landmarks (11, discovery spine)**: Nieuwe Kerk, Oude Kerk, Stadhuis, Markt, Oostpoort, Molen de Roos, Gezicht op Delft (the vista itself), Vermeer Centrum corner, Prinsenhof, the hofje, Oude Delft canal. Each: Dutch name, 2–3 sentence fact card (accurate, plain confident voice), trigger radius per tech §4.1. The hofje's card celebrates the find.
- **Vistas**: the six authored compositions in design doc §(c); "Gezicht op Delft" aligns with the painting's composition and titles itself when it does.
- **Light story**: "traveling sunlight under moving clouds" — one warm SE sun, long shadows, 2–3 procedural cloud shadows (~80–150 m, ~1.5 m/s drift) cooling and releasing streets; sun glitter on canals only inside sunlit patches; windows reflective, never emissive — except the single bakery window. Palette: the hex ramps in design §(c); world accent is Delft-Blue cobalt, UI accent stays brand teal.
- **Moving life**: cloud shadows (the protagonist), canal mist burning off, one puttering sloop breaking reflections, windmill sails, laundry line, cat tail-flick, heron, sparrows in the hofje, swinging bell silhouettes in the belfry. All slow.
- **Audio** (4-voice budget, tech §4.6): soft wind bed, water lap along canals, Nieuwe Kerk hourly chime + strikes, discovery chime. M mutes.
- **Water fall-in respawn line**: "Het grachtenwater is kouder dan het eruitziet."

## Build discipline

- Write the file in sequential chunks (skeleton first, then append section by section) — never one giant write.
- Follow tech §3.9 file organization: TOC banner comments, one `TUNE` block, DATA-over-code, `window.__game` exposed.
- After every major section, run `node verify.mjs` (write the harness early — right after the world generators exist) and fix before proceeding.
- The grayscale test (design §(c)) and avoid-list §(e) are acceptance criteria, not suggestions. The key grayscale check: sunlit Nieuwe Kerk tower is the brightest built thing in any frame containing it.

## Report back

File paths, feature list actually shipped (MUST/stretch), verify.mjs final results (every check named, pass/fail), triangle/draw-call/VBO numbers, and known limitations.
