/* ==========================================================================
   V15 Vantage — hero controller

   Progressive enhancement only. The page is complete and legible before this
   file runs: the hero photo is a real <img> in the markup, the nav links are
   real anchors, and every section is plain HTML. This script only upgrades
   that with pan/zoom, parallax, photo cycling, and the mobile menu.

   Motion discipline follows v14-confluence/media-controller.js:
     - everything is gated on prefers-reduced-motion, re-evaluated on change
     - an IntersectionObserver pauses all hero motion once the hero leaves
       the viewport, and visibilitychange pauses it on a hidden tab
     - only `transform` and `opacity` are ever animated, so no frame in the
       parallax or the crossfade can trigger layout
   ========================================================================== */

(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.remove("no-js");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 1024px)");

  /* ---------------------------------------------------------- photo pool --
     Five real, licensed photographs of Rotterdam and Delft — three Rotterdam,
     two Delft, alternating so the branch reads as Delft–Rotterdam wherever a
     visitor enters. Every page ships the same pool and opens on its own frame
     via data-hero-start; the prev/next control walks the whole pool without a
     page reload.

     Frames 0 and 4 are Pexels; the rest are Wikimedia Commons. Mixed sources
     mean the licence string genuinely varies per frame, so it is carried per
     frame rather than assumed.

     The public hero stays visually quiet: full credit details live in the
     linked photography ledger at guide.html#images and MEDIA-CREDITS.md.
     This keeps legally required CC attribution available without crowding the
     photograph or repeating changing city labels beside the controls.      */

  const POOL = [
    {
      // Home. The only frame in the pool that clears AA on every piece of hero
      // copy at BOTH 1440 and 390 — a 390px viewport crops to roughly the
      // central quarter, and most frames put the copy on their busiest band
      // when it does. Its dark sky and still water survive that crop.
      file: "rotterdam-maas-night",
      city: "Rotterdam",
      label: "Rotterdam · Maas",
      credit: "ClickerHappy · Pexels License",
      alt: "Rotterdam's skyline at night across the Nieuwe Maas, lit towers and quayside houses above still blue water with the Erasmusbrug at the right"
    },
    {
      file: "delft-oostpoort-air",
      city: "Delft",
      label: "Delft · Oostpoort",
      credit: "Ludvig14 · CC BY-SA 4.0",
      alt: "Delft's Oostpoort gate from the air, its twin towers between two canals with a white drawbridge alongside and the Nieuwe Kerk on the skyline"
    },
    {
      file: "markthal-blue-hour",
      city: "Rotterdam",
      label: "Rotterdam · Markthal",
      credit: "Radek Kucharski · CC BY 2.0",
      alt: "Rotterdam's Markthal at blue hour, its grey arch curving over a vast painted glass front lit from within"
    },
    {
      file: "delft-oostpoort",
      city: "Delft",
      label: "Delft · Oostpoort gate",
      credit: "Michielverbeek · CC BY-SA 4.0",
      alt: "Delft's Oostpoort gate seen across still canal water, its paired brick towers and white drawbridge under a clear sky"
    },
    {
      file: "erasmusbrug-harp",
      city: "Rotterdam",
      label: "Rotterdam · Erasmusbrug",
      credit: "Igor Passchier · Pexels License",
      alt: "The Erasmusbrug from above at night, its lit cable harp sweeping across the Maas with the Rotterdam skyline beyond"
    }
  ];

  const srcFor = (item) => `img/${item.file}.webp`;
  // Mirrors the srcset in the markup, including the 2400 tier. Leaving it out
  // meant the frame the page loads with got the hi-DPI tier but every frame
  // reached by cycling did not — which only stopped mattering when the 2400
  // tier was a lanczos upscale. It now carries real detail, so it must be here.
  const srcsetFor = (item) =>
    `img/${item.file}-sm.webp 900w, img/${item.file}.webp 1600w, img/${item.file}-2x.webp 2400w`;

  /* --------------------------------------------------------------- nodes -- */

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-mobile-menu]");

  /* ---------------------------------------------------------------- hero -- */

  const hero = document.querySelector("[data-hero]");

  if (hero) {
    const media = hero.querySelector(".hero__media");
    const baseImg = hero.querySelector(".hero__img");
    const prevBtn = hero.querySelector("[data-city-prev]");
    const nextBtn = hero.querySelector("[data-city-next]");

    let index = Number(hero.dataset.heroStart || 0);
    if (!Number.isInteger(index) || index < 0 || index >= POOL.length) index = 0;

    let inView = true;
    let swapToken = 0;

    /* --- second layer for the crossfade, created here so the no-JS DOM
           stays a single honest <img> ------------------------------------ */
    let layers = [baseImg];
    let activeLayer = 0;

    if (media && baseImg) {
      const second = baseImg.cloneNode(false);
      second.classList.add("hero__img--incoming");
      second.removeAttribute("id");
      second.alt = "";
      second.setAttribute("aria-hidden", "true");
      second.removeAttribute("fetchpriority");
      second.loading = "lazy";
      media.appendChild(second);
      layers = [baseImg, second];
    }

    /* --- parallax ------------------------------------------------------
       One rAF-coalesced loop. Reads scrollY, writes a single transform.
       Never runs while the hero is off-screen or reduced motion is on.   */

    let ticking = false;
    let lastY = -1;
    // cached so the rAF loop never reads layout — it only writes transform
    let heroHeight = hero.offsetHeight || window.innerHeight;

    const measure = () => {
      heroHeight = hero.offsetHeight || window.innerHeight;
    };

    // A staged hero is two viewports tall and pins for the first one, so
    // scrolling it dollies into the photograph rather than sliding it away.
    // Progress is smoothed toward its target the way a camera rig eases,
    // instead of tracking the wheel one-to-one, which reads as cheap.
    const staged = hero.classList.contains("hero--stage");
    const fill = hero.querySelector("[data-progress-fill]");
    let progress = 0;
    let progressTarget = 0;

    // The ease runs on its own rAF handle. Sharing the scroll handler's
    // `ticking` flag stalled it: the self-scheduled frame never cleared the
    // flag, so easing stopped one frame in and --hero-p froze part-way to
    // its target, which looked exactly like a mis-measured runway.
    let stageRaf = 0;

    const stageTick = () => {
      stageRaf = 0;
      const runway = Math.max(1, heroHeight - window.innerHeight);
      progressTarget = Math.min(1, Math.max(0, (window.scrollY || 0) / runway));
      // ease toward the target; 0.12 keeps it responsive but never jerky
      progress += (progressTarget - progress) * 0.12;
      if (Math.abs(progressTarget - progress) < 0.0005) progress = progressTarget;

      hero.style.setProperty("--hero-p", progress.toFixed(4));
      hero.heroProgress = progress;               // hero-depth.js reads this
      if (fill) fill.style.transform = `scaleX(${progress.toFixed(4)})`;

      // keep easing until it has settled, even after scrolling has stopped
      if (progress !== progressTarget) stageRaf = requestAnimationFrame(stageTick);
    };

    const applyStage = () => {
      if (!stageRaf) stageRaf = requestAnimationFrame(stageTick);
    };

    const applyParallax = () => {
      ticking = false;
      if (staged) return applyStage();
      if (!media) return;
      const y = window.scrollY || window.pageYOffset;
      if (y === lastY) return;
      lastY = y;
      // 15% of hero height is exactly the overscan budget the CSS reserves
      const shift = Math.min(y, heroHeight) * 0.15;
      media.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      // navbar tint is cheap and always wanted
      header && header.classList.toggle("is-scrolled", (window.scrollY || 0) > 24);
      if (!inView || reducedMotion.matches) return;
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyParallax);
      }
    };

    const resetParallax = () => {
      if (media) media.style.transform = "";
      lastY = -1;
    };

    /* --- motion gate ---------------------------------------------------- */

    const setMotion = () => {
      if (reducedMotion.matches) {
        hero.classList.add("is-paused");
        resetParallax();
        media && (media.style.willChange = "auto");
        return;
      }
      hero.classList.toggle("is-paused", !inView);
      media && (media.style.willChange = inView ? "transform" : "auto");
      if (inView) applyParallax();
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => {
          inView = entries[0].isIntersecting;
          setMotion();
        },
        { threshold: 0 }
      ).observe(hero);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        hero.classList.add("is-paused");
      } else {
        setMotion();
      }
    });

    reducedMotion.addEventListener?.("change", setMotion);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => { measure(); resetParallax(); }, { passive: true });
    // Re-measure once everything has actually laid out. The height is cached
    // to keep the scroll loop free of layout reads, but caching it at script
    // time can catch a pre-font, pre-image layout — which silently halves the
    // runway and leaves the dolly finishing at part strength.
    window.addEventListener("load", () => { measure(); applyParallax(); }, { once: true });

    /* --- cycling -------------------------------------------------------- */

    const paint = (item) => {
      // NOTE: data-tone is deliberately NOT set here. The tone flip repaints
      // the copy near-black for a light frame — and it used
      // to fire at click time, a decode plus a 620ms crossfade before that photo
      // was actually on screen. Clicking into a light frame from a night one put
      // near-black type over a dark photograph for the whole window. It moves to
      // applyTone(), called with the opacity swap.
      //
      // hero-depth.js listens for this to crossfade its own textures; if that
      // layer never mounted, nothing is listening and the <img> path stands
      hero.dispatchEvent(new CustomEvent("hero:frame", { detail: { item, index } }));
    };

    // Light frames flip the hero to dark type rather than relying on a scrim,
    // which the blur-only rule rules out. The visible controls do not repeat
    // the location or credit; the linked ledger carries the legal details.
    const applyTone = (item) => {
      hero.dataset.tone = item.tone || "dark";
    };

    // hero-depth.js needs the pool to preload and to resolve depth maps
    hero.heroPool = POOL;

    const preload = (item) => {
      const img = new Image();
      img.sizes = "100vw";
      img.srcset = srcsetFor(item);
      img.src = srcFor(item);
    };

    const preloadNeighbours = () => {
      const run = () => {
        preload(POOL[(index + 1) % POOL.length]);
        preload(POOL[(index - 1 + POOL.length) % POOL.length]);
      };
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout: 1500 });
      } else {
        window.setTimeout(run, 400);
      }
    };

    const setBusy = (busy) => {
      [prevBtn, nextBtn].forEach((b) => {
        if (!b) return;
        if (busy) b.setAttribute("aria-busy", "true");
        else b.removeAttribute("aria-busy");
      });
    };

    const go = async (step) => {
      if (layers.length < 2) return;
      const token = ++swapToken;
      index = (index + step + POOL.length) % POOL.length;
      const item = POOL[index];

      // label and count update immediately so the control never feels laggy
      paint(item);
      setBusy(true);

      const incoming = layers[1 - activeLayer];
      const outgoing = layers[activeLayer];

      incoming.sizes = "100vw";
      incoming.srcset = srcsetFor(item);
      incoming.src = srcFor(item);

      // decode before painting: this is what removes the flash of a
      // half-loaded photo when the arrows are clicked
      try {
        if (incoming.decode) await incoming.decode();
      } catch (err) {
        /* decode() rejects if src changed underneath us — the newer call owns
           the layer from here, so bail out quietly */
      }
      if (token !== swapToken) return;

      if (!reducedMotion.matches) {
        // fresh pan for the incoming frame
        incoming.style.animation = "none";
        void incoming.offsetWidth;
        incoming.style.animation = "";
      }

      applyTone(item);
      incoming.style.opacity = "1";
      outgoing.style.opacity = "0";

      // the visible layer carries the description; the hidden one is silent
      incoming.alt = item.alt;
      incoming.removeAttribute("aria-hidden");
      outgoing.alt = "";
      outgoing.setAttribute("aria-hidden", "true");

      activeLayer = 1 - activeLayer;
      setBusy(false);
      preloadNeighbours();
    };

    prevBtn?.addEventListener("click", () => go(-1));
    nextBtn?.addEventListener("click", () => go(1));

    // keyboard: left/right arrows cycle while the control has focus
    hero.querySelector(".city-switch")?.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    });

    // on first paint the photo is already the one in the markup, so the tone
    // must be applied immediately rather than waiting for a swap that will
    // never come
    paint(POOL[index]);
    applyTone(POOL[index]);
    setMotion();
    preloadNeighbours();
  }

  /* -------------------------------------------------------------- navbar -- */

  if (!hero && header) {
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("is-scrolled", (window.scrollY || 0) > 24),
      { passive: true }
    );
  }

  /* --- mobile menu ------------------------------------------------------
     The menu is position:fixed and animates transform/opacity only, so it
     is out of flow and opening it cannot reflow the page. The scroll lock
     compensates for the scrollbar width so the body does not jump either. */

  if (toggle && menu) {
    let open = false;

    const lockScroll = (on) => {
      if (on) {
        const sbw = window.innerWidth - root.clientWidth;
        root.style.setProperty("--sbw", `${sbw}px`);
        document.body.style.paddingRight = `${sbw}px`;
        document.body.style.overflow = "hidden";
      } else {
        root.style.setProperty("--sbw", "0px");
        document.body.style.paddingRight = "";
        document.body.style.overflow = "";
      }
    };

    const setOpen = (next, returnFocus = true) => {
      if (next === open) return;
      open = next;
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = false;
      lockScroll(open);

      if (open) {
        menu.querySelector("a, button")?.focus();
      } else if (returnFocus) {
        toggle.focus();
      }
    };

    toggle.addEventListener("click", () => setOpen(!open));

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false, false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && open) setOpen(false);
      if (e.key !== "Tab" || !open) return;
      // keep focus inside the open menu
      const items = [toggle, ...menu.querySelectorAll("a, button")].filter(
        (el) => el.offsetParent !== null || el === toggle
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener("click", (e) => {
      if (!open) return;
      if (menu.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false, false);
    });

    // crossing into desktop layout must not leave a locked body behind
    const onBreakpoint = (e) => { if (e.matches) setOpen(false, false); };
    desktopQuery.addEventListener?.("change", onBreakpoint);
  }

  /* ------------------------------------------------------------- panels -- */

  const panels = document.querySelectorAll("[data-panel]");

  const closePanels = (except) => {
    panels.forEach((p) => {
      if (p !== except) {
        p.classList.remove("is-open");
        document
          .querySelectorAll(`[data-panel-open="${p.id}"]`)
          .forEach((b) => b.setAttribute("aria-expanded", "false"));
      }
    });
  };

  document.querySelectorAll("[data-panel-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.panelOpen);
      if (!panel) return;
      const willOpen = !panel.classList.contains("is-open");
      closePanels(willOpen ? panel : null);
      panel.classList.toggle("is-open", willOpen);
      document
        .querySelectorAll(`[data-panel-open="${panel.id}"]`)
        .forEach((b) => b.setAttribute("aria-expanded", String(willOpen)));
      if (willOpen) panel.querySelector("input, a, button")?.focus();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePanels(null);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-panel]") || e.target.closest("[data-panel-open]")) return;
    closePanels(null);
  });

  /* --- site search ------------------------------------------------------
     A real index of real destinations. It searches the six pages and their
     named sections — nothing here pretends to search content that does not
     exist yet.                                                             */

  const INDEX = [
    { title: "Home", href: "index.html", hint: "Branch overview" },
    { title: "What we do — six service areas", href: "index.html#services", hint: "Home" },
    { title: "Our work", href: "index.html#work", hint: "Home · case studies reserved" },
    { title: "The branch team", href: "index.html#committee", hint: "Home" },
    { title: "Mission", href: "mission.html", hint: "Founded 2019 · first multi-city branch" },
    { title: "For clients", href: "for-clients.html", hint: "Bring a challenge" },
    { title: "Start a conversation", href: "for-clients.html#intake", hint: "For clients" },
    { title: "For students", href: "for-students.html", hint: "Consultant · Team Leader" },
    { title: "The two roles", href: "for-students.html#roles", hint: "For students" },
    { title: "How this site was made", href: "guide.html", hint: "Build notes and photography credits" },
    { title: "Photography credits — photographer, source and licence per image", href: "guide.html#images", hint: "Guide" }
  ];

  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");

  if (searchInput && searchResults) {
    const render = (q) => {
      const query = q.trim().toLowerCase();
      const hits = query
        ? INDEX.filter(
            (i) =>
              i.title.toLowerCase().includes(query) ||
              i.hint.toLowerCase().includes(query)
          )
        : INDEX;

      if (!hits.length) {
        searchResults.innerHTML = `<li class="panel__empty">Nothing matches “${query.replace(/[<>&]/g, "")}”.</li>`;
        return;
      }
      searchResults.innerHTML = hits
        .map(
          (i) =>
            `<li><a href="${i.href}">${i.title}<small>${i.hint}</small></a></li>`
        )
        .join("");
    };

    render("");
    searchInput.addEventListener("input", () => render(searchInput.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        searchResults.querySelector("a")?.click();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        searchResults.querySelector("a")?.focus();
      }
    });
  }
})();
