# V15 Vantage — handoff

Everything a fresh session needs to finish this without re-deriving anything.
Rewritten **2026-08-02**, then updated later the same day after the deploy.
Older copies described the AI-imagery build and are superseded in full.

> **Read this first.** The contrast audit was broken until 2026-08-02: sharp's
> `stats()` silently ignores `extract()`, so for every text element it returned
> the mean of the **whole 1440×900 page**, not the pixels behind that element.
> Every legibility number this project recorded before that date is void —
> including the 8.49:1 for the Home lede, and the 4.39:1 / 4.05:1 that got
> `delft-nieuwe-kerk` and `delft-canal` benched. Those two were benched on
> evidence that never existed; re-measure before ruling on them.

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

## 2. State as of 2026-08-02 (after the deploy)

**DEPLOYED** and live at https://180dc-variants.pages.dev/v15-vantage/ —
verified on a real GPU: WebGL layer up, no console errors, all 20 pooled image
assets serving `image/webp` at their exact byte sizes.

### Imagery: AI renders are gone

Board feedback rejected AI-generated backgrounds. All ten renders were retired
and replaced with photographs. The pool is now **five frames, three Rotterdam to
two Delft**, alternating city:

| # | Frame | Photographer | Licence | Opens on |
|---|---|---|---|---|
| 0 | `rotterdam-maas-night` | ClickerHappy | Pexels | **Home** |
| 1 | `delft-oostpoort-air` | Ludvig14 | CC BY-SA 4.0 | Mission |
| 2 | `markthal-blue-hour` | Radek Kucharski | CC BY 2.0 | For clients |
| 3 | `delft-oostpoort` | Michielverbeek | CC BY-SA 4.0 | Students |
| 4 | `erasmusbrug-harp` | Igor Passchier | Pexels | cycling only |

Frames 0 and 4 were added 2026-08-02 from **Pexels** — the first non-Commons
sources, so the licence genuinely varies per frame and the credit string must
carry it. `erasmusbrug-night` is now **benched**, not deleted.

Provenance is in `_brand/photo-set/SOURCES.json` (tracked — the PNG masters are
gitignored). `v15-vantage/MEDIA-CREDITS.md` **is now genuinely generated**, by
`tools/credits-v15.mjs`, from SOURCES.json plus the POOL in `hero-controller.js`
— so it cannot drift from the frames the page actually loads. (The previous
handoff claimed this was already true. It was not; the file was hand-written.
`node credits-v15.mjs --check` fails if it is stale.)

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

The three items the previous handoff listed are **done**: Home is fixed and
measurably legible, two Rotterdam frames were added, and the build is deployed.
What remains is one real problem, now visible for the first time because the
audit works.

1. **Three of the five frames still fail the worst-tile check.** This is not a
   regression — they always failed; the broken audit could not see it. Home
   (frame 1) and `erasmusbrug-harp` on desktop are clean. The rest:

   | Frame | Desktop | Mobile 390 |
   |---|---|---|
   | 1 `rotterdam-maas-night` | ✓ | ✓ |
   | 2 `delft-oostpoort-air` | meta 1.83 mean, headline 2.09 | meta, headline, lede |
   | 3 `markthal-blue-hour` | headline 2.29, lede 2.59 | lede 1.91 |
   | 4 `delft-oostpoort` | meta, headline, lede | meta, lede, 2nd CTA |
   | 5 `erasmusbrug-harp` | ✓ | lede 1.47 |

   **The binding constraint is the copy treatment, not the supply of
   photographs.** Sixteen candidates were screened; the only ones that clear the
   bar are dark night frames. A daylight photograph essentially cannot carry
   white 300-weight type at 19px with no scrim. Three routes, and this is a
   design decision the board owns, so it was **not** applied:
   - extend `.hero__blur`'s mask up the copy column — blur is already the
     design's sanctioned mechanism and it is what kills the high-frequency lit
     windows that break the worst tile;
   - tighten the text-shadows from wide-and-soft (`0 1px 16px`) to a dense
     1–2px halo. Note this will **not** move the audit numbers: WCAG contrast
     ignores text-shadow, so it improves the eye without improving the score;
   - accept a pool of night frames only.

2. **Re-measure the two frames benched on void numbers** — `delft-nieuwe-kerk`
   and `delft-canal`. See the banner at the top. Reinstating one is a POOL edit;
   their tiers and depth maps are still in `img/`.

3. **The gallery index still says "thirteen published design variants"** in its
   `<title>`; there are fifteen.

---

12. **Stock captions are not evidence of location.** A Pexels photo captioned
    "Erasmus Bridge Illuminated at Night in Rotterdam" is the Ba Son bridge in
    Ho Chi Minh City. It screened well and would have shipped as a Rotterdam
    frame on a Delft–Rotterdam site. Identify every candidate by eye against a
    known landmark before it goes anywhere near the pool.

13. **`reducedMotion: "reduce"` suppresses the WebGL depth layer.** Any Playwright
    context that sets it measures the CSS fallback. The contrast audit had it set
    and so was measuring the wrong compositing path as well as the wrong pixels.
    It was only ever there to freeze the Ken Burns pan, which no longer exists.

14. **The screener optimises contrast with no idea whether the frame is worth
    looking at.** An empty black sky scores perfectly. `screen-frames-v15.mjs`
    picked a near-empty crop of a portrait skyline shot at headroom 2.32. Always
    render the chosen crop with `preview-crop-v15.mjs` and look at it.

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
- **Verify the photograph is actually of the city it claims to be** (trap 12).

### Sourcing, as of 2026-08-02

Unsplash's search API needs a key this project does not have; its public
`napi` endpoint returns "Authorization required". **Pexels** works — search
pages are readable, and originals come from
`https://images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg` with no key.
Commons works through its normal `api.php`.

Screen candidates *before* wiring any of them in:

```bash
node screen-frames-v15.mjs <image…>      # worst-tile score against the real copy boxes
node preview-crop-v15.mjs <src> <out.png> [biasX] [biasY]   # then LOOK at it
```

The screener reproduces the hero framing offline and sweeps the crop bias. It is
deliberately pessimistic — it does not model `.hero__blur`, which lifts the lede
and everything below it — so a frame that screens well will measure at least as
well live. Rejected this session: an Allianz logo on a tower (brand signage), a
street-level Delfshaven frame (heavy foreground the depth shader would tear), and
the Ho Chi Minh City frame in trap 12.

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

2. **`sharp.stats()` ignores everything before it in the pipeline.**
   `sharp(buf).extract(region).stats()` returns stats for the *whole image*, not
   the region — silently, with no error. This is what void'd every legibility
   number in this project. If you need stats for a crop, read raw bytes and
   average them yourself: `.extract(r).raw().toBuffer({resolveWithObject:true})`.
   Verify any new use by extracting three obviously different regions and
   checking the numbers actually differ.

2b. **A mean is not a legibility measure even when it is measured correctly.** A
   skyline of lit windows averages out against the dark gaps between them and
   scores 9.7:1 while a word sitting on a lit window is unreadable. The audit now
   tiles each element at roughly glyph scale (`fontSize × 0.8`) and gates on the
   **worst tile** at 0.8 × AA, printing mean and worst side by side — the gap
   between them is the diagnosis. Trust your eyes over the mean; the worst tile
   agrees with your eyes.

2c. **Measure mobile.** A 390px viewport cover-crops a 3:2 photograph to roughly
   its central quarter, so a frame can be calm behind the copy at 1440 and put
   that same copy on its busiest band on a phone. `erasmusbrug-harp` passes
   desktop at 3.16 and fails mobile at 1.47 — it was very nearly shipped as the
   Home frame on desktop evidence alone. The audit now runs both viewports.

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
node audit-v15-hero-contrast.mjs  # real pixels behind hero copy, every frame,
                                  # desktop + mobile, mean AND worst tile.
                                  # Serves its own origin on 8734 and launches a
                                  # real GPU, so it measures the shader. Currently
                                  # RED on frames 2/3/4 — pre-existing, see §3.
node audit-v15-depth.mjs          # WebGL over HTTP + clean degradation on file://

# assets
node prep-v15.mjs                 # 3 WebP tiers per frame
node depth-v15.mjs --all          # depth maps (~3s/frame)
node credits-v15.mjs              # regenerate MEDIA-CREDITS.md (--check to verify)

# ship
node thumb-v15.mjs "http://localhost:8099/index.html"
node build-dist.mjs
./deploy-cf.ps1                   # PowerShell; reads the token from website/.env
```

Adding a photograph: screen it first (§4), then download the original, crop to
3:2 at 2400×1600, drop it in `_brand/photo-set/`, add it to **both**
`prep-v15.mjs` and `depth-v15.mjs`, add a POOL entry in `hero-controller.js` with
`file` / `city` / `label` / `credit` / `alt`, add a `SOURCES.json` record, then
run prep, depth, `credits-v15.mjs`, and the contrast audit. Set `tone: "light"`
if the contrast audit says so. The credit string must name a licence the r3 audit
recognises (`CC0`, `CC BY…`, `Public domain`, `Pexels License`, `Unsplash
License`).

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
