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

  // Which frame the shader is actually showing, and whether it contains water.
  // `water` is opt-out: most of the pool is riverfront, so absence means yes.
  let currentItem = null;
  const currentHasWater = () => (currentItem ? currentItem.water !== false : true);

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
    uniform vec2  uShift;       // parallax offset in uv units
    uniform float uZoom;
    uniform float uTime;
    uniform float uWater;       // water animation strength
    uniform float uTwinkle;     // highlight shimmer, faded out by the dolly

    // cover-fit: scale uv about the centre so the texture fills the canvas
    vec2 fit(vec2 uv, vec2 cover) {
      return (uv - 0.5) / cover + 0.5;
    }

    // one refinement step: sample depth, displace, resample depth at the new
    // position. Two passes keep silhouettes from smearing at higher offsets.
    vec4 layer(sampler2D img, sampler2D dep, vec2 cover) {
      vec2 uv = fit(vUv, cover / uZoom);

      // Everything translates; near things translate more.
      //
      // Subtracting a baseline (d - 0.12) pins a plane in place, and in these
      // frames that plane sits right where the detail is: the depth map reads
      // sky as ~0 and water as ~1, so the only strongly-displaced regions were
      // smooth gradients, where movement is invisible. Sliding a featureless
      // sky produces almost no visible change. A floor of 0.45 gives a real
      // camera move across the whole frame, and the 0.75 term keeps the
      // near/far ratio that makes it read as depth rather than a flat pan.
      float d = texture2D(dep, uv).r;
      vec2 p  = uShift * (0.45 + d * 0.75);
      d       = texture2D(dep, uv + p * 0.5).r;
      p       = uShift * (0.45 + d * 0.75);

      // water: only where the frame is near (high depth) and low in view.
      //
      // Both thresholds are measured, not guessed. Sampling the depth maps in
      // 10% horizontal bands: sky sits at d < 0.01, the horizon and skyline
      // peak at d = 0.39, and real water only starts around d = 0.55, rising
      // to ~0.87 at the bottom edge. The old floor of 0.30 therefore opened
      // the gate *below* the skyline maximum, so the ripple — which is mostly
      // a function of uv.y, hence horizontal — ran across the distant
      // buildings and the sky just above them as moving bands. A floor of 0.45
      // clears the skyline peak with margin while still catching the water.
      float mask = smoothstep(0.45, 0.72, d) * smoothstep(0.48, 0.10, uv.y);
      float rip  = sin(uv.y * 120.0 - uTime * 1.9) * 0.0034
                 + sin(uv.x *  70.0 + uTime * 1.1) * 0.0026
                 + sin((uv.x + uv.y) * 175.0 - uTime * 2.6) * 0.0015;
      vec2 w = vec2(rip * 0.45, rip) * mask * uWater;

      vec2 f = clamp(uv + p + w, 0.0005, 0.9995);
      vec4 col = texture2D(img, f);

      // Twinkle.
      //
      // Displacement alone cannot read as motion here: the depth map's most
      // mobile regions are sky and water, which are smooth gradients, and
      // sliding a gradient looks like nothing. What actually says "this is
      // footage, not a photograph" in a night scene is light — windows,
      // streetlamps, the lit cabling and their reflections, all breathing at
      // slightly different rates. This lifts only pixels that are already
      // bright, so it cannot invent light where the frame has none.
      float lum = dot(col.rgb, vec3(0.299, 0.587, 0.114));

      // ISOLATION GATE.
      //
      // The shimmer is for points of light — windows, streetlamps, lit cabling.
      // Keying it on brightness alone applied it to bright SURFACES too, and
      // since the hash phase is per cell, one continuous object got unrelated
      // phases across it: the white pylon visibly broke into blocks, which is
      // the single most damaging artifact in the hero and lands squarely on the
      // landmark. Brightness cannot distinguish a lamp from a lit wall, so ask
      // about isolation instead — sample a few texels away and keep only the
      // amount by which this pixel beats its darkest neighbour. On the pylon the
      // neighbours are just as bright, the difference collapses and the gate
      // closes. On a lamp against a night sky it opens wide.
      //
      // Offsets are in uv space rather than texels so this needs no new uniform;
      // at 1600–2400 px wide, 0.0025 is roughly 4–6 px.
      const vec2 iso = vec2(0.0025, 0.0037);
      float n1 = dot(texture2D(img, f + iso).rgb, vec3(0.299, 0.587, 0.114));
      float n2 = dot(texture2D(img, f - iso).rgb, vec3(0.299, 0.587, 0.114));
      float isolated = smoothstep(0.03, 0.18, lum - min(n1, n2));

      float hi  = smoothstep(0.42, 0.92, lum) * isolated;
      // per-cell hash so neighbouring lights fall out of phase with each other
      vec2  cell = floor(f * 380.0);
      float h    = fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
      float tw   = sin(uTime * (1.5 + h * 2.6) + h * 6.283);
      // uTwinkle also falls to zero as the dolly pushes in, because magnifying
      // texture-space cells enlarges them on screen.
      col.rgb += col.rgb * hi * tw * 0.18 * uTwinkle;

      return col;
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
                   "uShift", "uZoom", "uTime", "uWater", "uTwinkle"]) {
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

  let pointerX = 0, pointerY = 0;   // -1..1, smoothed
  let targetX = 0, targetY = 0;
  let scrollN = 0;                  // 0..1 progress through the hero

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
    gl.uniform1f(U.uZoom, 0.85);
    gl.uniform1f(U.uTime, 0);
    gl.uniform1f(U.uWater, 0);
    gl.uniform1f(U.uTwinkle, 0);
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

    // pointer easing — never snaps
    pointerX += (targetX - pointerX) * 0.045;
    pointerY += (targetY - pointerY) * 0.045;

    // Autonomous drift, as a circular orbit rather than a pair of sines.
    // This matters more than amplitude: a sine spends most of its time near
    // its turning points, so screen velocity drops to zero exactly when the
    // visitor is looking, and the hero reads as a still. A constant angular
    // sweep moves at a constant speed. One orbit takes about 10 seconds, with
    // a slower second orbit layered on so the path never visibly repeats.
    const phase = t * 0.62;
    const driftX = Math.cos(phase) * 0.82 + Math.cos(t * 0.17) * 0.3;
    const driftY = Math.sin(phase) * 0.55 + Math.sin(t * 0.13) * 0.25;

    // scroll contributes a downward push, like the old CSS parallax
    // Scroll dolly. hero-controller owns the eased progress through the
    // hero's runway; this turns it into a camera push into the photograph.
    // Because the displacement is weighted by real depth, the near water
    // expands faster than the far skyline — the scene opens up rather than
    // simply scaling, which is the whole point of doing it with a depth map.
    const p = typeof hero.heroProgress === "number" ? hero.heroProgress : 0;

    // NOTE ON SIGN: uZoom divides the cover factor in the shader, so a LARGER
    // value samples a WIDER area — it zooms out. Pushing the camera in means
    // decreasing it. Getting this backwards drove the value to 1.83, sampled
    // far outside the texture, and clamped the whole frame to dark edge pixels.
    const dolly = p * 0.28;

    // ease the ambient drift down as the dolly takes over, so the two motions
    // never fight, and so displacement stays inside the shrinking margin.
    //
    // BUDGET: the sampled half-span on the uncropped axis is uZoom / 2, so
    // uZoom / 2 + max|shift| must stay under 0.5 or the clamp smears the border.
    // These amplitudes are what that budget allows: driftX peaks at 1.12 and
    // pointerX at 0.9, so 2.02 * 0.030 = 0.061, against a half-span of 0.435 at
    // the 0.87 worst case below. The old 0.105 put the peak at 0.212 — 21% of
    // the image width of travel, which no sane zoom could contain.
    const damp = 1 - p * 0.6;
    const sx = (pointerX * 0.9 + driftX) * 0.030 * damp;
    const sy = (pointerY * 0.7 + driftY) * 0.024 * damp + scrollN * 0.012;

    gl.uniform2f(U.uShift, sx, sy);
    // 0.85 at rest samples 85% of the texture — a true cover-fit crop with a
    // small margin for the drift above, and still a downscale from a 2528px
    // source into a 1440px canvas, so nothing is magnified.
    gl.uniform1f(U.uZoom, 0.85 - dolly + Math.sin(t * 0.27) * 0.02);
    gl.uniform1f(U.uTime, t);
    // Per-frame, not global. The depth thresholds in the mask were derived from
    // the Erasmusbrug renders, where the river is the nearest thing in shot and
    // the sky reads near zero. That premise does not survive the whole pool:
    // Markthal and the Delft Markt are dry paved squares whose foreground sits
    // in exactly the same depth band as river water, so they rippled solid
    // stone. No single threshold pair fits ten different depth maps, so the
    // frame declares whether it contains water.
    gl.uniform1f(U.uWater, currentHasWater() ? 1.0 : 0.0);
    gl.uniform1f(U.uTwinkle, Math.max(0, 1 - p * 2.2));

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
    onScroll();
    drawProbe();
    if (!renderedSomething()) return;

    media.appendChild(canvas);
    hero.classList.add("is-webgl");
    mounted = true;
    play();
  };

  /* -------------------------------------------------------------- events -- */

  const onScroll = () => {
    const h = hero.offsetHeight || window.innerHeight;
    scrollN = Math.min(1, Math.max(0, (window.scrollY || 0) / h));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { resize(); onScroll(); }, { passive: true });

  // pointer parallax, desktop only — on touch the drift carries the motion
  if (window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (e) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

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
