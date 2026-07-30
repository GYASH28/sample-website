const { chromium } = require("playwright");

const baseUrl = process.env.VIEWPORT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const routes = [
  "/",
  "/products",
  "/products/makhhi-thread",
  "/gallery",
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
        sessionStorage.setItem("fakhri_intro_cinematic_v1", "played");
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
            return {
              h1Count: document.querySelectorAll("h1").length,
              overflow: Math.max(0, root.scrollWidth - root.clientWidth),
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
          if (state.brokenImages.length) {
            throw new Error(`broken images: ${state.brokenImages.join(", ")}`);
          }
          if (state.locks.length) {
            throw new Error(`stale body locks: ${state.locks.join(", ")}`);
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
  console.log("\nViewport integrity suite passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
