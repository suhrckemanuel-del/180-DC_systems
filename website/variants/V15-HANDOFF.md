# V15 Vantage — handoff

Everything a fresh session needs to continue without re-deriving anything.
Rewritten **2026-08-12**. Supersedes all earlier versions in full.

- **Production:** https://180dc-variants.pages.dev/v15-vantage/ — current.
- **Board preview:** https://board-review.180dc-variants.pages.dev/v15-vantage/for-clients#work
  — the real-slides comparison. Deliberately not production.

---

## 1. What this is

`website/variants/v15-vantage/` — one of fifteen design variants in a gallery the
180DC Delft–Rotterdam board will use to pick a direction. **V15 is the leading
candidate, not yet the final site.**

Files: `index.html`, `for-clients.html`, `mission.html`, `for-students.html`,
`guide.html`, `styles.css`, plus `hero-controller.js`, `hero-depth.js`,
`case-gallery.js`, `mailto-pop.js`. `guide.html` has no hero.

---

## 2. State as of 2026-08-12

Branch `idea/reviewer-v2`, merged to `main` and pushed. Production matches.

### Hero photography — five frames, all licensed

| Pool | Frame | Photographer | Licence | Opens on |
|---|---|---|---|---|
| 0 | `rotterdam-maas-night` | ClickerHappy | Pexels | Home |
| 1 | `delft-oostpoort-air` | Ludvig14 | CC BY-SA 4.0 | Mission |
| 2 | `markthal-blue-hour` | Radek Kucharski | CC BY 2.0 | For clients |
| 3 | `delft-oostpoort` | Michielverbeek | CC BY-SA 4.0 | Students |
| 4 | `erasmusbrug-harp` | Igor Passchier | Pexels | cycling only |

Three Rotterdam, two Delft. Provenance in `_brand/photo-set/SOURCES.json`;
`MEDIA-CREDITS.md` is generated from it by `tools/credits-v15.mjs`, which did not
exist before and is why the ledger can no longer drift from what ships. Benched
but still buildable: `erasmusbrug-night`, `delft-nieuwe-kerk`, `delft-canal`.

The hero is still until you scroll. `.hero__blur` is a bottom-only masked blur:
full to 42% of frame height, clear by 66%, radius 18px. It is blur, never a
scrim, and the photograph is not tinted anywhere.

### Case studies — rebuilt exhibits on production

`for-clients.html#work`: five cards opening a modal with rebuilt HTML exhibits.
Each is led by an **action title**, a claim rather than a label, which is the
main craft gap the reviewer found across every source deck.

**Nothing on this site is AI-generated.** These are hand-rebuilt from real
engagements, anonymised, and labelled as rebuilt for the web.

### Client contact

No form. Five Consulting Directors named with `@180dc.org` addresses shown as
text. Clicking any email link opens a popover with the address, a copy button and
one-click drafts in Gmail, Outlook or the mail app.

### Students

`for-students.html#apply` publishes what the application asks for (CV, motivation
letter, transcript, LinkedIn) and how selection works: a paper screen, then two
interviews — behavioural-and-a-slide, then a case. The form is live but not
linked; a `<details>` gate explains why and points at Instagram and LinkedIn.
Go-live steps: `v15-vantage/RECRUITMENT-GO-LIVE.md`.

---

## 3. Open items

1. **Client consent.** No `PUBLIC-OK.md` exists for any of the five clients. Real
   deliverable slides cannot reach production until one does. The email is
   written: `portfolio-workbench/consent-request-email.md`.
2. **The board decides rebuilt versus real slides.** Comparison on the preview
   URL above. If real wins, start from
   `portfolio-workbench/OFFLOAD-PROMPT-real-slides.md`, written for a cold
   session. It notes that the source decks are **not** in this checkout.
3. **Three hero frames fail contrast** on the meta line and headline: both Delft
   daylight frames and Markthal. They sit above the blur zone by design. The
   untested fix is `data-tone: "light"`, which flips to dark type on bright
   photographs.
4. **Recruitment dates.** `RECRUITMENT-GO-LIVE.md` cannot ship without a real
   closing date.
5. **GitHub exposure, unresolved.** 18 real client slide renders, client names in
   the filenames, are committed to `wip/case-study-gallery-private-content`, and
   the repository is **public**. Rewriting that branch's history is the only
   removal, and anything cloned meanwhile keeps a copy.

---

## 4. Rules the owner set

- **Terminology: "Consultant / Team Leader".** Ruled 2026-08-12: Team Leader is
  this branch's own name for the role. `_brand/BRAND.md` records that the global
  180DC table prefers "Project Manager"; **branch usage wins and is not to be
  corrected.** Still banned: "pro bono", "free", "€0", "chapters", "180Degrees",
  any email domain other than `180dc.org`.
- **No AI imagery, ever.** Every photograph credited: photographer and licence in
  the hero, full record in `MEDIA-CREDITS.md` and `guide.html#images`.
- **Placeholders stay visible, never filled with invented content.** Team
  portraits, partner logos, events, impact numbers, member area.
- **No personal contact details on public pages.** Board emails are `@180dc.org`
  role addresses only; personal Gmail addresses and mobile numbers were
  deliberately excluded.
- **Image selection:** no identifiable people, no close crops, no prominent
  third-party brand signage, no seasonal decoration, must survive a 390px crop
  showing the central ~26%.

---

## 5. Traps — every one of these cost a debugging cycle

1. **`sharp.stats()` ignores `.extract()`.** It returns whole-image statistics for
   any region you ask for. This is why every legibility number before 2026-08-02
   was void: the contrast audit measured the average brightness of the whole page
   for every text element. Any pixel measurement must read raw bytes.
2. **A mean is not a legibility measure.** A skyline of lit windows averages out
   against the dark gaps and scores well while reading badly. The audit now tiles
   at glyph scale and gates on the worst tile.
3. **Cloudflare Pages returns HTTP 200 for missing assets**, serving an HTML
   fallback of constant size. Verify by `content_type` with a cache-buster, never
   by status code. Production silently reverted to a months-old build once and
   every asset still answered 200.
4. **`build-dist.mjs` copies `website/variants/v*/` wholesale.** Anything under a
   variant directory ships. Client renders live in `_case-candidates/`, outside
   that glob and gitignored, for exactly this reason.
5. **The audits pass while the hero is visibly broken.** Headless defaults to
   SwiftShader, which trips the depth layer's performance guard, so checks measure
   the CSS fallback. Launch with
   `["--use-gl=angle","--use-angle=default","--enable-unsafe-swiftshader"]`, and
   note `reducedMotion: "reduce"` also suppresses the shader.
6. **A `mailto:` does nothing** for anyone without a desktop mail client. It is
   why a CTA looked broken while its markup was perfect, and why `_links.mjs`
   passing means a href is well-formed, not that clicking it works. `_links.mjs`
   skips `mailto:` entirely.
7. **`minmax(Npx, 1fr)` in an auto-fit grid overflows** any container narrower
   than N. Use `minmax(min(Npx, 100%), 1fr)`. Caught by the 320px check.
8. **`audit-v15-r3.mjs` asserts a placeholder count per page.** Adding or removing
   one fails the suite until `expectPlaceholders` is updated. Deliberate.
9. **`prep-v15.mjs` and `depth-v15.mjs` hold separate source lists.** Edit both. A
   depth map from one photograph applied to another is a silent failure.
10. **`data-tone` and the credit apply at the opacity swap, not at click time.**
11. **Audits must derive frame names and counts from `hero-controller.js`.**
12. **`$PSScriptRoot` is empty** in an inline PowerShell command. Read
    `website/.env` by absolute path when setting the Cloudflare token by hand.
13. **A valueless attribute reads as `""` through `dataset`**, which is falsy. Use
    `hasAttribute`, or every wired control looks dead.

---

## 6. How to run it

```bash
# serve (WebGL needs a real origin; file:// cannot build textures)
cd website/variants/v15-vantage
node -e "const h=require('http'),f=require('fs'),p=require('path');const T={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp'};h.createServer((q,r)=>{let x=p.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')x=p.join(process.cwd(),'index.html');f.readFile(x,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':T[p.extname(x)]||'application/octet-stream','Cache-Control':'no-cache'});r.end(d)})}).listen(8099,()=>console.log('http://localhost:8099'))"

# suites — ONE AT A TIME, they share ports
cd ../tools
node audit-v15.mjs                # wiring, no-JS, 320px overflow, page weight
node audit-v15-r2.mjs             # smoothness, a11y, contrast, focus, targets
node audit-v15-r3.mjs             # parity, terminology, credits, placeholder counts
node audit-v15-hero-contrast.mjs  # real pixels behind hero copy, both viewports
node audit-v15-depth.mjs          # WebGL over HTTP, degradation on file://
node _links.mjs                   # every link and button resolves

# assets
node prep-v15.mjs                 # 3 WebP tiers per frame
node depth-v15.mjs --all          # depth maps (~3s/frame)
node credits-v15.mjs              # regenerate MEDIA-CREDITS.md (--check to verify)

# ship
node thumb-v15.mjs "http://localhost:8099/index.html"
node build-dist.mjs
./deploy-cf.ps1                   # production. Reads website/.env
```

Preview deploy, for anything not consent-cleared:

```powershell
npx wrangler pages deploy ..\dist --project-name 180dc-variants --branch board-review --commit-dirty=true
```

Adding a photograph: crop to 3:2, drop in `_brand/photo-set/`, add to **both**
`prep-v15.mjs` and `depth-v15.mjs`, add a POOL entry in `hero-controller.js`,
update `SOURCES.json`, then run prep, depth, `credits-v15.mjs` and the contrast
audit. **`data-hero-start` is a pool index** — inner pages open on 1, 2 and 3, so
append rather than insert. Each page repeats its filename in three places: `src`,
`srcset`, and a `<link rel="preload" imagesrcset>` in `<head>`.

---

## 7. Credentials

`website/.env` (gitignored) holds `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
and `FAL_KEY`. fal is unused; image generation is retired.

---

## 8. Known, not scheduled

`hero-depth.js`'s `teardown()` leaks: it never removes its `resize` listener and
never calls `deleteTexture`/`deleteProgram`/`loseContext`, so four textures
survive. `upload()` never checks `gl.getError()`. `hero-controller.js`'s resize
handler does not recompute `--hero-p`. None breaks the page in normal use.

An art-direction review is recorded in memory and **not applied** — it changes
design intent and is the board's call: a dead second viewport of hero, two
competing nav treatments, the cycling control carrying near-CTA weight, the h1
rag, and mobile hero density.

Session memory lives in
`C:\Users\Manuel\.claude\projects\c--Users-Manuel-180-DC-systems\memory\`.
