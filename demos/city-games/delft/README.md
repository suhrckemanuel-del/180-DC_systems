# Delft — "Ochtendlicht"

A walkable 3D Delft at eight in the morning. Open [index.html](index.html) in a browser, click, and walk. One self-contained file: hand-written WebGL2, no libraries, no textures, no network. Everything is generated from a single seed at load.

## Playing

| | |
|---|---|
| Walk | `W A S D` or arrows, `shift` to go faster |
| Look | mouse (click to capture the pointer; `Esc` releases it) |
| Places found | `Tab` |
| Interact / mount a bicycle | `E` |
| Bicycle bell | `B` |
| Photo mode | `P` — wheel zooms, `Q`/`E` tilt, click saves a PNG |
| Mute | `M` |
| Fly | `F`, once you have found all eleven places |

On a phone the left half of the screen drives and the right half looks.

Eleven places carry a card when you find one — the two churches, the Stadhuis, the Markt, the Oostpoort, the mill, the Prinsenhof, Vermeer's corner, the Oude Delft, the spot Vermeer painted from, and a hofje behind an unmarked door that nothing points you toward. Fifteen Delft Blue tiles are hidden in the nooks the landmarks ignore. Nothing unlocks; knowing the town is the reward.

## The light

The whole piece runs on one idea. Astronomers reading the shadows in Vermeer's *View of Delft* put the hour at about eight in the morning, with the sun low in the south-east — so that is when the game is set, permanently. There is no day/night cycle.

Cloud shadows drift across the town at walking pace and are computed analytically in the fragment shader: every surface projects itself onto a drifting cloud deck along the sun vector and reads its own shadow from the same noise field the sky draws overhead. Streets cool and warm as the clouds pass, and the canals only glitter where the sun actually reaches them. That roaming light is the wayfinding: there is no compass and no minimap anywhere in the game.

## Under it

- ~175k triangles in one buffer, uploaded once, drawn in 80–115 calls per frame.
- 144 chunks of 64 m with frustum culling, front-to-back ordering, and two generated levels of detail (every builder runs twice, full and massing-only) swapping at 180 m with hysteresis.
- Collision is 2.5D: a 0.35 m circle against a uniform grid of boxes, discs and rotated boxes for walls, plus analytic height patches for the ground. The highest patch within step-up wins, which is what makes bridge decks, the ground under those same bridges, quays and stairs all work from one rule. Walk off a quay and you get fished out at the nearest bridge end.
- Dynamic resolution and a device-pixel-ratio cap keep it alive on integrated graphics.

## Verifying

```
node verify.mjs
```

Runs the game's own script against a stubbed DOM and a recording WebGL2 context, then drives `window.__game.step()` directly: 13 checks covering finite geometry, winding coherence against back-face culling, triangle and memory budgets, determinism from the seed, spawn-point sanity, a 20,000-step collision fuzz, recovery from inside geometry, scripted bridge and quay traversals, the full discovery loop, a CPU budget, and shader structure.

It cannot prove the shaders compile, the frame rate, or how walking feels. Those were checked separately in a browser, and the feel still wants a human.

## Known limitations

- No cast shadows from buildings. The light story is the cloud shadows; adding a shadow map for the geometry is the obvious next step and the one that would most change how it looks.
- The mill and the Oostpoort read darker than they should from some angles.
- The bicycle exists and rides, but the chase camera was left out — it is first-person only.
- Verified on desktop Chromium with software GL. Real hardware, Safari, and phones are untested.
