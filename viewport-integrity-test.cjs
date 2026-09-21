const { chromium } = require("playwright");

const baseUrl = process.env.VIEWPORT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const routes = [
  "/",
  "/products",
  "/products/blankie-solid",
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

  await page.evaluatefunction isIgnorableGoogleMapsError(value) {
  const text = String(value || "");
  return /maps\.gstatic\.com\/maps-api|maps\.googleapis\.com\/\$rpc\/google\.internal\.maps|<gmp-place-details-compact>/i.test(text);
}

(async () => {
    window.__scrollLayoutReads = 0;
    const root = document.documentElement;
    const maximum = Math.max(0, Math.min(root.scrollHeight - window.innerHeight, 2600));
    const steps = 42;
    for (let step = 0; step <= steps; step += 1) {
      window.scrollTo(0, Math.round(maximum * (step / steps)));
      await new Promise((resolve) => window.requestAnimationFrame(resolve));
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
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
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

  if (oldScrollClasses.length) throw new Error(`legacy header state classes are still active: ${oldScrollClasses.join(", ")}`);
  if (heightRange > 1.25) throw new Error(`header layout height changes during morph: ${JSON.stringify({ heightRange, heights })}`);
  if (reversed) throw new Error(`header nav reverses/jitters during the initial morph: ${JSON.stringify(navTops)}`);
  if (maxJump > 7) throw new Error(`header nav has an abrupt scroll transition: ${JSON.stringify({ maxJump, navTops })}`);
  if (first.navTop - last.navTop < 20) throw new Error(`header nav did not complete its compact morph: ${JSON.stringify({ first, last })}`);
  if (last.morph < 0.98 || last.announcementOpacity > 0.08) throw new Error(`header morph did not settle cleanly: ${JSON.stringify(last)}`);
  if (last.headerBackground !== "rgba(0, 0, 0, 0)" || last.headerBoxShadow !== "none") throw new Error(`header wrapper still paints a second visual layer: ${JSON.stringify(last)}`);
  if (last.headerBackdropFilter !== "none") throw new Error(`header wrapper should not own the glass blur: ${JSON.stringify(last)}`);
  if (!last.navBackgroundImage || last.navBackgroundImage === "none") throw new Error(`single nav surface is missing its liquid-glass paint: ${JSON.stringify(last)}`);
}

(async () => {
  const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}) });
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
        page.on("pageerror", (error) => {
          const detail = error.stack || error.message;
          if (!isIgnorableGoogleMapsError(detail)) errors.push(error.message);
        });
        page.on("console", (message) => {
          if (message.type() === "error" && !isIgnorableGoogleMapsError(`${message.text()} ${message.location()?.url || ""}`)) errors.push(message.text());
        });

        try {
          await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
          await page.waitForFunction(() => (
            document.readyState === "complete" &&
            document.documentElement.dataset.motionProfile &&
            document.querySelector(".route-stage") &&
            !document.documentElement.classList.contains("intro-booting")
          ));
          await page.evaluate(() => document.fonts.ready);

          const audit = await page.evaluate(() => {
            const body = document.body;
            const root = document.documentElement;
            const header = document.querySelector(".site-header");
            const nav = document.querySelector(".nav-shell");
            const modelViewer = document.querySelector("model-viewer");
            return {
              scrollWidth: Math.max(body.scrollWidth, root.scrollWidth),
              clientWidth: root.clientWidth,
              headerTop: header?.getBoundingClientRect().top ?? null,
              navHeight: nav?.getBoundingClientRect().height ?? null,
              modelViewerPresent: Boolean(modelViewer),
            };
          });

          if (audit.scrollWidth - audit.clientWidth > 1) throw new Error(`horizontal overflow ${audit.scrollWidth - audit.clientWidth}px`);
          if (audit.headerTop !== null && Math.abs(audit.headerTop) > 1) throw new Error(`sticky header starts at ${audit.headerTop}px`);
          if (audit.navHeight !== null && audit.navHeight < 48) throw new Error(`nav shell is unexpectedly short: ${audit.navHeight}px`);
          if (audit.modelViewerPresent) throw new Error("legacy model-viewer runtime is still mounted");
          if (errors.length) throw new Error(`browser errors: ${errors.join(" | ")}`);

          if (route === "/") {
            const headerAudit = await auditHeaderMorph(page);
            assertHeaderMorphIsSeamless(headerAudit);
            const scrollReads = await auditScrollLayoutReads(page);
            if (scrollReads > 8) throw new Error(`scroll path performs too many layout reads: ${scrollReads}`);
          }
        } catch (error) {
          failures.push({ viewport: viewport.name, size: `${viewport.width}x${viewport.height}`, route, error: error.message });
        } finally {
          await page.close();
        }
      }

      await context.close();
      console.log(`${viewport.name.padEnd(8)} ${viewport.width}x${viewport.height}: ${routes.length} critical routes checked`);
    }
  } finally {
    await browser.close();
  }

  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }

  console.log("Viewport and mobile integrity checks passed.");
})();
