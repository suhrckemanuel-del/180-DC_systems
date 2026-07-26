# Build spec — ROTTERDAM: "Nachtstad aan de Maas"

Binding spec for the Rotterdam explorable city game. Read these two research documents FIRST — they are part of this spec and contain the detail this file deliberately does not repeat:

- `../research/design-direction.md` — sections (a) craft principles, (b) Rotterdam, (d) UI, (e) avoid-list
- `../research/tech-functionality.md` — all sections; the Appendix constant sheet goes into `TUNE` verbatim

Deliverables (all in this directory):

- `index.html` — the game. One self-contained file, raw WebGL2, no libraries, no external requests, everything procedural. Metre scale (1 u = 1 m), ~700×700 m playable, deterministic from one seed.
- `verify.mjs` — the headless Node harness per tech report §5 (self-contained; stub GL + `window.__game` driving; checks W1–W6, C1–C2, G1, P1, S1).

## Conflict resolutions (these override the research docs where they differ)

1. **UI: design doc wins.** NO compass strip, NO minimap, NO "n/12" counter on fact cards, no persistent HUD of any kind. Wayfinding = distant landmark name labels (hero-demo callout language) + the Tab landmark-list panel (em-dashes for undiscovered). Discovery moment = the teal name + self-drawing hairline treatment. Fact cards: typography-only, brand chrome, 2–3 sentences, auto-dismiss.
2. **Time is frozen at late blue hour forever.** No day/night toggle, no clock. (The hourly bell from the tech report stays — Laurenskerk strikes the real hour.)
3. **No head-bob** (tech doc wins): sprint FOV kick + landing dip only.
4. **Fly mode** is included but gated behind discovering all landmarks ("Je kent de stad. — druk F om te vliegen"), plus always available via `window.__game.state` for verification.
5. **Scale**: 1 u = 1 m per tech doc §0 (the design doc's "1 unit = 4 m" note refers to the old hero demo — ignore it).

## Scope (build in this order, ship what's solid)

MUST — tech report §4.7 items 1–8, with this city's content. Then stretch goals in order: bicycle with bell (§4.2) → photo mode (§4.3) → 15 collectible miniature ships (§4.4). Do NOT start a stretch goal until everything before it passes `verify.mjs`.

## Rotterdam content (binding)

- **World**: Nieuwe Maas running through the map as the dominant diagonal; Kop van Zuid (De Rotterdam, Hotel New York quay) south bank; Centrum grid, Markthal + Cube Houses + Laurenskerk pocket, Witte Huis / Oude Haven pocket north bank; Erasmusbrug connecting them (walkable, its deck crest is the "summit"); De Hef upriver as pure silhouette; Euromast at the western edge; Luchtsingel yellow walkway threading the Centrum (walkable, elevated); crane ranks + container ship at the fog line.
- **Landmarks (11, discovery spine)**: Erasmusbrug, Euromast, Markthal, Kubuswoningen, De Rotterdam, Witte Huis, Laurenskerk, De Hef, Luchtsingel, Hotel New York, Wilhelminapier. Each: Dutch name, 2–3 sentence fact card (accurate, in the repo's plain confident voice), trigger radius per tech §4.1.
- **Vistas**: the six authored compositions in design doc §(b), realized as named places with sightlines protected by the street layout.
- **Light story**: "the city lights the water; the water lights the city" — exactly as specified: emissive-only apparent lighting, amber streetlight pools at ~25 m, reflection streaks on the Maas, Euromast beacon sweep, out-of-phase red crane tips. Palette: the hex ramps in design §(b), no hue outside them except Luchtsingel `#FFD23F`.
- **Moving life**: water taxis with V-wakes on timers, one slow container ship, flag/pennant flutter, occasional window toggles, two gulls. All slow.
- **Audio** (4-voice budget, tech §4.6): wind bed (harbor-forward, slightly stronger than Delft's), water lap near quays, Laurenskerk hourly bell, discovery chime. M mutes.
- **Water fall-in respawn line**: "De Nieuwe Maas is kouder dan hij eruitziet."

## Build discipline

- Write the file in sequential chunks (skeleton first, then append section by section) — never one giant write.
- Follow tech §3.9 file organization: TOC banner comments, one `TUNE` block, DATA-over-code, `window.__game` exposed.
- After every major section, run `node verify.mjs` (write the harness early — right after the world generators exist) and fix before proceeding.
- The grayscale test (design §(b)) and avoid-list §(e) are acceptance criteria, not suggestions.

## Report back

File paths, feature list actually shipped (MUST/stretch), verify.mjs final results (every check named, pass/fail), triangle/draw-call/VBO numbers, and known limitations.
