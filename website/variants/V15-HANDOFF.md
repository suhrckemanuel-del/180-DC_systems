# V15 Vantage — handoff

Everything a fresh session needs to finish this without re-deriving anything.
Written 2026-07-28.

---

## 1. What this is

`website/variants/v15-vantage/` — the fifteenth design variant in a gallery of
fifteen. The gallery (`website/variants/gallery/index.html`) exists so the 180DC
Delft–Rotterdam board can pick one direction. **V15 is a candidate, not the
final site.**

Six pages: `index.html`, `for-clients.html`, `mission.html`, `for-students.html`,
`guide.html`, `styles.css`.

---

## 2. Constraints — what changed

The original brief said "vanilla only, zero build step, non-negotiable." **The
owner lifted that on 2026-07-28** ("I forgot about these guardrails, install
everything we need").

Still true and worth keeping:

- **Under 1 MB per page.** Currently 125 KB on Home. The gallery's comparison
  table ranks all fifteen variants on weight; blowing this makes V15
  incomparable to V1–V14 on the axis the gallery exists to measure.
- **`build-dist.mjs` copies 15 directories flat.** Anything needing a compile
  step means changing shared deployment infrastructure for 1 of 15.
- **Content parity + honesty ledger** (see §6). Non-negotiable for real reasons.

Now allowed, and already vendored in `v15-vantage/vendor/` (plain `<script>`,
no bundler):

| File | gzip | Use |
|---|---|---|
| `gsap.min.js` | 27 KB | animation |
| `ScrollTrigger.min.js` | 17 KB | `pin: true` — robust pinning, survives resize |
| `lenis.min.js` | 4 KB | smooth scroll |

**Recommendation: do NOT add three.js.** The hero renders *one fullscreen quad
with one fragment shader*. three.js is ~150 KB gzipped of scene graph, camera
and material systems we would use none of. `hero-depth.js` (~700 lines) already
does this at a measured 60fps. The reference component the owner shared needs
three.js because it builds real geometry (5,000 stars, mountain meshes) — we
don't.

**If a full React/Next/Tailwind build is wanted, build it at `website/app/`,
not as variant sixteen.** That keeps the fifteen-way comparison intact.

---

## 3. Credentials and tooling — already set up

- **`website/.env`** (gitignored at `.gitignore:35`) holds `FAL_KEY`,
  `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
  Owner said keys will be rotated after the session — don't treat as secret
  long-term, but never commit them.
- **fal.ai balance: ~$23.77** (started $25, three video generations).
  Check: `curl -H "Authorization: Key $FAL_KEY" https://rest.alpha.fal.ai/billing/user_balance`
- **ffmpeg installed** but not on PATH in a fresh shell:
  ```
  export PATH="$PATH:/c/Users/Manuel/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.2-full_build/bin"
  ```
- **`@huggingface/transformers`** installed in `tools/` (depth maps, no PyTorch).
- **playwright + sharp + lighthouse** already in `tools/node_modules`.

**The owner's credits are limited. Never batch-generate video without showing
one result first.** Real cost is **$0.62 per 5s clip**, not the $0.25 first
estimated.

---

## 4. Current state — what works, verified

**Hero stack, highest tier first.** Each falls back cleanly to the next:

1. **Depth hero** (`hero-depth.js`) — plain WebGL. Renders the photo through a
   depth map (Depth Anything V2, generated offline). Parallax, autonomous
   drift, water ripple, highlight twinkle, and a scroll-driven dolly.
   Measured 16.6 ms median frame time on the owner's GPU, 0% frames over budget.
2. **CSS fallback** — image scales on the same `--hero-p` progress value.
3. **Static frame** under `prefers-reduced-motion` (verified 0.0% pixel change).

**Scroll choreography** — native CSS `animation-timeline: view()`, no JS.
Section heads, cards, timeline steps, team tiles reveal on entry and stagger
themselves. Hero pins for a two-viewport runway and dollies in. Progress UI
(SCROLL + rail + live %). Verified nothing is ever left stuck invisible.

**Image pool** — 8 frames, each with a depth map (~2 KB) and three widths
(900 / 1600 / 2400). Prev/next cycles all 8 on every page with decode-before-swap.

**Lighthouse**: a11y / best-practices / SEO **100 on all five pages**;
performance 91–100 (one cold-launch 48 outlier).

**Five audit suites, all passing:**
```
cd website/variants/tools
node audit-v15.mjs              # effects wiring, cycling, no-JS, overflow, weight
node audit-v15-r2.mjs           # smoothness, a11y, contrast, focus, targets
node audit-v15-r3.mjs           # parity, terminology, disclosure, links
node audit-v15-hero-contrast.mjs # samples real pixels behind hero copy, all 8 frames
node audit-v15-depth.mjs        # WebGL over HTTP + clean degradation on file://
```

**Serve it** (WebGL needs a real origin — see trap 3):
```
cd website/variants/v15-vantage && node -e "const h=require('http'),f=require('fs'),p=require('path');const T={'.html':'text/html;charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.mp4':'video/mp4'};h.createServer((q,r)=>{let x=p.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));if(q.url==='/')x=p.join(process.cwd(),'index.html');f.readFile(x,(e,d)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'Content-Type':T[p.extname(x)]||'application/octet-stream','Cache-Control':'no-cache'});r.end(d)})}).listen(8080,()=>console.log('http://localhost:8080'))"
```

---

## 5. Decisions — owner ruled 2026-07-28

**RULED: the fog is rejected. A clear, high-quality image is the top priority.**
Owner's words: *"we just don't need it that much... it's better to have a clear
image, like, for high quality image. That's the most important thing."*

This is bigger than the one clip, because **clarity and video are in direct
tension**, and the ranking has now flipped:

- The shipped clips are 1280×720 H.264 at ~200–320 KB. That is **materially
  softer** than the still they replace — the 2400 px WebP tier is ~57 KB and
  far sharper. Video buys motion by spending exactly the thing the owner just
  said matters most.
- The **WebGL depth hero moves the full-resolution still** — motion at no cost
  to sharpness. It is the only option that satisfies both.

**Therefore:**

1. **Do not regenerate the bridge clip to fix the fog.** Fixing it would cost
   $0.62 to produce an asset that is still softer than the still.
2. **Do not wire video in as the top hero tier.** The depth hero is the primary
   treatment. Leave `media/*.mp4` on disk, unreferenced, pending a decision to
   use them somewhere lower-stakes (an inline section band, say) or drop them.
   **Spend no further credits on video without asking.**
3. **Image quality is now the active workstream.** Sources are 1536×1024 native
   — the real ceiling. Upscaling barely helped (swin2SR tested: ~14 min/image
   for a marginal gain over lanczos). The genuine fix is **regenerating the
   eight frames at 2K+** via Nano Banana Pro or Flux Ultra on fal (~$0.06 each,
   ~$0.50 total). Confirm the model and show one before doing all eight.
   Regenerate depth maps afterwards (`node depth-v15.mjs --all`, ~30s) and
   re-run `prep-v15.mjs`.

Still open:

4. **Scroll choreography has not had the owner's eyes on it.**

---

## 6. Honesty rules — do not break these

Every background image is **AI-generated** and this is disclosed in every page
footer, linking to the ledger in `guide.html#images`. If images are regenerated
or replaced, **update the ledger**. If real photography ever replaces them,
credit the photographer and licence in the shape `v14-confluence/MEDIA-CREDITS.md`
uses, and delete the AI disclosure only when no generated image remains.

Placeholders are deliberate and must stay visible: case studies, team portraits,
testimonials, partner logos, intake form, events, impact numbers, member area.
**Never fill these with invented content.**

Terminology (`_brand/BRAND.md`): "Consultant / Team Leader" — the brief and
V14 both use *Team Leader*, which diverges from BRAND.md's table calling for
*Project Manager*. **Flagged to the owner, unresolved.** Banned everywhere:
"pro bono", "free", "€0", "chapters", "180Degrees", wrong email domain.
`audit-v15-r3.mjs` enforces this by pattern — and it scans `guide.html` too,
so describe the rules there rather than quoting the forbidden words.

---

## 7. Traps — these already cost a debugging cycle each

1. **`overflow: hidden` on an ancestor silently disables `position: sticky`**
   on descendants. `.hero` had it; the pinned stage scrolled away and the next
   section read as "the hero went black."
2. **`uZoom` in the shader is inverted.** It divides the cover factor, so
   *larger = wider*. Dollying in means *decreasing* it. Getting this backwards
   sampled far outside the texture and clamped the frame to black.
3. **WebGL textures cannot be built from `file://` images**, and
   `texImage2D` does **not** reliably throw — it sometimes silently yields a
   black texture. Never trust the exception: `hero-depth.js` renders one frame
   while the canvas is still detached and reads pixels back before attaching.
4. **`scroll-behavior: smooth` defeats per-frame `scrollTo()` in tests** — each
   call restarts the animation, so the page never moves and the test finishes at
   `scrollY 0`. Use `scrollTo({top, behavior: "instant"})`. This made round 2's
   smoothness check pass vacuously for days.
5. **Size the canvas to `.hero__media`, not `.hero`.** On a staged hero the
   section is two viewports tall; measuring it doubled the drawing buffer and
   squashed the photo.
6. **Don't share a rAF `ticking` flag between the scroll handler and a
   self-scheduling ease** — the ease stops one frame in and freezes part-way,
   which looks exactly like a mis-measured runway.
7. **`innerText` reflects `text-transform`**, so uppercase UI rows read as
   missing in content checks. Compare case-insensitively.
8. **Scroll the page before asserting lazy images loaded**, or footer art
   reports as failed.
9. **Video: `end_image_url` pinned to the source bounds grade drift** and gives
   a near-seamless loop for free (loop seam went 49.5 → 2.65). Without it the
   model burns off fog and saturates the sky into a tourist postcard.
10. **Seedance over Kling for architecture** — `camera_fixed: true` is the
    decisive parameter; it stops the model inventing a camera move and warping
    the landmark. Kling has no equivalent.

---

## 8. Definition of done

- [ ] Fog decision made; video wired in as the top tier with clean fallback
- [ ] Owner has scrolled the choreography and signed off
- [ ] `_review.html` deleted (already done), `media/_compare-*` removed
- [ ] `guide.html` build record updated with any new rounds + the video ledger
- [ ] Gallery card, comparison row and thumbnail regenerated (`node thumb-v15.mjs`)
- [ ] All five audit suites green
- [ ] `node build-dist.mjs` run, `dist/v15-vantage/` verified
