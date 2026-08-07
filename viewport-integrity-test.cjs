const { chromium } = require("playwright");

const baseUrl = process.env.VIEWPORT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const routes = [
  "/",
  "/products",
  "/products/makhhi-thread",
  "/about",
  "/blog",
  "/contact",
  "/enquiry",
  "/wishlist",
];
const viewports = [
  { name: "minimum", width: 320, height: 800, mobile: true },
  { name: "mobile", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1440, height: 960, mobile: false },
  { name: "wide", width: 1728, height: 1080, mobile: false },
];

async function auditScrollLayoutReads(page) {
  await page.evaluate(() => {
    const prototype = Element.prototype;
    const original = prototype.getBoundingClientRect;
    window.__scrollLayoutReads = 0;
    prototype.getBoundingClientRect = function instrumentedGetBoundingClientRect(...args) {
      window.__scrollLayoutReads += 1;
      return original.apply(this, args);
    };
  });

  await page.evaluate(async () => {
    window.__scrollLayoutReads = 0;
    const root = document.documentElement;
    const maximum = Math.max(0, Math.min(root.scrollHeight - window.innerHeight, 2600));
    const steps = 42;

    for (let step = 0; step <= steps; step += 1) {
      const progress = step / steps;
      window.scrollTo(0, Math.round(maximum * progress));
      await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
    }
  });

  return page.evaluate(() => window.__scrollLayoutReads || 0);
}

async function auditHeaderMorph(page) {
  return page.evaluate(async () => {
    const header = document.querySelector(".site-header");
    const announcement = header?.querySelector(".announcement-bar");
    const nav = header?.querySelector(".nav-shell");
    if (!header || !announcement || !nav) throw new Error("header morph elements are missing");

    const positions = [0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120];
    const samples = [];

    for (const y of positions) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => window.requestAnimationFrame(() => requestAnimationFrame(resolve)));

      const headerRect = header.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      const announcementStyle = getComputedStyle(announcement);
      const headerStyle = getComputedStyle(header);
      const navStyle = getComputedStyle(nav);
      samples.push({
        y,
        headerHeight: headerRect.height,
        navTop: navRect.top,
        navHeight: navRect.height,
        morph: Number.parseFloat(header.style.getPropertyValue("--header-morph") || "0"),
        announcementOpacity: Number.parseFloat(announcementStyle.opacity || "1"),
        headerBackground: headerStyle.backgroundColor,
        headerBoxShadow: headerStyle.boxShadow,
        headerBackdropFilter: headerStyle.backdropFilter || headerStyle.webkitBackdropFilter || "none",
        navBackgroundImage: navStyle.backgroundImage,
        navBackdropFilter: navStyle.backdropFilter || navStyle.webkitBackdropFilter || "none",
      });
    }

    return {
      samples,
      oldScrollClasses: ["is-scrolled", "is-deep", "is-scrolling"].filter((name) => header.classList.contains(name)),
    };
  });
}

function assertHeaderMorphIsSeamless(audit) {
  const { samples, oldScrollClasses } = audit;
  const first = samples[0];
  const last = samples[samples.length - 1];
  const heights = samples.map((sample) => sample.headerHeight);
  const heightRange = Math.max(...heights) - Math.min(...heights);
  const navTops = samples.map((sample) => sample.navTop);
  const jumps = navTops.slice(1).map((top, index) => Math.abs(top - navTops[index]));
  const maxJump = Math.max(...jumps);
  const reversed = navTops.slice(1).some((top, index) => top > navTops[index] + 0.75);

  if (oldScrollClasses.length) {
    throw new Error(`legacy header state classes are still active: ${oldScrollClasses.join(", ")}`);
  }
  if (heightRange > 1.25) {
    throw new Error(`header layout height changes during morph: ${JSON.stringify({ heightRange, heights })}`);
  }
  if (reversed) {
    throw new Error(`header nav reverses/jitters during the initial morph: ${JSON.stringify(navTops)}`);
  }
  if (maxJump > 7) {
    throw new Error(`header nav has an abrupt scroll transition: ${JSON.stringify({ maxJump, navTops })}`);
  }
  if (first.navTop - last.navTop < 20) {
    throw new Error(`header nav did not complete its compact morph: ${JSON.stringify({ first, last })}`);
  }
  if (last.morph < 0.98 || last.announcementOpacity > 0.08) {
    throw new Error(`header morph did not settle cleanly: ${JSON.stringify(last)}`);
  }
  if (last.headerBackground !== "rgba(0, 0, 0, 0)" || last.headerBoxShadow !== "none") {
    throw new Error(`header wrapper still paints a second visual layer: ${JSON.stringify(last)}`);
  }
  if (last.headerBackdropFilter !== "none") {
    throw new Error(`header wrapper should not own the glass blur: ${JSON.stringify(last)}`);
  }
  if (!last.navBackgroundImage || last.navBackgroundImage === "none") {
    throw new Error(`single nav surface is missing its liquid-glass paint: ${JSON.stringify(last)}`);
  }
}

(async () => {
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
  });
  const failures = [];

  try {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.mobile,
        hasTouch: viewport.mobile,
      });
      await context.addInitScript(() => {
        sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
        localStorage.setItem("fakhri_theme", "light");
      });

      for (const route of routes) {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        page.on("console", (message) => {
          if (message.type() === "error") errors.push(message.text());
        });

        try {
          await page.goto(`${baseUrl}${route}`, {
            waitUntil: "networkidle",
            timeout: 30_000,
          });
          await page.waitForFunction(() => {
            return (
              document.readyState === "complete" &&
              document.documentElement.dataset.motionProfile &&
              document.querySelector(".route-stage") &&
              !document.documentElement.classList.contains("intro-booting")
            );
          });
          await page.evaluate(() => document.fonts.ready);

          const state = await page.evaluate(() => {
            const root = document.documentElement;
            const routeStage = document.querySelector(".route-stage");
            return {
              h1Count: document.querySelectorAll("h1").length,
              overflow: Math.max(0, root.scrollWidth - root.clientWidth),
              routeStageHeight: routeStage?.getBoundingClientRect().height || 0,
              viewportHeight: window.innerHeight,
              brokenImages: [...document.images]
                .filter((image) => image.complete && image.naturalWidth === 0)
                .map((image) => image.currentSrc || image.src),
              locks: [
                "intro-running",
                "intro-hold-hero",
                "dialog-lock",
                "menu-lock",
              ].filter((className) => document.body.classList.contains(className)),
            };
          });

          if (state.h1Count !== 1) {
            throw new Error(`expected one h1, found ${state.h1Count}`);
          }
          if (state.overflow > 1) {
            throw new Error(`horizontal overflow ${state.overflow}px`);
          }
          if (state.routeStageHeight < state.viewportHeight - 90) {
            throw new Error(
              `route stage is not full-screen enough: ${state.routeStageHeight}px for ${state.viewportHeight}px viewport`,
            );
          }
          if (state.brokenImages.length) {
            throw new Error(`broken images: ${state.brokenImages.join(", ")}`);
          }
          if (state.locks.length) {
            throw new Error(`stale body locks: ${state.locks.join(", ")}`);
          }

          if (route === "/") {
            const headerAudit = await auditHeaderMorph(page);
            assertHeaderMorphIsSeamless(headerAudit);

            const headerState = await page.evaluate(() => {
              const announcement = document.querySelector(".announcement-bar");
              const spool = document.querySelector(".scroll-spool-progress");
              const styles = announcement ? getComputedStyle(announcement) : null;
              const spoolStyles = spool ? getComputedStyle(spool) : null;
              return {
                announcementOpacity: Number.parseFloat(styles?.opacity || "1"),
                spoolPresent: Boolean(spool),
                spoolOpacity: Number.parseFloat(spoolStyles?.opacity || "0"),
              };
            });
            if (headerState.announcementOpacity > 0.08) {
              throw new Error(`announcement bar did not fade away: ${JSON.stringify(headerState)}`);
            }
            if (!headerState.spoolPresent) {
              throw new Error("spool scroll progress control is missing");
            }
            if (!viewport.mobile && viewport.width > 1024 && headerState.spoolOpacity < 0.5) {
              throw new Error(`spool scroll progress did not become visible: ${JSON.stringify(headerState)}`);
            }
          }

          if (route === "/about") {
            const modelState = await page.evaluate(() => ({
              highlightPresent: Boolean(document.querySelector(".brand-model-highlight")),
              loadButtonPresent: Boolean(document.querySelector(".brand-model-highlight__poster button")),
              viewerScriptPreloaded: Boolean(document.querySelector('script[data-fakhri-model-viewer="true"]')),
            }));
            if (!modelState.highlightPresent || !modelState.loadButtonPresent) {
              throw new Error(`3D brand highlight is missing: ${JSON.stringify(modelState)}`);
            }
            if (modelState.viewerScriptPreloaded) {
              throw new Error(`3D runtime should not load before user interaction: ${JSON.stringify(modelState)}`);
            }
          }

          if (!viewport.mobile && route === "/about") {
            const toggle = page.locator(".theme-toggle").first();
            await toggle.click();
            await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
            const darkState = await page.evaluate(() => ({
              theme: document.documentElement.dataset.theme,
              colorScheme: document.documentElement.style.colorScheme,
              bodyBackground: getComputedStyle(document.body).backgroundColor,
              headerWrapper: getComputedStyle(document.querySelector(".site-header")).backgroundColor,
              headerGlass: getComputedStyle(document.querySelector(".site-header .nav-shell")).backgroundImage,
            }));
            if (darkState.theme !== "dark" || darkState.colorScheme !== "dark") {
              throw new Error(`dark mode did not activate: ${JSON.stringify(darkState)}`);
            }
            if (darkState.headerWrapper !== "rgba(0, 0, 0, 0)" || darkState.headerGlass === "none") {
              throw new Error(`dark header lost single-surface liquid glass: ${JSON.stringify(darkState)}`);
            }
            await toggle.click();
            await page.waitForFunction(() => document.documentElement.dataset.theme === "light");
          }

          if (!viewport.mobile && route === "/products") {
            const layoutReads = await auditScrollLayoutReads(page);
            if (layoutReads > 18) {
              throw new Error(`scroll triggered too many JS layout reads: ${layoutReads}`);
            }
          }

          if (errors.length) {
            throw new Error(`console errors: ${errors.join(" | ")}`);
          }
        } catch (error) {
          failures.push({
            viewport: viewport.name,
            size: `${viewport.width}x${viewport.height}`,
            route,
            error: error.message,
          });
        } finally {
          await page.close();
        }
      }

      console.log(
        `${viewport.name.padEnd(8)} ${viewport.width}x${viewport.height}: ${routes.length} critical routes checked`,
      );
      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }
  console.log("\nViewport, seamless-header, dark-mode, 3D-highlight, and scroll layout-read suite passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
