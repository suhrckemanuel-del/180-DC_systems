/* ==========================================================================
   V15 Vantage — depth hero ("living still")

   Upgrades the hero photograph from a flat pan into a moving image, using a
   depth map generated offline by Depth Anything V2 (see tools/depth-v15.mjs).
   Plain WebGL — no Three.js, no framework, no build step, ~2 KB of depth map
   per frame and no video file anywhere.

   What actually moves:
     - parallax  the scene is displaced by depth, so the pylon, the deck and
                 the far skyline separate and slide against each other as you
                 scroll or move the pointer. This is the "3D" of the effect.
     - drift     a slow autonomous camera orbit, so the image is alive even
                 when the visitor does nothing at all
     - water     a ripple confined to the near, low part of the frame by the
                 depth map, so only the river/canal surface shimmers
     - breathe   a very gentle zoom, replacing the CSS Ken Burns

   It is strictly an enhancement layer:
     - the <img> stays the real DOM content and keeps the alt text
     - any failure (no WebGL, lost context, shader error, missing depth map)
       removes the canvas and hands back to the CSS pan
     - prefers-reduced-motion means this file never mounts at all
     - the render loop stops when the hero leaves the viewport or the tab hides
   ========================================================================== */

(() => {
  "use strict";

  const hero = document.querySelector("[data-hero]");
  if (!hero) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const media = hero.querySelector(".hero__media");
  const baseImg = hero.querySelector(".hero__img");
  if (!media || !baseImg) return;

  const POOL = hero.heroPool;
  if (!Array.isArray(POOL) || !POOL.length) return;

  // Which frame the shader is actually showing.
  let currentItem = null;

  // Guards the async crossfade below. Two clicks in quick succession both await
  // an image load, and without this the slower one can resolve last and win the
  // upload — leaving the canvas on one frame while the label reads another,
  // permanently, until the next click.
  let frameToken = 0;

  /* ------------------------------------------------------------- sources -- */

  // mirror the srcset tiers so the texture matches what the DOM would fetch
  // Thresholds must be the srcset's own (900w / 1600w / 2400w with
  // sizes="100vw"), not near them: at 1700 and 950 there were two narrow bands
  // where the browser picked one tier for the <img> and this picked another,
  // costing a duplicate download and giving the shader a different photo than
  // the fallback layer underneath it.
  const pickWidth = () => {
    const need = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    if (need > 1600) return "-2x";
    if (need > 900) return "";
    return "-sm";
  };

  const photoURL = (item) => `img/${item.file}${pickWidth()}.webp`;
  const depthURL = (item) => `img/${item.file}-depth.webp`;

  /* --------------------------------------------------------------- webgl -- */

  const canvas = document.createElement("canvas");
  canvas.className = "hero__canvas";
  canvas.setAttribute("aria-hidden", "true");

  // No failIfMajorPerformanceCaveat here: it rejects software rasterisers but
  // also some perfectly capable low-end GPUs, and it says nothing about how
  // this particular shader performs. The render loop measures its own frame
  // time instead and tears down if it cannot hold a smooth rate — that covers
  // software rendering, weak GPUs, and thermal throttling with one rule.
  const glOpts = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance"
  };
  // WebGL2 first, WebGL1 unchanged behind it.
  //
  // The photo texture is minified into the canvas — a 2528px source drawn into
  // a 1440px buffer is 1.76x — and minifying with plain LINEAR and no mip chain
  // is what makes the cable harp sparkle and smooth sky step. WebGL1 cannot
  // mipmap a non-power-of-two texture at all, so the mip path only exists on a
  // WebGL2 context. The shaders are GLSL ES 1.00 with no #version directive,
  // which WebGL2 accepts as-is, so nothing else changes.
  const gl = canvas.getContext("webgl2", glOpts)
    || canvas.getContext("webgl", glOpts)
    || canvas.getContext("experimental-webgl", glOpts);
  if (!gl) return;

  const canMip = typeof WebGL2RenderingContext !== "undefined"
    && gl instanceof WebGL2RenderingContext;
  const aniso = gl.getExtension("EXT_texture_filter_anisotropic")
    || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
  // 8 is well past the point of visible return for a single quad, and caps the
  // cost on mobile parts that advertise 16
  const anisoMax = aniso
    ? Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
    : 0;

  const VERT = `
    attribute vec2 aPos;
    varying vec2 vUv;
    void main() {
      vUv = aPos * 0.5 + 0.5;
      gl_Position = vec4(aPos, 0.0, 1.0);
    }`;

  const FRAG = `
    precision highp float;
    varying vec2 vUv;

    uniform sampler2D uImgA, uDepA, uImgB, uDepB;
    uniform float uMix;         // 0 = A, 1 = B (crossfade between pool frames)
    uniform vec2  uCoverA, uCoverB;
    uniform vec2  uShift;       // depth-weighted offset in uv units, scroll-driven
    uniform float uZoom;

    // cover-fit: scale uv about the centre so the texture fills the canvas
    vec2 fit(vec2 uv, vec2 cover) {
      return (uv - 0.5) / cover + 0.5;
    }

    // one refinement step: sample depth, displace, resample depth at the new
    // position. Two passes keep silhouettes from smearing at higher offsets.
    vec4 layer(sampler2D img, sampler2D dep, vec2 cover) {
      vec2 uv = fit(vUv, cover / uZoom);

      // Everything translates; near things translate more. This is the whole
      // effect now: the scene separates by depth as the scroll dollies in, and
      // nothing moves when the page is still.
      //
      // The 0.45 floor keeps the far field moving a little, so the frame reads
      // as one camera pushing in rather than a foreground sliding over a fixed
      // backdrop; the 0.75 term is the near/far ratio that makes it depth
      // rather than a flat pan. Two passes — sample depth, displace, resample —
      // keep silhouettes from smearing at the larger offsets.
      float d = texture2D(dep, uv).r;
      vec2 p  = uShift * (0.45 + d * 0.75);
      d       = texture2D(dep, uv + p * 0.5).r;
      p       = uShift * (0.45 + d * 0.75);

      vec2 f = clamp(uv + p, 0.0005, 0.9995);
      return texture2D(img, f);
    }

    void main() {
      vec4 a = layer(uImgA, uDepA, uCoverA);
      if (uMix <= 0.001) { gl_FragColor = a; return; }
      vec4 b = layer(uImgB, uDepB, uCoverB);
      gl_FragColor = mix(a, b, uMix);
    }`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  for (const n of ["uImgA", "uDepA", "uImgB", "uDepB", "uMix", "uCoverA", "uCoverB",
                   "uShift", "uZoom"]) {
    U[n] = gl.getUniformLocation(prog, n);
  }
  gl.uniform1i(U.uImgA, 0);
  gl.uniform1i(U.uDepA, 1);
  gl.uniform1i(U.uImgB, 2);
  gl.uniform1i(U.uDepB, 3);

  /* ------------------------------------------------------------ textures -- */

  const makeTexture = (unit) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 1x1 placeholder so the first draw is always valid
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([10, 15, 22, 255]));
    return t;
  };

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const tex = [makeTexture(0), makeTexture(1), makeTexture(2), makeTexture(3)];
  const size = [{ w: 1, h: 1 }, null, { w: 1, h: 1 }, null];

  const upload = (unit, bitmap) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex[unit]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
    // Photo units only (0 and 2). The depth map is a displacement field read at
    // full scale, not something sampled at a distance; mip-filtering it would
    // soften exactly the silhouettes the two-pass refinement exists to keep.
    if (canMip && (unit === 0 || unit === 2)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      // Set the mip filter only once the chain actually exists. A mipmap
      // min-filter on a texture with no mip levels is an incomplete texture and
      // samples as solid black — the same failure mode as trap 3, and just as
      // silent.
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      if (anisoMax > 1) {
        gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, anisoMax);
      }
    }
    if (unit === 0 || unit === 2) size[unit] = { w: bitmap.width, h: bitmap.height };
  };

  const loadImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(url));
      img.src = url;
    });

  const loadFrame = async (item) =>
    Promise.all([loadImage(photoURL(item)), loadImage(depthURL(item))]);

  /* -------------------------------------------------------------- state -- */

  let mounted = false;
  let running = false;
  let inView = true;
  let raf = 0;
  let start = performance.now();

  let mixFrom = 0;      // which unit pair is currently showing: 0 => A, 1 => B
  let mix = 0;          // uMix value
  let fading = false;
  let fadeStart = 0;
  const FADE = 620;

  const dpr = () => Math.min(window.devicePixelRatio || 1, 2);

  const resize = () => {
    // Measure the element the canvas actually fills, not the <section>. On a
    // staged hero the section is two viewports tall while the canvas occupies
    // the one-viewport pinned stage — measuring the section stretched the
    // drawing buffer to double height and the photo came out squashed.
    const r = media.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr()));
    const h = Math.max(1, Math.round(r.height * dpr()));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };

  // cover-fit factors for a texture inside the canvas.
  //
  // The shader does `fit(vUv, cover / uZoom)` where `fit(uv, c)` is
  // `(uv - 0.5) / c + 0.5`, so the sampled span along an axis is `uZoom / c`.
  // Cover-fit means sampling a SUBSET of the axis that overflows — a span below
  // 1 — which needs c ABOVE 1. This previously returned the reciprocal
  // (0.93 where 1.07 was wanted), so the span came out above 1 on both axes and
  // the shader's `clamp(..., 0.0005, 0.9995)` repeated the border texel outward.
  // Measured: column-to-column variation was exactly 0.000 across the outer
  // ~150px of a 1440px hero on each side — a fifth of the frame was stretched
  // edge pixels on every background at rest.
  const coverFor = (s) => {
    if (!s || !canvas.width) return [1, 1];
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = s.w / s.h;
    return imgAspect > canvasAspect
      ? [imgAspect / canvasAspect, 1]   // image wider: crop horizontally
      : [1, canvasAspect / imgAspect];  // image taller: crop vertically
  };

  // --- self-policing frame budget ------------------------------------------
  // The first stretch of real frames is timed. If this shader cannot hold a
  // smooth rate on this device, the whole layer removes itself and the CSS
  // pan takes over — better a clean simpler hero than a stuttering rich one.
  let probeCount = 0;
  let probeSlow = 0;
  let lastFrameAt = 0;
  const PROBE_FRAMES = 45;

  const judge = (now) => {
    // A crossfade samples both frames at once and is the single heaviest
    // thing this shader ever does. Judging steady-state cost during it would
    // condemn the effect for a moment that lasts 620ms, so those frames are
    // skipped and the probe restarts once the fade has settled.
    if (fading) {
      lastFrameAt = 0;
      probeCount = 0;
      probeSlow = 0;
      return;
    }
    if (lastFrameAt) {
      const dt = now - lastFrameAt;
      // ignore the huge deltas that follow a tab switch or a texture upload
      if (dt < 400) {
        probeCount++;
        if (dt > 24) probeSlow++;
      }
    }
    lastFrameAt = now;
    if (probeCount >= PROBE_FRAMES) {
      const bad = probeSlow / probeCount;
      probeCount = 0;
      probeSlow = 0;
      if (bad > 0.4) teardown();
    }
  };

  // Draw one frame with motion neutralised. Used to prove the pipeline really
  // produces the photograph before anything is shown to the visitor.
  const drawProbe = () => {
    gl.uniform2f(U.uShift, 0, 0);
    // match the rest value the render loop uses, so the probe proves the same
    // framing the visitor gets rather than a wider one
    gl.uniform1f(U.uZoom, 0.97);
    gl.uniform1f(U.uMix, 0);
    const ca = coverFor(size[0]);
    const cb = coverFor(size[2]);
    gl.uniform2f(U.uCoverA, ca[0], ca[1]);
    gl.uniform2f(U.uCoverB, cb[0], cb[1]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // Does the canvas actually contain the photo?
  //
  // texImage2D is supposed to throw SecurityError for a cross-origin (file://)
  // image, but that is not reliable — it sometimes succeeds and yields a black
  // texture instead, which would swap a good photograph for an empty rectangle.
  // So the output is inspected rather than trusted: two full-width strips must
  // show real variation. Night frames are legitimately dark, so this tests for
  // contrast across the frame, never for brightness.
  const renderedSomething = () => {
    if (!canvas.width || !canvas.height) return false;
    const strip = (yFrac) => {
      const h = 4;
      const y = Math.min(canvas.height - h, Math.max(0, Math.round(canvas.height * yFrac)));
      const px = new Uint8Array(canvas.width * h * 4);
      try {
        gl.readPixels(0, y, canvas.width, h, gl.RGBA, gl.UNSIGNED_BYTE, px);
      } catch {
        return 0;
      }
      let min = 255, max = 0;
      for (let i = 0; i < px.length; i += 4) {
        const v = (px[i] + px[i + 1] + px[i + 2]) / 3;
        if (v < min) min = v;
        if (v > max) max = v;
      }
      return max - min;
    };
    return strip(0.4) > 8 || strip(0.68) > 8;
  };

  const frame = (now) => {
    raf = 0;
    if (!running) return;
    judge(now);
    if (!mounted) return;

    const t = (now - start) / 1000;

    // Scroll dolly, and nothing else.
    //
    // Everything ambient is gone: the autonomous orbit, the pointer parallax,
    // the water ripple, the highlight twinkle and the breathing zoom. The brief
    // is a clear still photograph, and each of those was either motion for its
    // own sake or a constant tuned to the depth statistics of one specific set
    // of images. At rest this now draws the cover-fit crop exactly — no
    // displacement, no animation, one static frame.
    //
    // hero-controller owns the eased progress through the hero's runway; this
    // turns it into a camera push. Because the displacement is weighted by real
    // depth, near things travel further than far ones and the scene opens up
    // rather than simply scaling — which is the whole point of doing it with a
    // depth map, and the only reason this layer exists.
    const p = typeof hero.heroProgress === "number" ? hero.heroProgress : 0;

    // NOTE ON SIGN: uZoom divides the cover factor in the shader, so a LARGER
    // value samples a WIDER area — it zooms out. Pushing the camera in means
    // decreasing it. Getting this backwards drove the value to 1.83, sampled
    // far outside the texture, and clamped the whole frame to dark edge pixels.
    const dolly = p * 0.30;

    // BUDGET: the sampled half-span is uZoom / 2, so uZoom / 2 + max|shift|
    // must stay under 0.5 or the clamp smears the border. Shift is now zero at
    // rest and peaks at p = 1, where the dolly has already shrunk the span:
    //   p = 0 → 0.97/2 + 0      = 0.485
    //   p = 1 → 0.67/2 + 0.042  = 0.377   (0.035 shift × the 1.2 depth peak)
    // Both inside 0.5. With the drift gone the margin it used to reserve is
    // free, so the base moves 0.85 → 0.97: the hero samples 97% of the texture
    // instead of 85%, which is less magnification and a visibly sharper image.
    const sy = p * 0.035;

    gl.uniform2f(U.uShift, 0, sy);
    gl.uniform1f(U.uZoom, 0.97 - dolly);

    if (fading) {
      const p = Math.min(1, (now - fadeStart) / FADE);
      const eased = p * p * (3 - 2 * p);
      mix = mixFrom === 0 ? eased : 1 - eased;
      if (p >= 1) {
        fading = false;
        mixFrom = mixFrom === 0 ? 1 : 0;
        mix = mixFrom === 0 ? 0 : 1;
      }
    }

    gl.uniform1f(U.uMix, mix);
    const ca = coverFor(size[0]);
    const cb = coverFor(size[2]);
    gl.uniform2f(U.uCoverA, ca[0], ca[1]);
    gl.uniform2f(U.uCoverB, cb[0], cb[1]);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  };

  const play = () => {
    if (running || !mounted || reducedMotion.matches) return;
    running = true;
    start = performance.now() - 1000;
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const teardown = () => {
    stop();
    mounted = false;
    hero.classList.remove("is-webgl");
    canvas.remove();
  };

  /* --------------------------------------------------------------- mount -- */

  const currentIndex = () => {
    const n = Number(hero.dataset.heroStart || 0);
    return Number.isInteger(n) && n >= 0 && n < POOL.length ? n : 0;
  };

  const mount = async () => {
    if (mounted || reducedMotion.matches) return;
    let assets;
    const startItem = POOL[currentIndex()];
    try {
      assets = await loadFrame(startItem);
    } catch {
      return; // no depth map or photo — stay on the CSS path
    }
    // The preference can flip during those awaits. Without re-checking, a
    // teardown that lands mid-load does nothing (nothing is mounted yet), then
    // this resumes, sets `is-webgl` — which hides both <img> layers via
    // `.hero.is-webgl .hero__img { opacity: 0 !important }` — and never draws
    // again, because play() is gated on the same preference. The hero is then
    // permanently black with only the copy on it, and nothing can recover it.
    if (reducedMotion.matches) return;
    currentItem = startItem;

    // Upload BEFORE touching the DOM. Opened straight off disk, a file://
    // image is cross-origin data and texImage2D throws SecurityError; if the
    // canvas were already mounted and the <img> already hidden at that point,
    // the hero would go black. Nothing is shown until a texture is proven to
    // upload, so the failure path is simply "the CSS pan, unchanged".
    try {
      upload(0, assets[0]);
      upload(1, assets[1]);
      // seed B with the same frame so an early crossfade has something valid
      upload(2, assets[0]);
      upload(3, assets[1]);
    } catch {
      return;
    }

    // Size it, render one still frame, and read the result back — all while
    // the canvas is still detached, so a failure is invisible to the visitor.
    resize();
    drawProbe();
    if (!renderedSomething()) return;

    media.appendChild(canvas);
    hero.classList.add("is-webgl");
    mounted = true;
    play();
  };

  /* -------------------------------------------------------------- events -- */

  // The scroll listener is gone with the effects that used it. It read
  // `hero.offsetHeight` — a layout-flushing property — synchronously on every
  // scroll event, and fed only `scrollN`, which contributed a small constant
  // y-shift. The dolly reads `hero.heroProgress`, which hero-controller already
  // computes against a cached height, so nothing here needs its own scroll
  // handler. Pointer parallax is gone with it: the brief is a still image.
  window.addEventListener("resize", () => { resize(); }, { passive: true });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView && !document.hidden) play();
      else stop();
    }, { threshold: 0 }).observe(hero);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (inView) play();
  });

  canvas.addEventListener("webglcontextlost", (e) => {
    e.preventDefault();
    teardown();
  });

  // frame cycling — crossfade inside the shader
  hero.addEventListener("hero:frame", async (e) => {
    if (!mounted) return;
    const item = e.detail.item;
    const token = ++frameToken;
    let assets;
    try {
      assets = await loadFrame(item);
    } catch {
      return;
    }
    // A newer click owns the layer from here. Without this the slower of two
    // overlapping loads resolves last, recomputes `target`, and wins the upload
    // — canvas and label then disagree until the next click.
    if (token !== frameToken) return;
    currentItem = item;
    // load into whichever pair is currently hidden, then fade to it
    const target = mixFrom === 0 ? 2 : 0;
    try {
      upload(target, assets[0]);
      upload(target + 1, assets[1]);
    } catch {
      teardown(); // hand back to the <img> crossfade rather than freeze
      return;
    }
    fadeStart = performance.now();
    fading = true;
    if (!running) {
      // finish the swap even if paused off-screen, so returning looks right
      mix = target === 2 ? 1 : 0;
      mixFrom = target === 2 ? 1 : 0;
      fading = false;
    }
  });

  const onMotionPref = () => {
    if (reducedMotion.matches) teardown();
    else if (!mounted) mount();
  };
  reducedMotion.addEventListener?.("change", onMotionPref);

  if (document.readyState === "complete") mount();
  else window.addEventListener("load", mount, { once: true });
})();
