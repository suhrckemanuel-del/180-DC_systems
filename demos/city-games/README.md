# City games

Two standalone, browser-based walking simulators — one per home city — built as single self-contained WebGL2 files with no libraries and no assets. Night on the Maas, the next morning in Delft: the sibling contrast is the point.

| | |
|---|---|
| [delft/](delft/) | **Playable.** "Ochtendlicht" — the canal town at eight in the morning under drifting cloud shadows. 13/13 verification checks pass. |
| [rotterdam/](rotterdam/) | **Incomplete.** "Nachtstad aan de Maas" — world generators exist; the renderer, controls and game systems are not built yet. Do not expect it to run. |
| [research/](research/) | The design and engineering research both games are built from. |

The research came first and is worth reading on its own:

- [design-direction.md](research/design-direction.md) — ten craft principles for limited-geometry worlds, each drawn from a specific game (Townscaper, Sable, A Short Hike, Kentucky Route Zero, Monument Valley), then a full identity per city: mood, defended time of day, concrete hex ramps, one light story, six authored vistas, and a list of what would make the result feel cheap.
- [tech-functionality.md](research/tech-functionality.md) — movement feel constants, pointer-lock gotchas, a 2.5D collision design, what it takes to render a walkable city in raw WebGL2, a prioritised feature list, and the verification strategy.

Each city then has a `SPEC.md` that resolves the places where those two documents disagreed. The largest calls: no compass, minimap or HUD of any kind (the design argument that light is the signage won), and each city frozen at its signature hour rather than carrying a day/night toggle.
