# Tech & Functionality Report — Walkable 3D City Games (Rotterdam, Delft)

**Audience:** the code-generation model that will build each game as one self-contained HTML file, raw WebGL, no libraries, no assets, all procedural.
**Baseline:** `/home/user/180-DC_systems/demos/3d-city-hero/index.html` — ~19.7k tris, 13 draw calls, everything drawn every frame, camera-on-rails + orbit, 1 unit = 4 m, seeded RNG (`mulberry32`), one uber-shader for solids, interleaved VBO uploaded once. That architecture is the right seed. This report says exactly what changes to make it a *game you move around in* at 10–15x geometry scale.

Every section ends in a decision. Constants are given in real units and are known-good starting points, not placeholders.

---

## 0. Ground rules that change from the hero demo

1. **Switch to 1 unit = 1 metre.** The hero demo uses 1 u = 4 m, which is fine for a flythrough but miserable for a character controller (every speed, radius, and step height becomes a weird fraction). Rebuild the city generators at metre scale. Depth precision is fine: near 0.1, far 900, 24-bit depth.
2. **Require WebGL2.** Support is effectively universal (Safari has had it since 15.0, 2021). WebGL2 gives you VAOs, instancing, and `#version 300 es` for free. Fallback: the same styled static-hero fallback the demo already has, with copy "This game needs WebGL2." Do **not** maintain a dual WebGL1 path — it doubles surface area for zero real users. (`ANGLE_instanced_arrays` is mentioned in §3 only as trivia; don't build it.)
3. **One honest city per file.** No inter-city compression tricks. Rotterdam file: the Kop van Zuid / Erasmusbrug / Maas axis plus a Centrum grid. Delft file: the canal grid around Markt, Oude/Nieuwe Kerk, Oostpoort, a windmill at the edge. Playable area target: roughly **700 × 700 m** of dense city with a fog-faded rim. That is a real "walking simulator" scale (3–4 minutes to cross at walk speed) and stays inside the triangle budget.
4. **Deterministic world.** Keep the single-seed `mulberry32` pattern. One `const SEED = ...` at the top; the entire world (geometry, collectible placement, boat routes) derives from it. This is what makes headless verification (§5) possible.

---

## 1. Movement & Controls

### 1.1 Decision: one primary scheme per platform

| Platform | Primary | Fallback |
|---|---|---|
| Desktop mouse+kb | **First-person, Pointer Lock mouse-look, WASD** | Drag-to-look (no lock) if lock denied/unavailable |
| Touch (phone/tablet) | **First-person, left dynamic virtual joystick + right-side look-drag** | — (this *is* the scheme; no pointer lock exists on iOS) |
| Gamepad | Left stick move / right stick look, auto-detected, overlays kb+mouse | — |

First-person is the primary camera everywhere. Third-person is **not** in v1 for walking (it forces camera-vs-building collision, a whole second problem). The bicycle (§4) may use a chase camera as a *should*, with the cheap clamp described in §1.7.

### 1.2 Pointer Lock — exact usage and every gotcha

```js
canvas.addEventListener('click', () => {
  if (document.pointerLockElement === canvas) return;
  let p;
  try { p = canvas.requestPointerLock({ unadjustedMovement: true }); }
  catch (e) { p = canvas.requestPointerLock(); }        // Safari: options object throws
  if (p && p.catch) p.catch(() => canvas.requestPointerLock()); // Chrome: unadjusted unsupported on some platforms → retry plain
});
document.addEventListener('pointerlockchange', () => {
  locked = (document.pointerLockElement === canvas);
  showResumeOverlay(!locked);
});
document.addEventListener('pointerlockerror', () => enableDragLookFallback());
```

Gotchas the builder must handle, each one a real bug otherwise:

- **User-gesture requirement.** `requestPointerLock()` only works inside a click/keydown handler. Make the start overlay ("Click to explore") the gesture — it also unlocks the AudioContext (§4.6) in the same handler.
- **Escape + re-lock cooldown.** Esc exits the lock; Chrome then enforces a ~1.25 s cooldown and requires a *new* gesture before re-lock. So: on `pointerlockchange` → unlocked, pause the game (dim + "Click to resume"), and only re-request on the next click. Never auto-re-request — it throws/errors and can permanently confuse your state machine.
- **`unadjustedMovement: true`** disables OS mouse acceleration — noticeably better aim feel. Chrome/Edge support it; Safari throws on the options object, hence the try/catch above.
- **movementX/Y spikes.** Some platforms deliver a huge bogus delta on the first event after locking. Clamp: `if (Math.abs(e.movementX) > 200 || Math.abs(e.movementY) > 200) return;` and also ignore the first mousemove after each lock.
- **iframes.** If the game may ever be embedded: the embedding iframe needs `allow="pointer-lock; fullscreen"`, and a sandboxed iframe needs `allow-pointer-lock` in `sandbox`. Note this in a comment at the top of the file.
- **iOS/iPadOS: no pointer lock, period.** Feature-detect with `('onpointerlockchange' in document)` *and* treat `matchMedia('(pointer: coarse)').matches` as "use touch scheme". Don't user-agent sniff.
- **Fallback drag-look:** if lock errors or is unavailable on desktop, fall back to press-drag rotates view (sensitivity ~2.5× the locked value since drags are short). The game must remain fully playable this way.

### 1.3 Look constants

- Sensitivity: **0.0023 rad per movement count** (yaw and pitch). Expose ×0.5–×2 in the help overlay if you add any settings at all; otherwise this default is broadly right.
- Pitch clamp: **±1.55 rad (±88.8°)** — never ±90°, the lookAt basis degenerates.
- No smoothing/inertia on mouse look. Raw deltas. Smoothed mouse-look feels drunk.
- Vertical FOV **62°**, and on narrow (portrait) aspects widen so horizontal FOV ≥ 78°: `fovY = max(62°, 2*atan(tan(39°)/aspect))`. Sprint adds +5° FOV, lerped at 8/s. FOV kick is the cheap speed cue that replaces head-bob.

### 1.4 Ground movement feel — exact model

Velocity is 2D (XZ); vertical is handled by the ground solver (§2.3). Frame-rate-independent exponential approach, no allocation:

```js
// inputs: wishX,wishZ = normalized input dir in world space (0 if no input)
const WALK = 4.3, SPRINT = 7.5;          // m/s  (real walk is 1.4; games need ~3x)
const ACCEL_K = 12.0, DECEL_K = 9.0;     // 1/s  — higher = snappier
const targetV = speed * wish;            // speed = sprint? SPRINT : WALK
const k = (wishLen > 0) ? ACCEL_K : DECEL_K;
const a = 1 - Math.exp(-k * dt);
vx += (targetVx - vx) * a;
vz += (targetVz - vz) * a;
```

- With `k=12`, you reach ~95% of walk speed in 0.25 s — responsive but with perceptible weight. This is the single most important feel constant; do not use raw `pos += input * speed * dt` (feels like a ghost) and do not go below k≈8 (feels like ice).
- **Eye height 1.65 m** above ground. On stairs/ramps, smooth the *camera* y toward the solver's ground y at `1 - exp(-14*dt)` so steps don't thump.
- **Head-bob: no.** It's the most commonly disabled setting in the genre and reads as amateur when procedural. The sprint-FOV kick + a very subtle landing dip (camera y −0.08 m recovering over 0.25 s when a fall > 1 m ends) give all the physicality needed.
- Sprint: hold **Shift**. No stamina. Stamina is friction with zero payoff in a sightseeing game.
- Jump: **omit**. Step-up (§2.3) handles kerbs and stairs; jump adds air-control tuning and collision edge cases for nothing. Reserve Space for the boat/bike dismount or nothing.
- **Fly mode: include, cheap and load-bearing.** Toggle **F** (double-jump-style double-tap not needed). Fly = same accel model in 3D at 18 m/s (55 with Shift), collision off, gravity off. It costs ~30 lines, is a delightful "could" feature for players, and is *essential* for you and for verification (screenshot any spot, escape any collision bug). Show a small "FLY" HUD tag.

### 1.5 Touch controls (the primary mobile scheme)

- **Left half of screen = dynamic joystick.** On touchstart, the origin is where the thumb lands; stick vector = clamp(touch − origin, radius 48 px)/48. Below 0.25 deflection → dead. Full deflection = walk; there is **no separate sprint on touch** — instead, >0.95 deflection held for 1 s ramps to sprint speed (auto-sprint). Draw the stick as two translucent circles (base 48 px, nub 22 px) only while touched.
- **Right half = look.** Delta-based: `yaw += dx * 0.0060; pitch -= dy * 0.0060` (rad/px — roughly 2.6× mouse because thumbs travel less). Track touches by `identifier`; both halves must work simultaneously (test: move + look at once).
- Interaction: a round on-screen button (bottom-right, 64 px) appears contextually ("Read", "Ring bell", "Board"), same trigger as desktop **E**.
- `touch-action: none` on the canvas and `e.preventDefault()` in handlers (with `{passive:false}`) or the page will scroll/zoom. Also set `overscroll-behavior: none` on body.
- DPR and fillrate rules for mobile in §3.6 are what actually make this playable.

### 1.6 Gamepad (bonus tier, ~60 lines)

Poll `navigator.getGamepads()` every frame once a `gamepadconnected` event has fired (the event itself requires the user to press a button — fine). Mapping (`gamepad.mapping === 'standard'`): axes 0/1 move, 2/3 look; radial deadzone 0.15 then rescale; response curve `v*|v|` on look; max look rate 2.6 rad/s yaw, 1.7 rad/s pitch; button 0 = interact, button 10/press-L3 or button 4 = sprint, button 3 = fly. Gamepad input just *adds into* the same wish/look variables — no separate mode.

### 1.7 Bicycle & boat control (see §4 for scoping)

- **Bicycle = a movement mode, not a vehicle sim.** Same controller with: max 9.5 m/s, ACCEL_K 2.5 (slow ramp), DECEL_K 1.2 coasting / 6 braking (S), yaw rate limited to `1.8/(1+speed*0.12)` rad/s so it carves instead of pivoting, camera roll = `-yawRate*speed*0.02` clamped ±0.12 rad (lean), collision radius unchanged. First-person with handlebars implied by lean + speed lines is fine; if you do the chase cam: boom 6 m back / 2.2 m up, spring `1-exp(-6dt)`, and clamp the boom against building AABBs by shortening it (no smooth occlusion logic).
- **Boat = a ride, not a vehicle.** Player boards, boat follows a Catmull-Rom spline along canals at 3 m/s, player can look around freely, E to disembark at marked stops. Zero new physics.

---

## 2. Collision & World Interaction

### 2.1 Decision: 2D solver — circle vs. AABB grid, plus a height-patch ground query

The city is 2.5D: vertical structure exists (bridges over water, quays above canals) but no true overhangs the player walks *inside*. So: **do not raycast for movement, do not do 3D collision.** Two orthogonal systems:

1. **Wall solver (XZ plane):** player = circle, radius **0.35 m**, vs. static 2D shapes in a uniform grid.
2. **Ground solver (Y):** analytic query `groundAt(x, z)` over "height patches", giving floor height + surface type.

### 2.2 Wall solver — data structure and resolution

```js
// Built once at generation time, from the same data that builds the meshes.
const COL = {
  cell: 8,                 // metres; world 700x700 → 88x88 grid
  x0: -350, z0: -350, nx: 88, nz: 88,
  grid: [],                // grid[iz*nx+ix] = Uint16Array of shape indices (or [] )
  boxes: [],               // {x0,z0,x1,z1}          — buildings, quay walls, fences
  discs: [],               // {x,z,r}                — trees, lampposts, bollards, statues
  obbs:  [],               // {x,z,hx,hz,cos,sin}    — the few rotated buildings; keep < 30 total
};
```

- **Generate colliders and meshes from the same source records.** Every `canalHouse(...)`-style builder returns/registers its footprint into `COL` as it emits triangles. Never hand-author colliders separately — they will drift.
- A shape is inserted into every cell its bounds (inflated by player radius, 0.35) touches. Memory is trivial.
- Resolution per frame (after integrating velocity):

```js
// 2 iterations is enough; 3 is bulletproof.
for (let iter = 0; iter < 2; iter++) {
  for (shape of shapesInCellsAround(px, pz)) {         // 3x3 cell neighborhood
    // AABB: closest point clamp
    const cx = clamp(px, b.x0, b.x1), cz = clamp(pz, b.z0, b.z1);
    let dx = px - cx, dz = pz - cz, d2 = dx*dx + dz*dz;
    if (d2 < R*R) {
      if (d2 > 1e-9) { const d = Math.sqrt(d2), push = (R - d)/d; px += dx*push; pz += dz*push; }
      else { /* center inside box: push out along axis of least penetration */ }
    }
    // disc: same but vs. point; OBB: rotate player into box space, do AABB case, rotate back
  }
}
```

- Sliding along walls falls out of closest-point pushout automatically — no velocity projection needed for feel, but after resolution do `v -= n*(v·n)` for the last contact normal so you don't "pump" into walls (kills the vibration at inside corners).
- The "center inside box" branch **must** exist (least-penetration axis pushout). It's the classic escape-hatch for teleports/spawns; the fuzz test in §5 will find it if missing.

### 2.3 Ground solver — height patches

```js
// Same grid indexing as COL (reuse the grid, second index list per cell).
patches: [
  // rect + flat height:
  { x0,z0,x1,z1, y: 0.0,  kind: GROUND },     // street level
  { x0,z0,x1,z1, y: -1.7, kind: WATERBED },   // canal bed (under water y = -0.4 surface)
  // ramp: height varies linearly along one axis (bridges, stairs, quay ramps):
  { x0,z0,x1,z1, y0: 0.0, y1: 3.2, axis: 'x', kind: BRIDGE },
  // arc bridges: still a ramp pair (up-ramp + down-ramp) — do NOT store curves; two
  // linear patches under an arced visual deck read fine at these spans.
]
```

Query: from the patches in the player's cell, pick the **highest patch whose height ≤ feet + STEP_UP (0.45 m)**. That one rule gives you: walking onto bridges (deck patch wins), walking *under* the same bridge (deck is > feet+0.45, street patch wins), kerbs and stairs (each flight is one ramp patch; model steps visually, collide as ramp), quays (street patch ends at quay edge; beyond it only the canal-bed patch exists → you fall).

Vertical motion: if `groundY` is within step-up below/above feet → move `py` toward it critically-damped (`1-exp(-16dt)`); else you're airborne: `vy -= 22*dt` (gravity slightly above 9.8 — feels right at game scale), land when crossing the patch.

### 2.4 Water: decision — let them fall in, respawn kindly

**Do not fence the water with invisible walls.** Blocking feels dead and Dutch cities are *made* of edges over water. Instead:

- Quay edges get *visual* affordances (bollards, railings on some stretches — which are real colliders where present).
- Falling past water surface (`py < waterY + 0.2` while over a WATERBED patch): splash particle burst + low-pass filter sweep on the audio bus, screen fades over 0.9 s, respawn at the nearest of a precomputed list of **respawn points** (every bridge end and quay stair, ~30 per city), fade back in. Total ~2 s, no penalty text beyond a gentle line ("The Nieuwe Maas is colder than it looks").
- This doubles as the universal bug net: `if (py < -10 || !isFinite(px+py+pz)) respawn()` — any collision escape self-heals.

### 2.5 Interaction raycast (not for movement)

One shared 2D-DDA walk over the collision grid, testing ray vs. AABB/disc in visited cells, ray from camera along forward, max 30 m. Used for: "look at landmark" detection assist, photo-mode focus hints, and nothing else. ~50 lines. Landmark *triggers* themselves are simpler: distance < radius **and** `dot(forward, toLandmark) > 0.35` (§4.1).

---

## 3. Performance at 10× Scale

Target: **60 fps on Apple M1 / decent laptops, stable 30+ on Intel UHD 620-class iGPUs and mid phones**, for ~250–350k triangles of world. At this scale the vertex count is *not* the problem; the problems are, in order: fillrate/overdraw on iGPUs, draw calls + per-frame JS, and memory layout. The hero demo's "draw everything, 13 calls" dies here — chiefly because a first-person camera at street level has wildly variable visible sets.

### 3.1 Chunked world + frustum culling (the core change)

- Partition all static world geometry into **chunks of 64 × 64 m** (700 m world → ~11×11 = ~121 chunks, most containing 1–4k tris).
- **One shared interleaved VBO + one index buffer for everything static**; each chunk is a contiguous index range `{first, count}` per material pass. Draw = `gl.drawElements(TRIANGLES, count, UNSIGNED_INT, first*4)` (or pad to 16-bit indices per chunk — see §3.5). One VAO for the whole static world; culling changes only the ranges you draw. This keeps the demo's "upload once" simplicity.
- Each chunk stores a precomputed AABB (min/max including tall towers). Per frame: extract 6 frustum planes from `proj*view` (Gribb–Hartmann, ~20 lines), test each chunk AABB with the p-vertex trick. Skip chunks fully outside; also skip chunks whose min distance > fog-opaque distance (§3.4).
- **Sort surviving chunks front-to-back** by center distance before drawing. Early-Z then discards most hidden fragments — this is your occlusion culling; do not build a real occlusion system.
- Expected result: 20–45 chunk draws in dense streets, fewer looking down an avenue. Draw-call budget: **≤ 120 calls/frame total** (chunks + instanced batches + water + sky + particles + UI). At that count, call overhead is irrelevant in WebGL2 with VAOs.

### 3.2 Instancing — for repeated *props*, not houses

WebGL2 `gl.vertexAttribDivisor` + `gl.drawElementsInstanced`. Rule: **instance a mesh only if it repeats ≥ 50× with identical geometry** — trees, lampposts, bollards, moored bicycles, gulls, boats, chimney gables if standardized. Per-instance attributes: `vec4 posYaw` (xyz + yaw) and `vec4 tintScale`, from a per-mesh instance buffer built at generation. In the vertex shader, rotate/translate by the instance data.

**Buildings should NOT be instanced.** Delft's charm is that every canal house differs (the demo already generates ~200 unique gabled houses — keep that). Bake unique buildings straight into their chunk's static VBO. Instancing them would force sameness and complicate per-chunk culling. Instanced props are culled per *batch region*: split each prop type's instances into per-chunk sub-ranges so culling applies (instance buffer sorted by chunk; draw the visible span(s) — or simply accept 2–4 whole-city instanced draws for cheap props like lampposts, which is fine; do per-chunk splitting only for trees ≥ 8 tris).

(Trivia only: on WebGL1 this is the `ANGLE_instanced_arrays` extension with identical semantics. You're not shipping WebGL1.)

### 3.3 LOD — two levels, per chunk, generated not simplified

Don't write a mesh simplifier. **Run every builder twice with a `detail` flag**: `detail=1` emits full geometry (window insets, gable trim, mullions); `detail=0` emits the massing only (box + roof, ~15% of the tris). Each chunk therefore has HI and LO index ranges in the shared buffers. Select per chunk: LO when chunk-center distance > **180 m**, with 15 m hysteresis (swap-in at 165) to prevent popping oscillation at the boundary. Landmark builders (churches, Erasmusbrug, Euromast) always draw HI — they're the skyline and there are few of them. This is ~1 extra flag through the existing builder style, and it typically halves drawn triangles at street level.

### 3.4 Fog is a performance feature

Exponential-squared height-tinted fog, fully opaque by **~450 m** (Delft, intimate) / **~650 m** (Rotterdam, needs its skyline). Then: far plane at fog-opaque + 100; cull chunks beyond it (§3.1); the sky shader paints the same fog color at the horizon so the cutoff is invisible. Fog color = sky-lerp uniform so day/night works free.

### 3.5 Vertex format & memory

- Interleaved, one format for all solids: position `3×float32` **chunk-local** (subtract chunk origin at build, add back via per-draw uniform `uChunkOrigin` — wait, one VAO means one buffer: store *world* positions float32 for simplicity instead; at 700 m extent float32 world coords are precision-safe). Decision: **world-space float32 positions** — simple, safe at this scale.
- Normal: `3×int8` normalized + 1 pad byte. Color: `4×uint8` normalized (rgb + emissive strength, matching the demo's e/mt style — pack material id into a second uint8×4 if needed). **Stride 20–24 bytes.** 300k tris ≈ ~500k verts ≈ ~12 MB VBO — fine everywhere.
- Indices: `UNSIGNED_INT` (universal in WebGL2). Don't juggle 16-bit restarts.
- Cache every uniform location at link time; zero `getUniformLocation`/`getAttribLocation` calls in the frame loop (the demo already does this — keep it).

### 3.6 Fillrate, DPR, and dynamic resolution (the iGPU survival kit)

This is where integrated GPUs actually die: shading 4–8 million pixels per frame.

- **Cap device pixel ratio: `min(devicePixelRatio, 1.5)` desktop, `min(dpr, 1.25)` on coarse-pointer devices.** Nobody can see the difference in a stylized low-poly world; it's a free 2–4× fragment saving on a 3× phone screen.
- **Dynamic resolution:** keep an EMA of frame time (`ema = ema*0.95 + dt*0.05`). If ema > 19 ms for 40 consecutive frames, step render scale down through `[1.0, 0.85, 0.7, 0.55]` (resize the canvas backing store; CSS size unchanged); if ema < 12 ms for 300 frames, step up. Never resize more than once per 2 s. This single mechanism is why the game "just works" on weak hardware.
- **Water is opaque.** Shaded, animated normals/sparkle in-shader, but no blending, and drawn *after* opaque world (it's mostly occluded by quays → early-Z wins). No planar reflections — fake with a fresnel-weighted sky gradient + the demo's moving-highlight trick.
- **Sky last, not first.** Draw the sky *after* all opaque geometry as a fullscreen triangle at depth = 1.0 with `depthFunc(LEQUAL)`, depth writes off. In a street canyon, buildings cover 70% of the sky — painting it first wastes exactly that much fillrate.
- Blended stuff (particles, splash, label halos): budgeted, small quads, one batch each.
- **Antialiasing:** request `{antialias: true}` and accept whatever you get; if dynamic res drops below 0.85, recreate context without AA? No — you can't recreate cheaply; instead just rely on MSAA being cheap on tilers (mobile) and acceptable on desktop. Do not build FXAA.

### 3.7 Back-face culling and winding

`gl.enable(gl.CULL_FACE)` from day one (the flythrough could get away without it; a street-level camera surrounded by closed boxes cannot — it's ~2× rasterization for free). Consequences the builders must honor:

- **Every emitter (`box`, `cyl`, `quadO`, gable builders…) must produce consistent CCW-outward winding.** The demo's builders were never audited for this because culling was off. Audit them; add the headless winding check (§5.2, check W3) so regressions are caught mechanically.
- Ground/water planes: still double-face? No — they're only seen from above; wind them upward and cull normally. The only intentionally two-sided things should be flags/sails: emit both faces explicitly rather than toggling cull state (state toggles per draw are worse than 40 extra tris).

### 3.8 Frame-loop hygiene

- **Zero allocations per frame.** Module-scope scratch `Float32Array`s and vec temps (demo already does this — enforce it everywhere new; the GC hitch you save is the difference between "smooth" and "webby").
- Fixed-timestep simulation at **120 Hz accumulator** (`while (acc >= 1/120) step(1/120)`), render interpolation unnecessary at that rate — just clamp `dt = min(dt, 0.1)` on tab-return. Fixed step makes the collision fuzz tests (§5) exactly reproduce runtime behavior.
- `requestAnimationFrame` only; pause the loop on `visibilitychange` hidden (also suspend AudioContext).

### 3.9 Keeping a 5–10k-line single file maintainable

The file will be written and *edited* by a model; optimize for navigability and localized change:

1. **Numbered banner sections with a table of contents comment at the top of the `<script>`** (`// ==== [7] COLLISION ====` …). Order: constants/tuning → math → RNG → mesh emitters → world DATA tables → world builders (one function per district/landmark) → collision build → GL init/shaders → renderer → input → player/vehicles → game systems (discovery, audio, UI) → loop → boot.
2. **All tuning constants in one `TUNE` block at the top** (speeds, ACCEL_K, fog distances, LOD distance, DPR caps, budgets). Every number this report specifies goes there, named. This is the single highest-leverage pattern for iterating on feel.
3. **Data over code:** landmarks, fact-card text, respawn points, boat splines, street grid definitions live in plain array/object literals in a DATA section, not inline in builder logic.
4. Flat functions + one global `G` state object, prefix-namespaced helpers (`colResolve`, `sfxBell`, `uiCard`). No classes, no closures-as-modules beyond what the demo does — grep-ability beats encapsulation here.
5. Shader sources as template literals directly above their `link(...)` call.
6. **Expose `window.__game = { TUNE, state, world, step, colResolve, stats }`** unconditionally (it's harmless). This is the contract the verification harness (§5) drives.
7. Keep every function under ~80 lines; `buildWorld` is only a call sheet of district builders.

---

## 4. Game Loop — What Makes It a Game

Design principle: **exploration is the game; systems only exist to give walking a direction and a payoff.** Everything below is UI + triggers + the movement you already have — no inventory, no save format beyond localStorage keys.

### 4.1 Landmark discovery (the spine — MUST)

- **10–12 landmarks per city** (Rotterdam: Erasmusbrug, Euromast, Markthal, Cube Houses, De Rotterdam, Witte Huis, Hotel New York, ss Rotterdam, Laurenskerk, Luchtsingel…; Delft: Nieuwe Kerk, Oude Kerk, Stadhuis, Markt, Oostpoort, Molen de Roos, Vermeer Centrum corner, Prinsenhof, canal bridges, the Delfshaven-style quay). Content team note: fact text comes from the design-direction doc; the *system* is what's specced here.
- Trigger: player within landmark `radius` (12–20 m, per landmark in DATA) **and** facing it (`dot(camForward, normalize(toLandmark)) > 0.35`) for 0.4 s. Then: soft chime (§4.6), a **fact card** slides in (name, 2–3 sentence fact, "n / 12 discovered"), auto-dismiss 8 s or E/tap. Discovered landmarks get a subtle marker change (their name label gains a check).
- Wayfinding without a map: undiscovered landmarks show **distant name labels** when visible and > 60 m (reuse the hero demo's callout system — it exists and works), plus a thin compass strip at screen top with landmark ticks. That's enough; a minimap is COULD.
- Persistence: `localStorage['delft.discovered'] = bitmask`, plus collectible mask and settings. On 12/12: a completion card and unlock note ("Fly mode: press F" — if you want F gated, which is a nice touch; otherwise it congratulates and suggests photo mode).

### 4.2 Bicycle (SHOULD — but the highest-value should)

Dutch cities without a bike are wrong, and it's cheap (§1.7: a movement-mode swap, ~120 lines + a handlebar/wheel mesh). Bikes lean against racks at 3–4 marked spots; E mounts, E dismounts (bike stays where left, position in localStorage as a flourish). **B or click rings the bell** (§4.6) — this tiny interaction carries absurd charm-per-line. Ship first-person; chase cam only if time allows.

### 4.3 Photo mode (SHOULD)

P key / camera button: HUD hides, movement freezes (or slow drift), controls become: mouse = aim, wheel = FOV 20–90°, Q/E = roll ±30°, click = capture. Capture = `canvas.toBlob` → temporary `<a download="delft-YYYYMMDD.png">` click. Requires `preserveDrawingBuffer: false` still works if you capture synchronously right after a forced `draw()` in the same task — do that (don't enable preserveDrawingBuffer; it costs performance all the time for a feature used rarely). ~100 lines, huge shareability payoff.

### 4.4 Collectibles (SHOULD, small)

One themed set per city, **15 items**: Delft — hidden Delft Blue tiles (small glowing plaques on walls, in courtyards, under bridges); Rotterdam — rubber ducks? No: **miniature ships** on quays/rooftops (harbor city). Placement from DATA (hand-placed positions beat seeded-random here — random placement puts items in dumb spots). Pickup: proximity 2 m, sparkle burst + arpeggio blip, counter in pause overlay. Rewards *vertical and nook* exploration in a way landmarks don't.

### 4.5 Time-of-day toggle (SHOULD) & boat (COULD)

- **Day/night toggle (N key / button), not a running clock.** The renderer is already uniform-lit; day/night = two entries in a palette table (sky gradient stops, sun/moon dir, light color, fog color, window-emissive strength, water tint) lerped over 4 s. Night is the hero demo's proven look; day needs one new tuned palette. A full 24 h cycle is COULD (it's just animating the lerp t — but tuning *all* intermediate times to look good is real work; dawn/dusk stops could be added as two more palette entries later).
- **Canal/harbor boat ride (COULD):** spline-following tour boat, board/disembark at stops, doubles as a guided tour past landmarks (triggers still fire from the boat). ~150 lines but only after everything above is solid.

### 4.6 Ambient audio via WebAudio — is it worth it? **Yes, in a strict 4-voice budget (~150–200 lines).**

Synthesized audio is disproportionately atmospheric for its cost, *if* you stop at:

1. **Wind bed:** looping noise buffer (1 s of `Math.random()*2-1`, `loop=true`) → biquad lowpass ~400 Hz with cutoff + gain slowly modulated by an LFO and by player speed (sprint = more wind). Gain ~0.06.
2. **Water lap:** second noise voice, bandpass ~600 Hz, amplitude-modulated at 0.3–0.7 Hz; gain ∝ `1/(1+dNearestCanal)` (you already know canal distance from the patch grid). Gain ≤ 0.12 near quays.
3. **Bells:** church bell = 4–5 detuned sine/triangle partials (e.g. f, 2.0f, 2.4f, 3.0f, 4.1f — the minor-third partial is what makes it a *bell*) with exponential decays 2–6 s, struck via `GainNode` envelope. Ring on the real hour (`Date` hours mod 12 strikes — a genuinely magical touch), on discovery (single soft strike, higher f), and Nieuwe Kerk gets a short Westminster-ish 4-note chime. Bicycle bell = two quick 2.1 kHz triangle dings.
4. **UI blips:** one shared short envelope osc for pickups/cards.

Rules: create the `AudioContext` lazily on the start-overlay click (autoplay policy: contexts start `suspended` without a gesture; also `resume()` on visibilitychange-visible), a master `GainNode` with a mute toggle (M), and **no per-frame node creation** — voices are persistent, only params move. Do not attempt: footsteps (procedural footsteps sound terrible and remind players there's no body), music (a synth loop will grate; silence + wind is classier), 3D panner networks (a single stereo `StereoPannerNode` on bells, panned by bearing, is plenty).

### 4.7 v1 feature list (sized for a single-session build by a capable model)

**MUST (the game is these):**
1. WebGL2 chunked/culled/fogged renderer with LOD + dynamic resolution (§3) at metre scale
2. First-person controller: Pointer Lock + WASD + sprint, full gotcha handling (§1.2–1.4)
3. Touch scheme: dynamic joystick + look-drag + context button (§1.5)
4. Collision grid + height patches + water fall-in/respawn (§2)
5. Fly mode toggle (§1.4) — dev tool, accessibility, and delight in one
6. Landmark discovery loop: 10–12 landmarks, fact cards, compass strip, distant labels, localStorage (§4.1)
7. Start/help/pause overlay (click-to-start = pointer-lock + audio gesture; keys listed; WebGL2 fallback page)
8. Minimal audio: wind bed + discovery chime + hourly bell (§4.6 voices 1+3)

**SHOULD (each independently shippable, in this order):**
9. Bicycle with bell (§4.2)
10. Day/night toggle (§4.5)
11. Photo mode with PNG download (§4.3)
12. Collectible set of 15 (§4.4)
13. Water-lap audio voice + splash SFX
14. Gamepad (§1.6)

**COULD (only after both cities ship their SHOULDs):**
15. Boat ride on spline (§4.5)
16. Ambient life: instanced cyclists/pedestrians on street splines, gulls, the train (Rotterdam) — pure motion, no interaction
17. Minimap (top-down orthographic render-to-texture or prebaked 2D canvas from footprints — do the 2D canvas)
18. Full time-of-day cycle, rain mode
19. Achievements / completion timer

---

## 5. Verification

Two layers: a **headless structural harness** (catches ~80% of failure modes mechanically, runs in Node in seconds) and a **short real-browser pass** (the only place shaders, feel, and fps are real).

### 5.1 Harness mechanics (no build tools)

A single Node script per game, e.g. `verify.mjs`:
1. Read `index.html`, extract `<script>` contents (regex), `new Function('window','document','navigator','performance','requestAnimationFrame', src)`.
2. Provide stubs: `document` (returns a fake canvas whose `getContext('webgl2')` is a **recording GL stub** — every method exists, returns plausible objects, logs calls; `getUniformLocation` returns per-name tokens; `createBuffer` etc. return tagged objects), `localStorage` map, `matchMedia`, 2D context stub for any minimap, `AudioContext` stub. ~250 lines, written once, shared by both games.
3. Because the game exposes `window.__game` (§3.9), the harness can drive `step(dt)` directly with scripted/random inputs — no rAF, no timers.

### 5.2 Structural checks (assert, exit nonzero)

- **W1 — Boots clean:** script evaluates and `buildWorld` + GL init complete with zero exceptions on the stub.
- **W2 — NaN/∞ sweep:** every generated `Float32Array` (vertex data, instance data, patch/collider tables) contains only finite values; vertex positions within world AABB ± 50 m.
- **W3 — Winding/normal coherence:** for each triangle, `dot(geometricNormal, storedVertexNormal) > 0` for ≥ 99.5% of triangles (flags inverted winding that back-face culling will turn into holes).
- **W4 — Budgets:** total tris ≤ 400k; per-chunk tris ≤ 12k; instanced batch count, collider count, draw-call *estimate* (visible-chunk worst case × passes) ≤ 150; VBO bytes ≤ 32 MB. Fail loud when the generator bloats.
- **W5 — Determinism:** run world-gen twice with the seed → FNV-1a hash of all buffers identical.
- **W6 — Collider/patch sanity:** every landmark trigger point and every respawn point sits on a patch with `groundAt` finite and no collider overlap (spawn-inside-wall is the classic ship-killer); every grid cell's indices in range.
- **C1 — Collision fuzz:** 20k fixed steps (1/120 s) with seeded random inputs (including sprint bursts, direction reversals, spawning at 200 random street points): assert after every step — position finite; player circle penetrates no collider by > 1 mm after resolution; `py` never < −10 without the respawn firing; speed never exceeds SPRINT × 1.05.
- **C2 — Traversal:** scripted walks: across each bridge (ends on far side at street height), down a quay stair, off a quay (respawn fires within 3 s), around one full canal block (returns within 1 m of start given the scripted path).
- **G1 — Game loop:** teleport to each landmark trigger, face it, step 1 s → discovery fires exactly once, counter increments, localStorage written; all 12 → completion state. Collect all collectibles similarly.
- **P1 — CPU proxy:** time 1000 `step()`+cull calls in Node; mean must be < 2 ms. (Not a GPU proxy — but it catches per-frame allocation/complexity regressions, and you can also assert the recording GL stub sees zero buffer re-uploads and < 150 calls per drawn frame.)
- **S1 — Shader lint (regex-level, since no GLSL compiler headlessly):** every `uniform`/`in`/`out` name referenced via the cached-location table exists in the source string; vertex `out`s match fragment `in`s; fragment shaders declare `precision`; `#version 300 es` is the first line.

### 5.3 What only a real browser can confirm (manual/Playwright checklist)

Playwright + headless Chromium (SwiftShader GL — real GLSL compilation, wrong performance numbers) automates the first three; the rest is a 10-minute human pass per game:

1. **Shaders actually compile/link** (`gl.getError()===NO_ERROR` after first frame; assert via page evaluate) and a screenshot is non-black with > 5% pixel variance (catches all-sky, all-fog, NDC bugs).
2. Pointer-lock flow: click → locked; Esc → resume overlay; re-click → locked again (Playwright can only partially simulate; verify the state machine + do one human check in Chrome, Firefox, Safari).
3. localStorage persistence across reload.
4. **Human-only:** real fps on a weak machine (Intel iGPU laptop + one Android phone + one iPhone — watch dynamic res kick in), movement *feel* (the ACCEL_K/sensitivity constants), touch simultaneity, z-fighting at quay edges and rooflines, fog/LOD pop at the 180 m boundary, audio taste and levels, Safari quirks (audio resume, `unadjustedMovement` fallback path), battery/thermals over 5 minutes on the phone.

Wire `verify.mjs` + the Playwright smoke into whatever loop the builder runs after each editing pass; the fuzz (C1) in particular should gate every collision-adjacent change.

---

## Appendix — one-screen constant sheet (goes into `TUNE`)

```
units 1u=1m · world ~700×700m · SEED fixed
eye 1.65 · playerR 0.35 · stepUp 0.45 · gravity 22
walk 4.3 · sprint 7.5 · fly 18/55 · bike 9.5 · boat 3.0
ACCEL_K 12 · DECEL_K 9 · groundSnap k16 · camYSmooth k14
sens 0.0023 rad/count · touchLook 0.0060 rad/px · pitch ±1.55
fovY 62° (+5° sprint) · near 0.1 · far fogOpaque+100
fogOpaque: Delft 450 / Rotterdam 650 · LOD swap 180m (hyst 15)
chunk 64m · colCell 8m · tris ≤400k · draws ≤120/frame
DPR cap 1.5 desktop / 1.25 mobile · dynRes steps 1/.85/.7/.55 @19ms/12ms EMA
sim step 1/120 fixed · dt clamp 0.1 · zero per-frame allocs
audio voices: wind lp400 g.06 · water bp600 g≤.12 · bell partials f,2f,2.4f,3f,4.1f
landmark trigger: r 12–20m ∧ dot(fwd,to)> .35 held .4s
```
