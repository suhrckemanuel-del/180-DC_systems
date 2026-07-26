# Rotterdam — "Nachtstad aan de Maas"

A walkable 3D Rotterdam at late blue hour. Open [index.html](index.html) in a browser, click, and walk. One self-contained file: hand-written WebGL2, no libraries, no textures, no network. Everything is generated from a single seed at load.

## Playing

| | |
|---|---|
| Walk | `W A S D` or arrows, `shift` to go faster |
| Look | mouse (click to capture the pointer; `Esc` releases it) |
| Places found | `Tab` |
| Photo mode | `P` — click saves a PNG |
| Mute | `M` |
| Fly | `F`, once you have found all eleven places |

On a phone the left half of the screen drives and the right half looks.

Eleven places carry a card when you find one: the Erasmusbrug, the Euromast, the Markthal, the Cube Houses, De Rotterdam, the Witte Huis, the Laurenskerk, De Hef, the Luchtsingel, Hotel New York and the Wilhelminapier. Fifteen miniature ships are hidden on quays and rooftops, including two on the Luchtsingel and one on the bridge itself. Nothing unlocks; knowing the city is the reward.

## The light

Not pure night — late blue hour, roughly half an hour after sunset, frozen there permanently. A pure black sky flattens every roofline into nothing; a deep cobalt gradient with one dying teal band at the horizon keeps every tower, crane and cable reading as a hard silhouette while all the lights are already on.

Nothing in this city has a sun. There is no directional light anywhere in the shader. Every bright thing is emissive — windows in two temperatures at jittered brightness, sodium lamp heads, the yellow deck of the Luchtsingel — and the sky supplies a thin cool ambient and nothing else. Amber pools fall on the pavement every 25 metres, and the dark between them is the only shadow the game has.

The river is the other half of it. Emissive sources register as reflectors, and the sixteen brightest near the camera paint vertical streaks down the Maas, wobbling with the ripple and falling off with distance. The city lights the water; the water lights the city.

## Under it

- ~56k triangles in one buffer, uploaded once, drawn in 12–65 calls per frame.
- 400 chunks of 64 m with frustum culling, front-to-back ordering, and two generated levels of detail (every builder runs twice, full and massing-only) swapping at 180 m with hysteresis. Builders never tagged their output, so the world is partitioned into chunks after the fact by triangle centroid.
- A separate additive pass for light: ground pools, lamp coronas, blinking aviation beacons, and the Euromast's rotating sweep, all as camera-facing or ground-flat sprites with the animation done in the vertex shader.
- Collision is 2.5D: a 0.35 m circle against a uniform grid of boxes, discs and oriented boxes for walls. The ground is analytic — `isLand()` decides pavement or river, so no generator has to register a patch per tile — and only the raised surfaces push height patches. The Erasmusbrug deck is a parabola in the bridge's own frame, which is what lets you walk over it and under it from one rule. Walk off a quay and the Maas fishes you out at the nearest respawn.
- Dynamic resolution and a device-pixel-ratio cap keep it alive on integrated graphics.

## Verifying

```
node verify.mjs
```

Thirteen checks against a stubbed DOM and a recording WebGL2 context, driving `window.__game.step()` directly: finite geometry, winding coherence against back-face culling, budgets, determinism from the seed, spawn sanity, a 20,000-step collision fuzz, recovery from inside geometry, a scripted crossing of the bridge deck and a walk off a quay, the full discovery loop, a CPU budget, and shader structure.

It cannot prove the shaders compile, the frame rate, or how walking feels. The first was checked separately in a browser; the last still wants a human.

## Known limitations

- The city is thinner than Delft — about 56k triangles against 175k. The district grid loses a lot of blocks to the river, the map rim and the reserved sightlines, and the generic blocks that survive are plainer than Delft's canal houses. This is the first thing to improve.
- The Markthal's arch reads as one flat amber mass up close rather than a lit interior.
- De Hef is pure silhouette by design, but standing directly under it fills the screen with black.
- No water taxis, no container ship, no gulls: the moving life the design calls for is not built. The Euromast sweep, the beacons and the river are the only things in motion.
- The bicycle mode exists in the player but has no racks to mount from, so it is unreachable in play.
- Verified on desktop Chromium with software GL. Real hardware, Safari and phones are untested.
