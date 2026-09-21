const { chromium } = require("playwright");

const BASE_URL = process.env.RESPONSIVE_COMMERCE_BASE_URL || "http://127.0.0.1:4173";

const viewports = [
  { name: "mobile-320", width: 320, height: 568, mobile: true, expectedColumns: 1 },
  { name: "mobile-360", width: 360, height: 800, mobile: true, expectedColumns: 2 },
  { name: "mobile-375", width: 375, height: 812, mobile: true, expectedColumns: 2 },
  { name: "mobile-390", width: 390, height: 844, mobile: true, expectedColumns: 2, quickView: true },
  { name: "mobile-393", width: 393, height: 873, mobile: true, expectedColumns: 2 },
  { name: "mobile-412", width: 412, height: 915, mobile: true, expectedColumns: 2 },
  { name: "mobile-430", width: 430, height: 932, mobile: true, expectedColumns: 2 },
  { name: "tablet-768", width: 768, height: 1024, mobile: true, minimumColumns: 2 },
  { name: "mobile-landscape", width: 844, height: 390, mobile: true, quickView: true },
  { name: "small-desktop-1024", width: 1024, height: 768 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "desktop-1366", width: 1366, height: 768 },
  { name: "desktop-1440", width: 1440, height: 960, quickView: true },
  { name: "desktop-1920", width: 1920, height: 1080 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function gridColumnCount(value) {
  if (!value || value === "none") return 0;
  return value.trim().split(/\s+/).length;
}

async function assertNoOverflow(page, label) {
  const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  assert(overflow <= 1, `${label}: horizontal overflow ${overflow}px`);
}

async function openRoute(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector("#main-content"));
  await page.evaluate(() => document.fonts.ready);
}

async function auditViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: Boolean(viewport.mobile),
    hasTouch: Boolean(viewport.mobile),
    reducedMotion: "reduce",
    colorScheme: "dark",
  });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v2", "played");
    localStorage.setItem("fakhri_theme", "dark");
  });

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  try {
    await openRoute(page, "/");
    await assertNoOverflow(page, `${viewport.name} home`);
    assert(await page.locator(".commerce-product-section").count() === 1, `${viewport.name}: homepage should keep one primary featured product section`);
    assert(await page.locator(".theme-toggle").count() === 0, `${viewport.name}: theme toggle returned`);
    assert(await page.evaluate(() => document.documentElement.dataset.theme) === "light", `${viewport.name}: stale dark preference escaped the light-only lock`);

    if (viewport.width <= 430) {
      const rail = page.locator(".commerce-product-rail");
      const railBox = await rail.boundingBox();
      const first = await rail.locator(".product-card").first().boundingBox();
      const second = await rail.locator(".product-card").nth(1).boundingBox();
      assert(railBox && first && second, `${viewport.name}: homepage featured rail is not measurable`);
      assert(await rail.evaluate((node) => node.scrollWidth > node.clientWidth + 40), `${viewport.name}: homepage featured rail should scroll horizontally`);
      assert(first.width < viewport.width * 0.9, `${viewport.name}: featured card is too wide to hint at horizontal scrolling`);
      assert(second.x < viewport.width, `${viewport.name}: next featured card is not partially visible`);
    }

    if (viewport.width <= 800) {
      const menu = page.locator(".menu-toggle");
      assert(await menu.isVisible(), `${viewport.name}: mobile menu trigger is not visible`);
      await menu.click();
      const drawer = page.locator(".mobile-nav-drawer.is-open");
      await drawer.waitFor({ state: "visible" });
      const drawerBox = await drawer.boundingBox();
      assert(drawerBox && drawerBox.left >= -1 && drawerBox.right <= viewport.width + 1, `${viewport.name}: mobile drawer leaves the viewport`);
      await page.locator(".mobile-drawer-header .icon-button").click();
      await page.locator(".mobile-nav-drawer").waitFor({ state: "hidden" });
    }

    await openRoute(page, "/products");
    await assertNoOverflow(page, `${viewport.name} catalogue`);
    const grid = page.locator(".product-grid--filtered");
    await grid.waitFor({ state: "visible" });
    const columns = gridColumnCount(await grid.evaluate((node) => getComputedStyle(node).gridTemplateColumns));
    if (viewport.expectedColumns) {
      assert(columns === viewport.expectedColumns, `${viewport.name}: expected ${viewport.expectedColumns} catalogue columns, got ${columns}`);
    }
    if (viewport.minimumColumns) {
      assert(columns >= viewport.minimumColumns, `${viewport.name}: expected at least ${viewport.minimumColumns} catalogue columns, got ${columns}`);
    }

    if (viewport.width <= 800) {
      const filterButton = page.locator(".mobile-filter-trigger");
      assert(await filterButton.isVisible(), `${viewport.name}: mobile filter trigger is not visible`);
      await filterButton.click();
      const sheet = page.locator(".smart-filter-panel.is-open");
      await sheet.waitFor({ state: "visible" });
      const box = await sheet.boundingBox();
      assert(box && box.left >= -1 && box.right <= viewport.width + 1 && box.top >= -1 && box.bottom <= viewport.height + 1,
        `${viewport.name}: filter sheet is outside the viewport: ${JSON.stringify(box)}`);
      await page.locator(".mobile-filter-sheet-header .icon-button").click();
      await page.waitForFunction(() => !document.querySelector(".smart-filter-panel")?.classList.contains("is-open"));
    }

    if (viewport.quickView) {
      const trigger = page.locator(".product-card-quick-view").first();
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await trigger.click();
      const quick = page.locator(".quick-view");
      await quick.waitFor({ state: "visible" });
      const box = await quick.boundingBox();
      assert(box && box.left >= -1 && box.right <= viewport.width + 1 && box.top >= -1 && box.bottom <= viewport.height + 1,
        `${viewport.name}: Quick View is outside the viewport: ${JSON.stringify(box)}`);
      assert(await page.locator("body.quick-view-open").count() === 1, `${viewport.name}: Quick View did not lock page scrolling`);
      assert(await quick.getByRole("button", { name: "Bulk / wholesale" }).count() === 1, `${viewport.name}: Quick View bulk mode is missing`);
      if (viewport.width <= 800) {
        assert(box.height <= viewport.height * 0.94, `${viewport.name}: mobile Quick View consumes too much viewport height: ${box.height}`);
        const contentOverflow = await quick.locator(".quick-view__content").evaluate((node) => getComputedStyle(node).overflowY);
        assert(["auto", "scroll"].includes(contentOverflow), `${viewport.name}: Quick View content does not own internal scrolling`);
      }
      await page.keyboard.press("Escape");
      await quick.waitFor({ state: "hidden" });
      assert(await page.locator("body.quick-view-open").count() === 0, `${viewport.name}: Quick View left body scroll locked`);
      assert(await trigger.evaluate((node) => document.activeElement === node), `${viewport.name}: Quick View did not restore focus to its trigger`);
    }

    await assertNoOverflow(page, `${viewport.name} final catalogue state`);
    assert(errors.length === 0, `${viewport.name}: browser errors: ${errors.join(" | ")}`);
    console.log(`✓ ${viewport.name}: responsive commerce contract passed`);
  } finally {
    await page.close();
    await context.close();
  }
}

(async () => {
  const browser = await chromium.launch();
  try {
    for (const viewport of viewports) await auditViewport(browser, viewport);
  } finally {
    await browser.close();
  }
  console.log("Responsive commerce regression passed.");
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
