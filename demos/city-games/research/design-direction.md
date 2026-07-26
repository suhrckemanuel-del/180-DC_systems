# Design direction — two explorable city games: ROTTERDAM and DELFT

Decision-ready art direction for two standalone, browser-based walking-simulator games, each a
single self-contained HTML file of hand-written WebGL: no libraries, no texture files, everything
procedural. Sibling pieces to the existing night diorama at
`/home/user/180-DC_systems/demos/3d-city-hero/index.html` (brand: deep blue-charcoal `#070B11`,
ink `#E8EEF2`, teal accent `#5FE3D0`/`#2FB9AE`). The diorama is one world seen from the air; these
are two worlds seen from eye level. Everything below is chosen for the ground-level camera.

The single most important shift from the hero demo: **at eye level, light and silhouette do all
the work that camera choreography did from the air.** The player now stands *inside* the
composition, so every design decision below is about what a 1.7 m-tall camera sees.

---

## (a) Craft principles for limited-geometry worlds

Ten rules, each drawn from a specific reference. These are binding for both games.

**1. One strong light story per scene — nothing else competes.**
Townscaper reads as lush with almost no geometry because Stålberg commits to a single lighting
idea (dusk, long shadows, a limited palette that makes focal buildings pop) and adds colored
bounce light so shadows are never dead gray ([Townscaper / Stålberg](https://en.wikipedia.org/wiki/Townscaper),
[procedural-generation notes](https://www.linkedin.com/pulse/how-make-procedural-generation-look-good-gabriele-romagnoli-vjihe)).
Kentucky Route Zero goes further: every scene is a theatrical *set*, lit like a stage — one key
light, deep surrounding darkness, silhouettes doing the storytelling
([GDC: Scenography of Kentucky Route Zero](https://www.gdcvault.com/play/1020596/Scenography-of-Kentucky-Route)).
Rule: each game has exactly ONE light story (defined per city below). Every material, fog value
and window color derives from it. No scene-local "extra" lighting ideas.

**2. Palette discipline: pick ramps, then never leave them. Validate in grayscale.**
Dorfromantik's team iterates on palettes constantly and "regularly checks everything in grayscale
to validate the value structure" ([80.lv on Dorfromantik](https://80.lv/articles/how-dorfromantik-expands-its-cozy-world-through-minimalist-design)).
Mini Motorways gets its calm from a soft, stylized palette with very few hues
([Game Developer on Mini Motorways](https://www.gamedeveloper.com/audio/-i-mini-motorways-i-and-the-delicate-art-of-marrying-complexity-and-minimalism)).
Rule: each city gets the fixed hex ramps below — roughly 5 value steps per material family, ≤ 3
accent hues per city. If a new element needs a new color, it's the wrong element. Builder must
check the frame in grayscale: sky lightest (or darkest at night), hero landmarks highest
contrast, filler buildings compressed into a narrow mid band.

**3. Silhouette hierarchy beats surface detail.**
Sable is defined by thin ink outlines, flat color, and almost no shading — and Shedworks framed
the entire style as "a pursuit of readability," born from a two-person team's limits
([Game Developer on Sable](https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability),
[GDC: The Art of Sable](https://gdcvault.com/play/1027721/The-Art-of-Sable-Imperfection)).
Rule: every landmark must be identifiable from its silhouette alone, at fog distance, unlit.
Spend triangles on outline (roofline steps, spire profiles, crane jibs, gable shapes), never on
surface relief. Three silhouette tiers: HERO (unique, high-contrast, visible across the map),
DISTRICT (repeated typologies with variation — gabled houses, harbor sheds), TEXTURE (fog-band
filler, near-flat value).

**4. Flat shading + soft edge treatment + tiny value palette can carry a whole 3D world.**
A Short Hike renders 3D with flat cohesive shading, a deliberately reduced palette, and a soft
outline pass to keep objects readable at low resolution
([PlayStation Blog: making A Short Hike](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/)).
Rule: flat-shade per face (compute face normals, quantize the lambert term into 3–4 bands in the
shader). No smooth normals except water. A cheap "outline" substitute that works in raw WebGL:
darken faces by a fixed factor per axis (the hero demo already does axis-tinted box faces — keep
that language) and add a subtle fog-colored fresnel rim so edges lift from the background.

**5. Negative space: every frame is a composition, so leave room for sky and water.**
Monument Valley treats each screen as an individual artwork — puzzle, graphic design and
architecture unified, with generous emptiness around the monument
([Creative Bloq: making Monument Valley](https://www.creativebloq.com/computer-arts/making-monument-valley-71412213),
[GDC: Less Game, More Experience](https://gdcvault.com/play/1020878/Designing-Monument-Valley-Less-Game)).
Rule: never wall the player in on all sides. Streets open onto water, squares, or sky at least
every ~60 m of walking. Sky occupies ≥ 40% of the frame in hero vistas. Density is a rhythm:
compression (narrow street, canal corridor) → release (square, quay, bridge crest).

**6. Landmarks are weenies; light is the signage.**
Disneyland's "weenie" principle — a tall, lit landmark that pulls people through space — is the
canonical navigation tool for open worlds; designers keep sightlines to it and use lighting, not
signs, to mark the path ([Game Design Snacks: weenies](https://game-design-snacks.fandom.com/wiki/Using_the_Environment_as_Weenies_-_aids_in_player_navigation),
[Level Design Book: wayfinding](https://book.leveldesignbook.com/process/blockout/wayfinding)).
Rule: from any walkable point, at least one hero landmark must be visible or become visible
within ~5 seconds of walking. Street layouts bend to preserve these sightlines (stylized city ≠
accurate map). The brightest thing in any frame is always something worth walking toward.

**7. Vistas are the reward loop.**
A Short Hike is built around "the moment of respite upon reaching the summit, and surveying the
landscape from a new perspective" ([PlayStation Blog](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/)).
Rule: each city has 5–6 authored vista points (listed below) where the composition is *designed*
— foreground frame, mid subject, background depth. Reaching one triggers the location-name
treatment (see UI) and, where possible, small elevation: stairs, a bridge crest, a platform.
Climbing even 3 m in a walking sim feels like a summit.

**8. Lived-in micro details, placed sparsely, do the storytelling.**
Environmental-storytelling practice: laundry drying, a hearth still glowing, one lit window —
details that imply life continuing off-screen — and *never* flagged with markers, because
"blinking icons destroy the sense of discovery"
([Game Developer: Environmental Storytelling](https://www.gamedeveloper.com/design/environmental-storytelling),
[gamedesignskills.com](https://gamedesignskills.com/game-design/environmental-storytelling/)).
Rule: budget ~12–20 hand-placed "life details" per city (specific lists below), each ≤ 100
triangles, most of them animated at 0.1–0.5 Hz (slow flicker, sway, drift). Cluster them at rest
points, not evenly.

**9. Fog is composition, not concealment.**
In every reference above, atmosphere creates depth hierarchy: Vermeer's *View of Delft* gets its
depth from a dark cloud-shadowed foreground against a sunlit midground
([Mauritshuis](https://www.mauritshuis.nl/en/our-collection/artworks/92-view-of-delft),
[Essential Vermeer analysis](https://www.essentialvermeer.com/cat_about/view.html)).
Rule: height-and-distance fog tinted to the horizon color (never neutral gray), tuned so the
TEXTURE tier of buildings sits half-dissolved and hero silhouettes punch through. Fog color IS a
palette entry, not a rendering afterthought.

**10. UI stays out of the world's way (Firewatch rule).**
Firewatch commits to diegetic/near-diegetic UI — a physical map, no floating markers — to protect
immersion ([Game Developer on Firewatch UI](https://www.gamedeveloper.com/design/how-firewatch-s-ui-enhances-player-immersion));
but the "minimal HUD paradox" warns that forcing everything diegetic creates clutter of its own
([Ahmed Salama, Medium](https://medium.com/@salamatizm/the-minimal-hud-paradox-how-dreams-of-diegetic-game-interfaces-often-lead-to-cluttered-nightmares-e9cf7fae9d73)).
Rule: near-zero HUD; typography-only overlays in the brand system that appear on events and fade
fully. Details in section (d).

---

## (b) ROTTERDAM — "Nachtstad aan de Maas" (night city on the Maas)

### Mood
Kinetic night-harbor metropolis. "Manhattan aan de Maas": steel, glass, neon bleeding across
black water, water taxis cutting wakes, cranes standing like animals at the fog line
([Rotterdam night character](https://www.getyourguide.com/explorer/rotterdam-ttd37/things-to-do-at-night-in-rotterdam/)).
Crucially, Rotterdam's identity is *not* church towers and squares — "cranes, ships and the
harbor basins have greater iconic and identity value than bell towers"
([EcoWebTown on Rotterdam's metropolis image](https://www.ecowebtown.it/n_16/16_06-Castigliano-en.html)).
The feeling to hit: standing alone on a quay at night, wind implied, the city humming — awake but
not crowded. Big, confident, a little cold, warmed by pinpricks of human light.

### Time of day — LATE BLUE HOUR, defended
Not pure night (the hero demo's choice). At eye level, a pure-black sky flattens every rooftop
into nothing. Late blue hour — roughly 30–40 minutes after sunset — keeps a deep cobalt gradient
with one dying teal-green afterglow band at the horizon, so every tower, crane and cable reads as
a hard silhouette *against* the sky while all lights are already on. This is exactly Townscaper's
trick (dusk = long value range, focal elements pop) applied to night, and it keeps continuity
with the brand's night identity while giving the ground camera a value gradient to compose
against. The scene is frozen at this minute forever — no day/night cycle.

### Palette — concrete hex ramps
Base is the brand charcoal-blue, evolved. Three accents only: brand TEAL (water/civic light),
SODIUM AMBER (harbor/human light), SIGNAL RED (marine/aviation), plus one deliberate spot-color
exception (Luchtsingel yellow — see vocabulary).

```
SKY (vertical gradient, zenith → horizon)
  #04070E → #0A1424 → #123048 → afterglow band #1E5B66 (teal-green, low, narrow)
WATER (Nieuwe Maas)
  base #061118 · swell shading #0B1D28 · reflection streaks #2FB9AE / #5FE3D0 · sparkle #A9F1E4
BUILT DARK (unlit mass, 5 steps, near→far)
  #1A2634 · #16202C · #111A25 · #0D1520 · fog-merged #10263A
CONCRETE / LIT FACES (street-level ambient)
  #24384A · #2E4458 · quay stone #202E3C
WINDOWS (two temperatures, never uniform)
  warm home #FFC46B / dim #B07E43  ·  cool office #9FD4E8 / dim #55788C
SODIUM AMBER (harbor floodlight, streetlight pools, crane work lights)
  core #FFB25C · glow #E07A2A · deep #8A4A1A
SIGNAL RED (crane tips, mast lights, De Hef beacons, De Rotterdam aviation lights)
  #FF5A5A · dim #8A2E33
LUCHTSINGEL YELLOW (one object in the whole city)
  #FFD23F
FOG COLOR  #0F2233   ·  UI INK #E8EEF2 on #070B11 (unchanged brand)
```

Grayscale check: sky mid-value, water darkest, built mass compressed dark, lights are the only
high values. If a screenshot in grayscale doesn't read as "dark city, constellation of lights,
one glowing horizon band," the values have drifted.

### Light story (the ONE idea)
**"The city lights the water; the water lights the city."** Single dim cool-blue directional
ambient from the sky gradient (no sun). All *apparent* illumination is emissive: windows, bridge
cables, streetlight pools, crane floods — and each emissive source paints a shimmering vertical
reflection streak on the Maas (the hero demo's reflection language, now seen from the quay edge,
filling the lower half of the frame). Streetlights drop discrete elliptical amber pools on the
ground at ~25 m spacing — walking is moving from pool to pool, KRZ-stage style. Secondary motion:
Euromast's slow rotating beacon sweep, blinking red crane tips (out of phase), window lights that
very occasionally switch on/off. Nothing casts real shadows; darkness between pools IS the shadow.

### Hero vistas (authored compositions, in suggested discovery order)
1. **Wilhelminapier waterline** — start here. Across the black water: Erasmusbrug's lit cable fan
   from below-deck level, skyline behind, full reflection field in the foreground. The "poster."
2. **Erasmusbrug deck crest** — climbing the bridge's gentle arc is the game's "summit": at the
   crest, the bent pylon overhead, cables fanning, city on both banks. The bridge is nicknamed
   "The Swan" and is the city's night icon ([erasmusbrug.com](https://www.erasmusbrug.com/en)).
3. **De Hef framed by cranes** — upriver: the 1927 vertical-lift railway bridge, "its silhouette
   framed with the Maas and the surrounding cranes"
   ([De Hef guide](https://www.kupi.com/en/explore/netherlands/rotterdam/koningshavenbrug-de-hef)) —
   pure black steel lattice against the afterglow band, red beacons on the lift towers. The
   industrial soul of the city; give it NO amber, only red + silhouette.
4. **Markthal mouth** — the horseshoe arch interior glowing warm amber like a hearth, the one
   large *warm* volume in a cool city; visible down a street axis from the Blaak side, with the
   Cube Houses' tilted yellow-tinged silhouettes stacked beside it.
5. **Euromast base looking up** — vertigo composition: the shaft vanishing into the dark, beacon
   sweeping. Optional lift to the platform = the map-reveal vista over everything.
6. **Witte Huis / Oude Haven pocket** — the 1889 Art-Nouveau "first skyscraper of Europe"
   ([Witte Huis](https://all.accor.com/a/en/limitless/thematics/architecture-design/rotterdam-architecture.html))
   glowing pale among historic harbor boats: the one *old* corner, telling the survival-of-1940
   story purely through contrast with the towers behind it.

### Secondary vocabulary (the "says Rotterdam" filler layer)
- **Harbor gantry cranes** in ranks at the fog line, jibs at varied angles, red tip lights.
- **Water taxis**: small fast hulls with green/red nav lights, crossing the Maas on timers,
  leaving fading V-wakes that distort the reflection streaks (signature moving detail).
- **Moored barges & one long low container ship** sliding almost imperceptibly downstream.
- **The Luchtsingel**: the crowdfunded 400 m bright-yellow elevated walkway threading between
  buildings ([Dezeen](https://www.dezeen.com/2015/07/16/luchtsingel-elevated-pathways-bridges-rotterdam-cityscape-zus-architects/)) —
  the city's one yellow object, a walkable ribbon that pays off with a rooftop-level view.
- **Bollards, cleats and heavy chain** at quay edges; coiled rope; container stacks (2–3 muted
  hues from the built ramp, never rainbow).
- **Wind**: implied only — flags and crane pennants at a constant 12° flutter, ripple frequency
  on the water slightly higher than Delft's.
- Life details (per principle 8): one lit café front spilling amber on wet-look quay stone; a
  crane cab with its work light on; laundry is NOT Rotterdam — here it's a lone lit office floor
  high in a dark tower; two gulls (5-triangle billboards) circling a mast light.

---

## (c) DELFT — "Ochtendlicht" (morning light)

### Mood
Tranquil canal town at early morning, before the shops open. Bells, mist on the water, brick
warming in the first sun. Where Rotterdam is kinetic and vertical, Delft is still and horizontal
— the sibling contrast IS the product. The city "exudes a timeless appeal… standing on the Markt
feels like stepping into a Vermeer painting"
([Holland.com on Delft](https://www.holland.com/global/tourism/discover-the-netherlands/visit-the-cities/delft)).
The feeling to hit: unhurried curiosity; every corner might hide a hofje.

### Time of day — VERMEER MORNING, defended
Astronomical analysis of the *View of Delft* shows Vermeer painted **morning light from the
southeast** (sun azimuth ≈ 110°), not evening light as long assumed
([Smithsonian](https://www.smithsonianmag.com/smart-news/astronomy-offers-fresh-look-vermeers-view-delft-180975413/)).
So the canonical image of this city is already a specific hour: roughly 8 a.m., low warm sun,
massive bright cumulus, a dark cloud shadowing the foreground quay while "the roofs and towers of
the Nieuwe Kerk are bathed in radiant sunlight"
([Mauritshuis](https://www.mauritshuis.nl/en/our-collection/artworks/92-view-of-delft)). We adopt
that exact light. It also maximally opposes Rotterdam's blue hour: warm vs cool, sun vs emissive,
morning vs night — two hours of the same Dutch day, which is the sibling story in one sentence:
**"one night on the Maas, the next morning in Delft."**

### Palette — concrete hex ramps
Warm brick + cream + slate, with **Delft Blue cobalt** as the city's accent — the porcelain blue
([Royal Delft heritage](https://www.amsterdamexperience.net/post/delft-blue-dutch-ceramics)) is
the honest local evolution of the brand teal: same family, shifted from `#5FE3D0` toward cobalt.
UI chrome keeps brand teal; the *world* speaks cobalt. Three accents: COBALT, SUNLIGHT GOLD,
FOLIAGE GREEN.

```
SKY (zenith → horizon)
  #6E9BC0 → #9FC0D6 → #D8E4E4 → horizon cream #F0E6CC
CLOUDS (big procedural cumulus, 2 values)  lit #F7F3E8 · shadowed underside #9AA8B4
SUN DISC / GLOW  #FFE9B8 / #FFD98F   (low, SE, ~15° elevation)
BRICK (5 steps, sunlit → shadow)
  #C97B54 · #B4674A · #9E5540 · #7A4234 · #5E3630
PLASTER / CREAM FACADES   #F0E9D6 · #E2D8BE · shadow #B8AE96
ROOFS   red tile #C05A38 / shadow #8A3E2C  ·  slate #55606A / shadow #39424C
STONE / BRIDGES / QUAYS   #C4BCA8 · #A69E8A · #7E7866
DELFT BLUE (doors, shutters, boats, tiles, market awnings, UI accents in-world)
  porcelain white #F4F6F2 · cobalt #2B5FB4 · deep #1B3D7A
CANAL WATER  base #35504C · sky reflection #A9C4CE · sun glitter #FFE9B8
FOLIAGE (lindens along canals)  lit #8FAE62 · mid #6E9048 · shadow #4C6B38
MIST (low, over water, burning off)  #DCE6E4 at 20–35% alpha
SHADOW TINT (all cast shadows are cool, never black)  multiply toward #4C6484
FOG COLOR  #C8D6D4
```

Grayscale check: near-inverse of Rotterdam — sky bright, sunlit facades brightest mids, shadow
side compressed, water mid-dark. The Nieuwe Kerk tower in sun must be the highest-value built
thing in any frame containing it.

### Light story (the ONE idea)
**"Traveling sunlight under moving clouds"** — Vermeer's device made playable. One warm
directional sun (from the SE, long WNW-pointing shadows) plus 2–3 huge slow cloud shadows
(procedural soft-edged dark patches, ~80–150 m across) drifting over the city at ~1.5 m/s. At any
moment some streets sit in cool cloud shadow and some in gold; a facade ahead of you *lights up*
as a shadow slides off it — the world breathes and the roaming light literally guides wandering
(principle 6: light as signage, here moving). Sun glitter (pointillé!) on canal water only inside
sunlit patches — Vermeer's "sequin-like" pointillés on the barges
([Essential Vermeer](https://www.essentialvermeer.com/cat_about/view.html)) rebuilt as animated
specular sparkle points. Windows are dark glass with sky reflection (no emissive); the only warm
interior light is one bakery window (see details).

### Hero vistas
1. **The View of Delft itself** — southern water gate area: stand across the Kolk basin looking
   north at the town profile — dark foreground quay under cloud shadow, sunlit Nieuwe Kerk tower
   behind the rooflines, big cumulus above. The game's poster is a 350-year-old painting the
   player *walks into*; when the composition aligns, the location title reads "Gezicht op Delft."
2. **Markt axis** — the long square with the Nieuwe Kerk (109 m spire, already built in the hero
   demo) at one end and the Stadhuis facing it at the other; market stalls with cobalt-striped
   awnings on Thursdays-forever ([Markt](https://www.gpsmycity.com/attractions/markt-(market-square)-60162.html)).
3. **Oude Delft canal corridor** — the classic compression shot: canal, trees, brick bridges,
   and the Oude Kerk's tower ("Scheve Jan," leaning ~2 m off vertical,
   [fullsuitcase.com](https://fullsuitcase.com/things-to-do-delft-netherlands/)) tilting over the
   street. Model the lean honestly — it's the silhouette's whole story.
4. **Oostpoort** — the last surviving city gate, twin Gothic turrets + water gate + white wooden
   drawbridge ([Eupedia](https://www.eupedia.com/netherlands/delft.shtml)); approached along the
   canal it's the "small castle" reveal, best at the far edge of the map.
5. **A hidden hofje** — an unassuming door in a brick wall off Oude Delft opens into a quiet
   green courtyard (the Klaeuwshofje pattern,
   [things-to-do guide](https://theorangebackpack.nl/en/netherlands/best-things-to-do-in-delft/)):
   the game's secret room. No signage; discovered or missed. Inside: total stillness, one tree,
   bench, birdsong-implied (visual: two sparrows), and the only place the mist never reaches.
6. **Molen de Roos** — the windmill on the western edge, sails turning slowly against the sky;
   the "edge of town" vista with polder light beyond.

### Secondary vocabulary (the "says Delft" filler layer)
- **Bicycles everywhere, riders nowhere**: leaned on every bridge rail and facade, 1–3 per house
  frontage, in cobalt, black and cream. The single cheapest Dutch signifier — ~60 triangles each.
- **Bridges over canals**: humped brick with stone caps + white-railed wooden ones; each bridge
  crest is a micro-vista (principle 7).
- **Delft Blue motifs**: cobalt shutters and doors; a shop window of porcelain plates (flat
  emissive-white discs with cobalt rings); one gable wall carrying a large blue-tile mural
  (procedural cobalt pattern on porcelain white) — the city's palette explained diegetically.
- **Canal boats**: low open sloops moored in rows, one slowly puttering, its wake breaking the
  sky reflection.
- **Gable typology discipline**: step, bell, neck and spout gables in the brick/cream ramps —
  silhouette variation at the roofline, not the facade.
- **TU Delft contrast note**: keep the historic core the game; at most, one clean modern
  glass-and-white sliver visible far to the south as a "the city continues" horizon note. Do not
  build the campus — it dilutes the mood.
- Life details: laundry line over a side alley (here it IS right); a bakery window glowing warm
  (the one emissive light in Delft — a beacon at the end of a shadowed street); milk-bottle
  doorsteps; a cat on a windowsill (12 triangles, tail flick); church bells "visible" as slow
  swinging silhouettes in the Nieuwe Kerk's belfry openings; heron standing on a mooring post;
  mist curls sliding along the canal surface and burning off near sunlit patches.

---

## (d) UI & typography — one system, two skins

Both games share the hero demo's brand chrome exactly: `ui-sans-serif` system stack, ink
`#E8EEF2` / `#9FB0BC` on `#070B11`-family surfaces, hairlines `rgba(159,176,188,.16)`, the brand
ease `cubic-bezier(.22,.61,.36,1)`, teal `#5FE3D0` as the interactive accent in BOTH games (UI
never adopts the city palettes — that's the sibling glue). Per the Firewatch principle and its
counter-warning ([Game Developer](https://www.gamedeveloper.com/design/how-firewatch-s-ui-enhances-player-immersion),
[minimal-HUD paradox](https://medium.com/@salamatizm/the-minimal-hud-paradox-how-dreams-of-diegetic-game-interfaces-often-lead-to-cluttered-nightmares-e9cf7fae9d73)):
zero persistent HUD, typography-only event overlays, and no attempt to fake diegetic props.

- **Title card**: on load, city name large (e.g. "ROTTERDAM", letterspaced 0.35em, weight 700)
  with a one-line subtitle in `--ink-2` ("Een nacht aan de Maas" / "Een ochtend in Delft"),
  over the live scene, fading out on first input.
- **Controls hint**: one line, bottom-center, small caps, `--ink-3`: "WASD / arrows — walk ·
  mouse — look · shift — stroll faster". Appears 1 s after the title fades, disappears forever
  after ~4 s of movement. Mobile: twin thumb zones hinted once with two soft circles. No
  on-screen buttons after that.
- **Location names**: entering a named place (vista points + a few streets/quays) fades in the
  Dutch name lower-third-left — small caps, 14–15px equivalent, letterspaced, hairline underline
  in teal, 500 ms in / hold 2.5 s / 700 ms out. Never two at once; renaming suppressed for 30 s
  per place. This is the *entire* wayfinding UI — no compass, no minimap (per principle 8's
  "markers destroy discovery").
- **Discovered-landmark state**: pressing Tab/long-press opens a translucent charcoal panel
  (backdrop-blur, hairline border): the city name and a simple list of the 6 hero vistas by
  Dutch name — undiscovered ones as `--ink-3` em-dashes ("— — —"), discovered ones in ink with a
  teal dot. No map, no percentages. Discovering the last one swaps the subtitle line to a single
  quiet completion phrase ("Je kent de stad." — *you know the city*). Nothing unlocks; knowing is
  the reward.
- **Discovery moment**: first arrival at a hero vista = location name in teal instead of ink +
  a 2 s hairline rule drawing itself under the name. No sound cues assumed, no particles, no
  badges.
- **Accessibility/fallback**: keep the hero demo's contract — `prefers-reduced-motion` freezes
  cloud-shadow/water animation speeds to near-zero (light story still readable as a still), and
  a styled static fallback card if WebGL is unavailable.

---

## (e) What would make this feel cheap — AVOID

1. **Pure black night sky / untinted black shadows.** Kills silhouettes (Rotterdam) and reads as
   unfinished (Delft). Sky is always a gradient; shadow is always a colored value from the ramp.
2. **Uniform window lighting.** A tower with every window the same warm yellow at the same
   brightness is the #1 "programmer city" tell. Randomize on/off (~35–60% lit at night), two
   temperatures, per-window brightness jitter, a few flickers — and in Delft, windows are
   *reflective, not emissive* (except the bakery).
3. **Accent-color inflation.** The moment a fourth accent hue appears (a random purple sign, a
   green door in Rotterdam), the palette discipline is dead. Every hue must be in the ramps above.
4. **Noise-texture "detail."** Procedural per-pixel noise on facades to fake texture reads as
   dirt. Detail lives in silhouette, window rhythm, and value steps — flat faces are the style.
5. **Mirror water / dead water.** A perfect planar reflection looks like a screenshot; zero
   reflection looks like tar. Water is stretched, shimmering vertical streaks under emissive
   sources (Rotterdam) or broken sky color + moving glitter (Delft), always animated.
6. **Fog as cover-up.** Cranking fog density to hide a small map reads instantly as cheap. Fog
   starts beyond the second sightline ring and is horizon-tinted (see principle 9); the map edge
   is *composed* (water, polder light, crane ranks), not smothered.
7. **Copy-paste rows.** Twenty identical gabled houses or towers at identical heights. Vary
   height ±15%, gable type, hue step, and window rhythm per instance — the hero demo's ~200
   varied canal houses already prove the method at low cost.
8. **HUD creep.** A compass, minimap, objective marker, "E — interact" prompts, or a persistent
   FPS/loading widget would undo the entire direction. If a thing needs a marker, redesign the
   sightline instead.
9. **Floaty player-camera.** Head-height must be honest (~1.7 m at the hero demo's 1 unit = 4 m
   scale), with gentle acceleration/deceleration, subtle (≤ 0.05 m) walk bob, clamped pitch, and
   collision that slides along walls. A camera that glides through bollards or strafes at
   constant velocity feels like a level editor, not a place.
10. **Over-effects.** Bloom halos on everything, lens flares, god-rays from every lamp,
    chromatic aberration. Each city gets its effects budget from its light story only: Rotterdam
    — soft emissive glow + reflection streaks; Delft — cloud shadows + water glitter + mist. Done.
11. **Landmark sameness across the two games.** If a screenshot of one could be mistaken for the
    other with a hue shift, the identities have failed. Test: grayscale screenshots should
    *still* be tellable apart (light-on-dark constellation vs dark-on-light silhouettes).
12. **Dead stillness.** A frozen frame reads as a render, not a place. Minimum life per frame:
    Rotterdam — water shimmer, one moving vessel or wake, beacon blinks; Delft — cloud-shadow
    drift, mist, glitter, windmill sails. All slow; nothing twitchy.

---

### Sources (primary)
- Townscaper: [Wikipedia](https://en.wikipedia.org/wiki/Townscaper) · [Stålberg's procedural-look notes](https://www.linkedin.com/pulse/how-make-procedural-generation-look-good-gabriele-romagnoli-vjihe)
- Monument Valley: [Creative Bloq — making of](https://www.creativebloq.com/computer-arts/making-monument-valley-71412213) · [GDC Vault](https://gdcvault.com/play/1020878/Designing-Monument-Valley-Less-Game)
- Sable: [Game Developer — readability](https://www.gamedeveloper.com/marketing/how-shedworks-refined-the-art-of-sable-in-pursuit-of-readability) · [GDC — The Art of Sable](https://gdcvault.com/play/1027721/The-Art-of-Sable-Imperfection)
- A Short Hike: [PlayStation Blog — behind the scenes](https://blog.playstation.com/2021/08/05/crafting-a-tiny-open-world-a-look-behind-the-scenes-at-the-creation-of-a-short-hike/) · [Lospec palette](https://lospec.com/palette-list/a-short-hike)
- Dorfromantik: [80.lv — minimalist design](https://80.lv/articles/how-dorfromantik-expands-its-cozy-world-through-minimalist-design) · Mini Motorways: [Game Developer](https://www.gamedeveloper.com/audio/-i-mini-motorways-i-and-the-delicate-art-of-marrying-complexity-and-minimalism)
- Kentucky Route Zero: [GDC — Scenography of KRZ](https://www.gdcvault.com/play/1020596/Scenography-of-Kentucky-Route)
- Wayfinding/weenies: [Game Design Snacks](https://game-design-snacks.fandom.com/wiki/Using_the_Environment_as_Weenies_-_aids_in_player_navigation) · [Level Design Book](https://book.leveldesignbook.com/process/blockout/wayfinding)
- Environmental storytelling: [Game Developer](https://www.gamedeveloper.com/design/environmental-storytelling) · [gamedesignskills.com](https://gamedesignskills.com/game-design/environmental-storytelling/)
- Firewatch UI: [Game Developer](https://www.gamedeveloper.com/design/how-firewatch-s-ui-enhances-player-immersion) · [minimal-HUD paradox](https://medium.com/@salamatizm/the-minimal-hud-paradox-how-dreams-of-diegetic-game-interfaces-often-lead-to-cluttered-nightmares-e9cf7fae9d73)
- Vermeer / View of Delft: [Mauritshuis](https://www.mauritshuis.nl/en/our-collection/artworks/92-view-of-delft) · [Essential Vermeer](https://www.essentialvermeer.com/cat_about/view.html) · [Smithsonian — morning light](https://www.smithsonianmag.com/smart-news/astronomy-offers-fresh-look-vermeers-view-delft-180975413/)
- Rotterdam identity: [EcoWebTown — Designing a Metropolis](https://www.ecowebtown.it/n_16/16_06-Castigliano-en.html) · [De Hef](https://www.kupi.com/en/explore/netherlands/rotterdam/koningshavenbrug-de-hef) · [Erasmusbrug](https://www.erasmusbrug.com/en) · [Luchtsingel — Dezeen](https://www.dezeen.com/2015/07/16/luchtsingel-elevated-pathways-bridges-rotterdam-cityscape-zus-architects/) · [Rotterdam architecture](https://all.accor.com/a/en/limitless/thematics/architecture-design/rotterdam-architecture.html)
- Delft identity: [Holland.com](https://www.holland.com/global/tourism/discover-the-netherlands/visit-the-cities/delft) · [Delft Blue](https://www.amsterdamexperience.net/post/delft-blue-dutch-ceramics) · [Oostpoort / Oude Kerk](https://www.eupedia.com/netherlands/delft.shtml) · [hofjes & sights](https://theorangebackpack.nl/en/netherlands/best-things-to-do-in-delft/)
