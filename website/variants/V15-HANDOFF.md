# V15 Vantage — handoff

Everything a fresh session needs to finish this without re-deriving anything.
Rewritten **2026-08-02**. The previous version described the AI-imagery build and
is superseded in full — do not trust older copies.

---

## 1. What this is

`website/variants/v15-vantage/` — one of fifteen design variants in a gallery the
180DC Delft–Rotterdam board will use to pick a direction. **V15 is a candidate,
not the final site.**

Six files: `index.html`, `for-clients.html`, `mission.html`, `for-students.html`,
`guide.html`, `styles.css`, plus `hero-controller.js` and `hero-depth.js`.
Only four pages have a hero — `guide.html` has none.

Gallery: `website/variants/gallery/index.html`, live at
**https://180dc-variants.pages.dev/**

---

## 2. State as of 2026-08-02

Committed at **`183d418`** on branch `idea/reviewer-v2`, pushed.
**NOT DEPLOYED** — the live Pages site still serves the old AI build. That is
deliberate; nothing half-finished is public.

Two large changes landed this session.

### Imagery: AI renders are gone

Board feedback rejected AI-generated backgrounds. All ten renders were retired
and replaced with **four licensed Wikimedia Commons photographs**:

| Frame | Photographer | Licence | Opens on |
|---|---|---|---|
| `erasmusbrug-night` | CyberDiver79 | **CC0** | Home |
| `delft-oostpoort-air` | Ludvig14 | CC BY-SA 4.0 | Mission |
| `markthal-blue-hour` | Radek Kucharski | CC BY 2.0 | For clients |
| `delft-oostpoort` | Michielverbeek | CC BY-SA 4.0 | Students |

Provenance is in `_brand/photo-set/SOURCES.json` (tracked — the PNG masters are
gitignored). `v15-vantage/MEDIA-CREDITS.md` is **generated from it**, so credits
cannot drift from what was actually downloaded. Regenerate it rather than editing
it by hand.

The hero names the photographer and licence of the frame on screen, and it
changes as you cycle. It has to be per-frame: one static footer line cannot
honestly credit four different photographers.

### Motion: the hero is still until you scroll

Owner's call — no video-like movement, no ripple, a clear image. Removed: the
autonomous orbit, pointer parallax, water ripple, highlight twinkle, breathing
zoom, and `hero-depth`'s own scroll listener. What remains is depth-weighted
displacement driven by scroll progress.

That freed the zoom margin those effects reserved, so `uZoom` went **0.85 →
0.97**: the hero samples 97% of the texture instead of 85%, which is less
magnification and a sharper image.

Measured on a real GPU, copy hidden, 1440×900 DPR 1:
`0.00%` of pixels change over 2s at rest · edge activity 0.12–0.91 at both edges
(0.000 would be clamped smear) · `85.9%` change on scroll.

---

## 3. Open items — start here

1. **The Home hero's lede is hard to read.** It sits on the illuminated skyline
   of the Erasmusbrug night shot. Owner has seen it and called it acceptable for
   now, to fix properly. Three routes: swap Home to the Oostpoort aerial (which
   demonstrably reads well), re-crop the Erasmusbrug so the darker right bank
   falls behind the copy column, or source another Rotterdam night frame.

2. **Rotterdam is under-represented — 1 frame against 3 Delft**, for a
   Delft–Rotterdam branch. Commons has very few clean, people-free, wide
   Rotterdam shots. **Unsplash and Pexels have not been searched yet** — only
   Commons was. That is the obvious next move.

3. **Deploy.** `node thumb-v15.mjs`, `node build-dist.mjs`, then
   `tools/deploy-cf.ps1`. Verify with a cache-buster (see trap 6).

Two frames are **benched, not deleted**: `delft-nieuwe-kerk` and `delft-canal`.
Both failed WCAG AA behind the hero copy in *both* light and dark type — the
dark-type treatment made it worse, 4.39:1 → 4.05:1 — because of busy mid-tone
rooftops, and this design forbids a scrim. Their tiers and depth maps are still
in `img/`, so reinstating them is a POOL edit if the copy layout ever changes.

---

## 4. Image selection rules the owner set

- **No identifiable people.** No close crops. Wide views where everything reads.
- **No prominent third-party brand signage.** An Erasmusbrug frame was rejected
  for KPN and bank logos — the same reason V13 rejected port frames with Maersk
  and Evergreen liveries.
- **No seasonal decoration.** A Markthal frame was rejected for a neon Christmas
  tree that dated it to December.
- **Composition must survive a brutal mobile crop.** At 390px the hero shows only
  the **central ~26%** of a 3:2 image.
- Sources must be free-licence and verifiable. On Unsplash beware **Unsplash+ /
  Getty** images — those are a separate paid licence, so check per image.

---

## 5. Honesty rules — do not break these

- **No image on this site is AI-generated any more.** Do not reintroduce
  generated imagery without also reinstating the disclosure everywhere.
- **Every photograph is credited** — photographer and licence in the hero, full
  record in `MEDIA-CREDITS.md` and the ledger at `guide.html#images`.
- **Licence obligations are inherited.** One frame is CC0. The rest are CC BY or
  CC BY-SA; for share-alike frames the cropped, compressed derivative shipped in
  `img/` is itself under the same licence. Credit every image regardless of
  whether its licence compels it.
- **`audit-v15-r3.mjs` now asserts the opposite of what it used to.** A credit
  must be present on every page, every pooled frame must carry a licence string,
  and no page may claim in the present tense that the imagery is generated. The
  check deliberately allows the guide's past-tense record of what was replaced
  and why — pushing a page to hide its own history is the opposite of the point.
- **Placeholders stay visible and must never be filled with invented content:**
  case studies, team portraits, testimonials, partner logos, intake form, events,
  impact numbers, member area.
- Terminology: **"Consultant / Team Leader"**. Banned: "pro bono", "free", "€0",
  "chapters", "180Degrees", any email domain other than `180dc.org`.

---

## 6. Traps — each of these cost a debugging cycle

1. **The audits can pass while the hero is visibly broken.** Headless runs on
   SwiftShader, which trips the layer's own performance guard within about a
   second, so every check after that measures the CSS fallback rather than the
   shader. This is exactly how a cover-fit bug that smeared a fifth of the frame
   shipped through five green suites. **Always look at a real-GPU screenshot**:
   launch with `["--use-gl=angle","--use-angle=default","--enable-unsafe-swiftshader"]`.

2. **The contrast audit measures a *mean*, not a worst case.** A skyline of lit
   windows averages out against the dark gaps between them and scores 8.49:1
   while reading badly — which is precisely the Home-hero problem in §3. A
   worst-tile check would catch it and is a cheap change to
   `audit-v15-hero-contrast.mjs`. Trust your eyes over the number.

3. **`coverFor()` must return the ratio, not its reciprocal.** `fit()` divides,
   so the sampled span is `uZoom / cover`; a cover-fit crop needs `cover` above
   1. Getting it inverted made the shader clamp and repeat the border texel.
   Detect it by measuring column-to-column variation near each edge — clamped
   smear reads as *exactly* 0.000.

4. **Keep the zoom budget.** Sampled half-span is `uZoom / 2`; `uZoom / 2 +
   max|shift|` must stay under 0.5 or the clamp smears the border.

5. **`prep-v15.mjs` and `depth-v15.mjs` hold separate copies of the source
   list.** Edit both. A depth map inferred from one photograph and applied to
   another is a silent, invisible failure.

6. **Cloudflare Pages returns HTTP 200 for missing assets** (it serves an HTML
   fallback), and caches HTML. Verifying a deploy by status code proves nothing —
   check `content_type`, and append a cache-buster. This is how a missing V13
   thumbnail hid for weeks.

7. **`data-tone` and the credit apply at the opacity swap, not at click time.**
   Applied at click, they described a photograph that was still a decode plus a
   620ms crossfade away.

8. **The credit sits outside `.city-switch__now`**, which is `aria-live` —
   otherwise every cycle announces photographer and licence over the place name.

9. **Audits must derive frame names and counts from `hero-controller.js`.** Four
   of them hardcoded the old pool. One hardcoded `"blue-hour"` and would have
   silently matched the new `markthal-blue-hour` — the wrong frame.

10. **Photographs are 2–3× heavier than the AI renders were.** The 2x tier went
    48–283 KB to 327–582 KB. This is not an encoder setting: q74 → q58 saves only
    21% and costs visible detail. Still inside the 1 MB budget. Correct the
    published weight figures rather than degrading the images.

11. **`renderedSomething()`** requires >8/255 contrast in two horizontal strips at
    40% and 68% of canvas height. A genuinely low-contrast photograph would fail
    it and the depth hero would **silently not mount**, with no error anywhere.

---

## 7. How to run it

```bash
cd website/variants/tools

# serve the variant (WebGL needs a real origin — file:// cannot build textures)
cd ../v15-vantage && node -e "const h=require('http'),f=require('fs'),p=require('path');const T={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp'};h.createServer((q,r)=>{let x=p.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')x=p.join(process.cwd(),'index.html');f.readFile(x,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':T[p.extname(x)]||'application/octet-stream','Cache-Control':'no-cache'});r.end(d)})}).listen(8099,()=>console.log('http://localhost:8099'))"

# the five suites — run them ONE AT A TIME, they share a port
node audit-v15.mjs                # effects wiring, cycling, no-JS, overflow, weight
node audit-v15-r2.mjs             # smoothness, a11y, contrast, focus, targets
node audit-v15-r3.mjs             # parity, terminology, PHOTO CREDITS, links
node audit-v15-hero-contrast.mjs  # real pixels behind hero copy, every frame
node audit-v15-depth.mjs          # WebGL over HTTP + clean degradation on file://

# assets
node prep-v15.mjs                 # 3 WebP tiers per frame
node depth-v15.mjs --all          # depth maps (~3s/frame)

# ship
node thumb-v15.mjs "http://localhost:8099/index.html"
node build-dist.mjs
./deploy-cf.ps1                   # PowerShell; reads the token from website/.env
```

Adding a photograph: download the original, crop to 3:2, drop it in
`_brand/photo-set/`, add it to **both** `prep-v15.mjs` and `depth-v15.mjs`, add a
POOL entry in `hero-controller.js` with `file` / `city` / `label` / `credit` /
`alt`, then run prep, depth, and the contrast audit. Set `tone: "light"` if the
contrast audit says so. Update `SOURCES.json` and regenerate `MEDIA-CREDITS.md`.

**`data-hero-start` is a pool index.** Inner pages open on 1, 2 and 3. Inserting
mid-array silently changes which frame those pages open on — append, or update
all four pages. Each page also repeats its filename in **three** places: `src`,
`srcset`, and a `<link rel="preload" imagesrcset>` in `<head>`.

---

## 8. Credentials

`website/.env` (gitignored at `.gitignore:35`) holds `FAL_KEY`,
`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. fal is no longer needed — image
generation is retired — but the balance was ~$21.81 when last checked.

---

## 9. Also known, not scheduled

`hero-depth.js`'s `teardown()` still leaks: it never removes its `resize`
listener and never calls `deleteTexture`/`deleteProgram`/`loseContext`, so four
textures (~18–41 MB VRAM) survive indefinitely. `upload()` never checks
`gl.getError()`. `hero-controller.js`'s resize handler does not recompute
`--hero-p`. None breaks the page in normal use.

An art-direction review is recorded in memory and **not applied** — it changes
design intent and is the board's call: a dead second viewport of hero, two
competing nav treatments, the cycling control carrying near-CTA weight, the h1
rag, and mobile hero density at 754 of 844px.

Session memory lives in
`C:\Users\Manuel\.claude\projects\c--Users-Manuel-180-DC-systems\memory\`.
