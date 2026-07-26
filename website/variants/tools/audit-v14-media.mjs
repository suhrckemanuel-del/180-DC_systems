import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:4174/v14-confluence/";
const routes = [
  { path: "", media: "home-rotterdam-delft.mp4" },
  { path: "mission.html", media: "mission-delft-origin.mp4" },
  { path: "for-clients.html", media: "clients-rotterdam-port.mp4" },
  { path: "for-students.html", media: "students-delft-life.mp4" },
];
const browser = await chromium.launch();
const failures = [];

const fail = (label, detail) => failures.push(`${label}: ${detail}`);
const routeUrl = (path) => new URL(path, base).href;

for (const width of [320, 390, 768, 1440]) {
  const context = await browser.newContext({
    viewport: { width, height: width < 800 ? 900 : 900 },
    reducedMotion: "reduce",
  });
  for (const route of routes) {
    const page = await context.newPage();
    await page.goto(routeUrl(route.path), { waitUntil: "networkidle" });
    const probe = await page.evaluate(() => {
      const visible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      };
      const smallTargets = [...document.querySelectorAll(".main-nav a, .button, button")]
        .filter(visible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return { label: element.textContent.trim().slice(0, 28), width: rect.width, height: rect.height };
        })
        .filter((target) => target.width < 44 || target.height < 44);
      return {
        viewport: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        h1: document.querySelector("h1")?.textContent.trim(),
        filmWidth: Math.round(document.querySelector(".city-film__viewport")?.getBoundingClientRect().width || 0),
        captionVisible: visible(document.querySelector(".city-film figcaption")),
        smallTargets,
      };
    });
    const label = `${width}px ${route.path || "home"}`;
    if (probe.scrollWidth > probe.viewport) fail(label, `horizontal overflow ${probe.scrollWidth}/${probe.viewport}`);
    if (!probe.h1 || !probe.filmWidth || !probe.captionVisible) fail(label, "hero, film, or caption missing");
    if (probe.smallTargets.length) fail(label, `small targets ${JSON.stringify(probe.smallTargets.slice(0, 4))}`);
    console.log("[responsive]", label, JSON.stringify(probe));
    await page.close();
  }
  await context.close();
}

for (const route of routes) {
  const label = route.path || "home";

  {
    const context = await browser.newContext();
    const page = await context.newPage();
    const mp4Requests = [];
    page.on("request", (request) => {
      if (request.url().endsWith(".mp4")) mp4Requests.push(request.url());
    });
    await page.goto(routeUrl(route.path), { waitUntil: "load" });
    await page.waitForFunction(() => {
      const video = document.querySelector("[data-city-film] video");
      return video?.readyState >= 2 && !video.paused && video.currentTime > 0;
    });
    const started = await page.evaluate(() => {
      const video = document.querySelector("[data-city-film] video");
      return {
        source: video?.getAttribute("src"),
        time: video?.currentTime,
        state: video?.closest("[data-city-film]")?.dataset.mediaState,
        control: document.querySelector(".city-film__control")?.textContent.trim(),
      };
    });
    if (!started.source?.endsWith(route.media) || started.state !== "playing" || started.control !== "Pause") {
      fail(`${label} normal start`, JSON.stringify(started));
    }
    if (mp4Requests.length !== 1 || !mp4Requests[0].endsWith(route.media)) {
      fail(`${label} route loading`, JSON.stringify(mp4Requests));
    }

    await page.locator(".city-film__control").click();
    const pauseTime = await page.locator("video").evaluate((video) => video.currentTime);
    await page.waitForTimeout(220);
    const paused = await page.evaluate((expected) => {
      const video = document.querySelector("video");
      return {
        paused: video?.paused,
        drift: Math.abs((video?.currentTime || 0) - expected),
        control: document.querySelector(".city-film__control")?.textContent.trim(),
      };
    }, pauseTime);
    if (!paused.paused || paused.drift > 0.08 || paused.control !== "Play") {
      fail(`${label} explicit pause`, JSON.stringify(paused));
    }

    await page.locator(".city-film__control").click();
    await page.waitForFunction((time) => document.querySelector("video")?.currentTime > time + 0.08, pauseTime);
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(250);
    const offscreenPaused = await page.locator("video").evaluate((video) => video.paused);
    if (!offscreenPaused) fail(`${label} offscreen pause`, "video continued playing");

    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForFunction(() => !document.querySelector("video")?.paused);
    await page.locator("video").evaluate((video) => {
      video.currentTime = Math.max(0, video.duration - 0.12);
      return video.play();
    });
    await page.waitForFunction(() => document.querySelector("video")?.ended);
    const ended = await page.locator(".city-film__control").textContent();
    if (ended.trim() !== "Replay") fail(`${label} ended`, `control says ${ended}`);
    await page.locator(".city-film__control").click();
    await page.waitForFunction(() => {
      const video = document.querySelector("video");
      return video && !video.paused && video.currentTime < 1.5;
    });
    console.log("[normal]", label, JSON.stringify({ started, paused, offscreenPaused, ended: ended.trim(), requests: mp4Requests.length }));
    await context.close();
  }

  {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    const mp4Requests = [];
    page.on("request", (request) => {
      if (request.url().endsWith(".mp4")) mp4Requests.push(request.url());
    });
    await page.goto(routeUrl(route.path), { waitUntil: "networkidle" });
    const reduced = await page.evaluate(() => {
      const video = document.querySelector("[data-city-film] video");
      const control = document.querySelector(".city-film__control");
      return {
        source: video?.getAttribute("src"),
        currentSource: video?.currentSrc,
        poster: video?.poster,
        state: video?.closest("[data-city-film]")?.dataset.mediaState,
        controlHidden: control?.hidden,
        runningAnimations: document.getAnimations().filter((animation) => animation.playState === "running").length,
      };
    });
    if (mp4Requests.length || reduced.source || reduced.currentSource) fail(`${label} reduced`, "MP4 attached or requested");
    if (!reduced.poster || reduced.state !== "static" || !reduced.controlHidden || reduced.runningAnimations) {
      fail(`${label} reduced`, JSON.stringify(reduced));
    }
    console.log("[reduced]", label, JSON.stringify({ ...reduced, requests: mp4Requests.length }));
    await context.close();
  }

  {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const mp4Requests = [];
    page.on("request", (request) => {
      if (request.url().endsWith(".mp4")) mp4Requests.push(request.url());
    });
    await page.goto(routeUrl(route.path), { waitUntil: "networkidle" });
    const nojs = await page.evaluate(() => {
      const isVisible = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      return {
        h1: isVisible(document.querySelector("h1")),
        poster: isVisible(document.querySelector(".city-film noscript img")),
        caption: isVisible(document.querySelector(".city-film figcaption")),
        control: isVisible(document.querySelector(".city-film__control")),
      };
    });
    if (mp4Requests.length || !nojs.h1 || !nojs.poster || !nojs.caption || nojs.control) {
      fail(`${label} nojs`, JSON.stringify({ ...nojs, requests: mp4Requests.length }));
    }
    console.log("[nojs]", label, JSON.stringify({ ...nojs, requests: mp4Requests.length }));
    await context.close();
  }
}

{
  const route = routes[0];
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true, effectiveType: "4g" },
    });
  });
  const page = await context.newPage();
  const mp4Requests = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".mp4")) mp4Requests.push(request.url());
  });
  await page.goto(routeUrl(route.path), { waitUntil: "networkidle" });
  const before = await page.evaluate(() => ({
    source: document.querySelector("video")?.getAttribute("src"),
    control: document.querySelector(".city-film__control")?.textContent.trim(),
    hidden: document.querySelector(".city-film__control")?.hidden,
  }));
  if (mp4Requests.length || before.source || before.control !== "Play" || before.hidden) {
    fail("save-data before click", JSON.stringify({ before, requests: mp4Requests.length }));
  }
  await page.locator(".city-film__control").click();
  await page.waitForFunction(() => document.querySelector("video")?.readyState >= 2);
  if (mp4Requests.length !== 1) fail("save-data after click", `expected one MP4 request, got ${mp4Requests.length}`);
  console.log("[save-data]", JSON.stringify({ before, requestsAfterClick: mp4Requests.length }));
  await context.close();
}

{
  const route = routes[1];
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.route("**/*.mp4", (request) => request.abort());
  await page.goto(routeUrl(route.path), { waitUntil: "load" });
  await page.waitForTimeout(800);
  const errored = await page.evaluate(() => {
    const figure = document.querySelector("[data-city-film]");
    const video = figure?.querySelector("video");
    const control = figure?.querySelector(".city-film__control");
    return {
      state: figure?.dataset.mediaState,
      poster: video?.poster,
      source: video?.getAttribute("src"),
      currentSource: video?.currentSrc,
      readyState: video?.readyState,
      controlHidden: control?.hidden,
    };
  });
  if (errored.state !== "error" || !errored.poster || errored.source || errored.readyState !== 0 || !errored.controlHidden) {
    fail("media error fallback", JSON.stringify(errored));
  }
  console.log("[error]", JSON.stringify(errored));
  await context.close();
}

await browser.close();
if (failures.length) {
  console.error("\nFAILURES");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log("\nV14 media audit passed.");
