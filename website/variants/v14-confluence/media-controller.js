(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const dataSaver = Boolean(
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  );

  const initialise = () => document.querySelectorAll("[data-city-film]").forEach((figure) => {
    const video = figure.querySelector("video");
    const control = figure.querySelector(".city-film__control");
    const source = figure.dataset.src;
    if (!video || !control || !source) return;

    let attached = false;
    let inView = false;
    let userPaused = false;
    let pauseWasAutomatic = false;
    let playWhenReady = false;
    let playToken = 0;
    let autoAttachScheduled = false;
    let autoAttachHandle = null;
    let autoAttachKind = null;
    let autoAttachToken = 0;

    const setControl = (label) => {
      control.textContent = label;
      control.setAttribute("aria-label", `${label} city film`);
      control.removeAttribute("aria-busy");
      control.removeAttribute("aria-disabled");
    };

    const setLoadingControl = () => {
      control.textContent = "Loading";
      control.setAttribute("aria-label", "Loading city film");
      control.setAttribute("aria-busy", "true");
      control.setAttribute("aria-disabled", "true");
      control.disabled = false;
      control.hidden = false;
    };

    const cancelAutoAttach = () => {
      autoAttachToken += 1;
      autoAttachScheduled = false;
      if (autoAttachHandle !== null) {
        if (autoAttachKind === "idle" && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(autoAttachHandle);
        } else if (autoAttachKind === "timeout") {
          window.clearTimeout(autoAttachHandle);
        }
      }
      autoAttachHandle = null;
      autoAttachKind = null;
    };

    const setStatic = () => {
      cancelAutoAttach();
      playToken += 1;
      playWhenReady = false;
      userPaused = false;
      pauseWasAutomatic = false;
      control.hidden = true;
      control.disabled = false;
      figure.dataset.mediaState = "static";
      video.pause();
      if (attached) {
        video.removeAttribute("src");
        video.load();
        attached = false;
      }
    };

    const showManualStart = () => {
      figure.dataset.mediaState = "poster";
      setControl("Play");
      control.disabled = false;
      control.hidden = false;
    };

    const requestPlay = () => {
      if (reducedMotion.matches || document.hidden || !inView) return;
      const token = ++playToken;
      playWhenReady = true;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          if (token !== playToken || reducedMotion.matches || !attached) return;
          playWhenReady = false;
          figure.dataset.mediaState = "poster";
          setControl("Play");
          control.disabled = false;
          control.hidden = false;
        });
      }
    };

    const attach = (showProgress = false) => {
      if (attached || reducedMotion.matches) return;
      attached = true;
      playWhenReady = true;
      figure.dataset.mediaState = "loading";
      if (showProgress) {
        setLoadingControl();
      } else {
        control.hidden = true;
      }
      video.src = source;
      video.load();
    };

    const scheduleAutoAttach = () => {
      if (
        autoAttachScheduled ||
        attached ||
        dataSaver ||
        reducedMotion.matches ||
        document.hidden ||
        !inView
      ) return;

      autoAttachScheduled = true;
      const token = ++autoAttachToken;
      window.requestAnimationFrame(() => {
        if (token !== autoAttachToken || !autoAttachScheduled) return;
        const run = () => {
          if (token !== autoAttachToken) return;
          autoAttachScheduled = false;
          autoAttachHandle = null;
          autoAttachKind = null;
          if (!attached && !dataSaver && !reducedMotion.matches && !document.hidden && inView) {
            attach();
          }
        };

        if ("requestIdleCallback" in window) {
          autoAttachKind = "idle";
          autoAttachHandle = window.requestIdleCallback(run, { timeout: 1200 });
        } else {
          autoAttachKind = "timeout";
          autoAttachHandle = window.setTimeout(run, 180);
        }
      });
    };

    const pauseAutomatically = () => {
      if (!video.paused && !video.ended) {
        pauseWasAutomatic = true;
        video.pause();
      }
    };

    video.addEventListener("loadeddata", () => {
      control.disabled = false;
      control.removeAttribute("aria-busy");
      control.removeAttribute("aria-disabled");
      control.hidden = false;
      if (playWhenReady && inView && !document.hidden && !reducedMotion.matches) {
        requestPlay();
      } else {
        figure.dataset.mediaState = "poster";
        setControl("Play");
      }
    });

    video.addEventListener("playing", () => {
      playWhenReady = false;
      pauseWasAutomatic = false;
      figure.dataset.mediaState = "playing";
      setControl("Pause");
      control.disabled = false;
      control.hidden = false;
    });

    video.addEventListener("pause", () => {
      if (video.ended || reducedMotion.matches) return;
      figure.dataset.mediaState = "paused";
      setControl("Play");
    });

    video.addEventListener("ended", () => {
      userPaused = false;
      pauseWasAutomatic = false;
      figure.dataset.mediaState = "ended";
      setControl("Replay");
      control.disabled = false;
      control.hidden = false;
    });

    video.addEventListener("error", () => {
      playToken += 1;
      playWhenReady = false;
      figure.dataset.mediaState = "error";
      control.hidden = true;
      control.removeAttribute("aria-busy");
      control.removeAttribute("aria-disabled");
      if (attached) {
        video.removeAttribute("src");
        video.load();
        attached = false;
      }
    });

    control.addEventListener("click", () => {
      if (reducedMotion.matches) return;
      if (figure.dataset.mediaState === "loading") return;
      if (!attached) {
        attach(true);
        return;
      }
      if (video.ended) {
        video.currentTime = 0;
        userPaused = false;
        requestPlay();
        return;
      }
      if (video.paused) {
        userPaused = false;
        pauseWasAutomatic = false;
        requestPlay();
      } else {
        userPaused = true;
        pauseWasAutomatic = false;
        video.pause();
      }
    });

    const observe = (entries) => {
      const entry = entries[0];
      inView = entry.isIntersecting;
      if (!inView) {
        if (!attached) cancelAutoAttach();
        pauseAutomatically();
        return;
      }
      if (reducedMotion.matches) return;
      if (!attached) {
        if (!dataSaver) scheduleAutoAttach();
        return;
      }
      if (pauseWasAutomatic && !userPaused && !video.ended) requestPlay();
    };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(observe, {
        rootMargin: "180px 0px",
        threshold: 0.08
      }).observe(figure);
    } else {
      inView = true;
      if (!reducedMotion.matches && !dataSaver) scheduleAutoAttach();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (!attached) cancelAutoAttach();
        pauseAutomatically();
      } else if (inView && !attached && !reducedMotion.matches && !dataSaver) {
        scheduleAutoAttach();
      } else if (
        inView &&
        pauseWasAutomatic &&
        !userPaused &&
        !video.ended &&
        !reducedMotion.matches
      ) {
        requestPlay();
      }
    });

    const configureMotion = () => {
      if (reducedMotion.matches) {
        setStatic();
      } else if (dataSaver) {
        cancelAutoAttach();
        showManualStart();
      } else if (inView) {
        scheduleAutoAttach();
      } else {
        figure.dataset.mediaState = "poster";
      }
    };

    reducedMotion.addEventListener?.("change", configureMotion);
    configureMotion();
  });

  if (document.readyState === "complete") {
    initialise();
  } else {
    window.addEventListener("load", initialise, { once: true });
  }
})();
