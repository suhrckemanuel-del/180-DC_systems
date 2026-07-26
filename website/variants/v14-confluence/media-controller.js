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

    const setControl = (label) => {
      control.textContent = label;
      control.setAttribute("aria-label", `${label} city film`);
    };

    const setStatic = () => {
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
      playWhenReady = true;
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          playWhenReady = false;
          figure.dataset.mediaState = "poster";
          setControl("Play");
          control.disabled = false;
          control.hidden = false;
        });
      }
    };

    const attach = () => {
      if (attached || reducedMotion.matches) return;
      attached = true;
      playWhenReady = true;
      figure.dataset.mediaState = "loading";
      control.hidden = true;
      video.src = source;
      video.load();
    };

    const pauseAutomatically = () => {
      if (!video.paused && !video.ended) {
        pauseWasAutomatic = true;
        video.pause();
      }
    };

    video.addEventListener("loadeddata", () => {
      control.disabled = false;
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
      playWhenReady = false;
      figure.dataset.mediaState = "error";
      control.hidden = true;
      if (attached) {
        video.removeAttribute("src");
        video.load();
        attached = false;
      }
    });

    control.addEventListener("click", () => {
      if (reducedMotion.matches) return;
      if (!attached) {
        control.disabled = true;
        control.textContent = "Loading";
        attach();
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
        pauseAutomatically();
        return;
      }
      if (reducedMotion.matches) return;
      if (!attached) {
        if (!dataSaver) attach();
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
      if (!reducedMotion.matches && !dataSaver) attach();
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        pauseAutomatically();
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
        showManualStart();
      } else if (inView) {
        attach();
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
