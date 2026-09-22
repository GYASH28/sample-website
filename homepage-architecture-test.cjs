const { chromium } = require("playwright");

const BASE_URL = process.env.HOMEPAGE_ARCH_BASE_URL || "http://127.0.0.1:4173";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function audit(viewport) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: Boolean(viewport.mobile),
    hasTouch: Boolean(viewport.mobile),
  });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
    localStorage.setItem("fakhri_theme", "dark");
  });

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 30_000 });
    await page.waitForFunction(() => document.querySelector("#main-content"));
    // Deferred discovery sections intentionally stay out of the first render.
    // Exercise the full page before auditing its complete information architecture.
    await page.evaluate(async () => {
      for (let top = 0; top < document.documentElement.scrollHeight; top += Math.max(420, window.innerHeight * 0.75)) {
        window.scrollTo({ top, behavior: "instant" });
        await new Promise((resolve) => window.setTimeout(resolve, 45));
      }
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    });
    await page.waitForFunction(() => document.querySelector(".commerce-order-flow"), null, { timeout: 10_000 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));

    const metrics = await page.evaluate(() => {
      const rails = [...document.querySelectorAll(".commerce-product-section")];
      const featuredRail = document.querySelector(".commerce-product-rail");
      return {
        theme: document.documentElement.dataset.theme,
        themeToggles: document.querySelectorAll(".theme-toggle").length,
        productSections: rails.length,
        productCardsInFeatured: featuredRail?.querySelectorAll(".product-card").length || 0,
        categoryLinks: document.querySelectorAll(".commerce-category-nav a").length,
        brandLinks: document.querySelectorAll(".commerce-brand-nav__chip").length,
        categoryCards: document.querySelectorAll(".commerce-category-card").length,
        hasSearch: Boolean(document.querySelector(".hero-v7__search")),
        hasProjectFinder: Boolean(document.querySelector(".commerce-craft-finder")),
        hasGuideHelp: Boolean(document.querySelector(".home-guide-help")),
        hasOrdering: Boolean(document.querySelector(".commerce-order-flow")),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        railClientWidth: featuredRail?.clientWidth || 0,
        railScrollWidth: featuredRail?.scrollWidth || 0,
      };
    });

    assert(metrics.theme === "dark", `${viewport.name}: saved dark theme was not preserved`);
    assert(metrics.themeToggles >= 1, `${viewport.name}: accessible theme control is missing`);
    assert(metrics.productSections === 1, `${viewport.name}: homepage rendered ${metrics.productSections} giant product shelves instead of one featured rail`);
    assert(metrics.productCardsInFeatured >= 6 && metrics.productCardsInFeatured <= 10, `${viewport.name}: featured rail should contain 6–10 products, got ${metrics.productCardsInFeatured}`);
    assert(metrics.categoryLinks >= 4, `${viewport.name}: top-level material discovery is missing`);
    assert(metrics.brandLinks >= 3, `${viewport.name}: compact brand discovery is missing`);
    assert(metrics.categoryCards >= 4, `${viewport.name}: material/category cards are missing`);
    assert(metrics.hasSearch, `${viewport.name}: primary search entry is missing`);
    assert(metrics.hasProjectFinder, `${viewport.name}: project finder is missing`);
    assert(metrics.hasGuideHelp, `${viewport.name}: guide/help section is missing`);
    assert(metrics.hasOrdering, `${viewport.name}: ordering explanation is missing`);
    assert(metrics.overflow <= 1, `${viewport.name}: homepage has horizontal overflow of ${metrics.overflow}px`);

    if (viewport.mobile) {
      assert(metrics.railScrollWidth > metrics.railClientWidth + 40, `${viewport.name}: featured product rail does not horizontally scroll`);
      const cards = page.locator(".commerce-product-rail .product-card");
      const first = await cards.first().boundingBox();
      const second = await cards.nth(1).boundingBox();
      assert(first && second, `${viewport.name}: product cards are not measurable`);
      assert(first.width < viewport.width * 0.9, `${viewport.name}: first product card is too wide to hint at horizontal scrolling`);
      assert(second.x < viewport.width, `${viewport.name}: next product card is not partially visible`);
    }

    assert(errors.length === 0, `${viewport.name}: browser errors: ${errors.join(" | ")}`);
    console.log(`✓ ${viewport.name}: homepage hierarchy is intentional and product rail behaviour is correct`);
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

(async () => {
  await audit({ name: "desktop", width: 1440, height: 960 });
  await audit({ name: "mobile-390", width: 390, height: 844, mobile: true });
  await audit({ name: "mobile-320", width: 320, height: 568, mobile: true });
  console.log("Homepage architecture regression passed.");
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
