const { chromium } = require("playwright");

const baseUrl = process.env.REFINEMENT_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const routes = ["/", "/products", "/products/blankie-solid", "/projects", "/blog", "/yarn-guide", "/about", "/contact"];

function intersects(a, b) {
  return Math.min(a.right, b.right) - Math.max(a.left, b.left) > 2
    && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 2;
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({ viewport, colorScheme: "dark" });
  await context.addInitScript(() => {
    localStorage.removeItem("fakhri_theme");
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
  });

  for (const route of routes) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    const result = await page.evaluate(() => {
      const footer = document.querySelector(".site-footer");
      const footerGroups = [...document.querySelectorAll(".footer-main > *")].map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
      });
      const header = document.querySelector(".site-header .nav-shell")?.getBoundingClientRect();
      return {
        theme: document.documentElement.dataset.theme,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        footerHeight: footer?.getBoundingClientRect().height || 0,
        footerGroups,
        headerTop: header?.top ?? -999,
      };
    });

    if (result.theme !== "light") throw new Error(`${route}: default theme must be light even with a dark OS preference`);
    if (result.overflow > 1) throw new Error(`${route}: horizontal overflow ${result.overflow}px at ${viewport.width}px`);
    if (result.headerTop < -2) throw new Error(`${route}: navigation is clipped above the viewport`);
    if (errors.length) throw new Error(`${route}: runtime errors: ${errors.join(" | ")}`);

    if (viewport.width >= 1200) {
      for (let first = 0; first < result.footerGroups.length; first += 1) {
        for (let second = first + 1; second < result.footerGroups.length; second += 1) {
          if (intersects(result.footerGroups[first], result.footerGroups[second])) {
            throw new Error(`${route}: footer groups ${first} and ${second} overlap`);
          }
        }
      }
    } else if (result.footerHeight > 1600) {
      throw new Error(`${route}: mobile footer remains excessively tall (${result.footerHeight}px)`);
    }

    if (route === "/blog" && viewport.width >= 1200) {
      const proofFill = await page.locator(".guides-hero-proof").evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const children = [...node.children].map((child) => child.getBoundingClientRect());
        return (Math.max(...children.map((item) => item.bottom)) - Math.min(...children.map((item) => item.top))) / rect.height;
      });
      if (proofFill < .72) throw new Error(`/blog: hero proof card still has excessive empty space (${proofFill})`);
    }

    if (route === "/products/blankie-solid") {
      const fit = await page.locator(".product-detail-hero-image").evaluate((node) => getComputedStyle(node).objectFit);
      if (fit !== "contain") throw new Error(`/products/blankie-solid: product hero image is cropped (${fit})`);
    }

    await page.close();
  }

  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  try {
    await auditViewport(browser, { width: 1440, height: 1000 });
    await auditViewport(browser, { width: 390, height: 844 });
    console.log("Site-wide readability and structural refinement audit passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
