const { chromium } = require("playwright");

const baseUrl = process.env.INTERACTION_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const AUTO_WAIT_MS = 6900;

async function openPage(context, path = "/") {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => (
    document.readyState === "complete" &&
    document.documentElement.dataset.motionProfile &&
    document.querySelector(".route-stage") &&
    !document.documentElement.classList.contains("intro-booting")
  ));
  await page.evaluate(() => document.fonts.ready);
  return { page, errors };
}

async function testDesktop(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
    localStorage.setItem("fakhri_theme", "light");
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 8 });
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 8 });
  });
  const { page, errors } = await openPage(context);

  const baseLayers = await page.evaluate(() => ({
    header: Number.parseInt(getComputedStyle(document.querySelector(".site-header")).zIndex, 10) || 0,
    main: Number.parseInt(getComputedStyle(document.querySelector("main")).zIndex, 10) || 0,
  }));
  if (baseLayers.header <= baseLayers.main) {
    throw new Error(`header must be above page content: ${JSON.stringify(baseLayers)}`);
  }

  const initialTop = await page.locator(".site-header .nav-shell").evaluate((node) => node.getBoundingClientRect().top);
  await page.evaluate(() => window.scrollTo({ top: 120, behavior: "instant" }));
  await page.waitForTimeout(140);
  const scrolledTop = await page.locator(".site-header .nav-shell").evaluate((node) => node.getBoundingClientRect().top);
  if (Math.abs(initialTop - scrolledTop) > 2) {
    throw new Error(`header shifted or clipped while scrolling: ${JSON.stringify({ initialTop, scrolledTop })}`);
  }
  if (scrolledTop < -2) throw new Error(`navigation escaped above viewport: ${scrolledTop}`);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(100);
  await page.locator(".mega-toggle").click();
  const mega = page.locator(".category-mega-menu");
  await mega.waitFor({ state: "visible" });
  const megaAudit = await mega.evaluate((node) => {
    const rect = node.getBoundingClientRect();
    const x = Math.max(2, Math.min(window.innerWidth - 2, rect.left + rect.width / 2));
    const y = Math.max(2, Math.min(window.innerHeight - 2, rect.top + Math.min(80, rect.height / 2)));
    const hit = document.elementFromPoint(x, y);
    return {
      z: Number.parseInt(getComputedStyle(node).zIndex, 10) || 0,
      headerZ: Number.parseInt(getComputedStyle(document.querySelector(".site-header")).zIndex, 10) || 0,
      left: rect.left,
      right: rect.right,
      viewportWidth: window.innerWidth,
      hitInside: Boolean(hit && node.contains(hit)),
    };
  });
  if (megaAudit.z <= megaAudit.headerZ) throw new Error(`mega menu must layer above header surface: ${JSON.stringify(megaAudit)}`);
  if (megaAudit.left < -1 || megaAudit.right > megaAudit.viewportWidth + 1) throw new Error(`mega menu escapes viewport: ${JSON.stringify(megaAudit)}`);
  if (!megaAudit.hitInside) throw new Error(`page content is painting over the mega menu: ${JSON.stringify(megaAudit)}`);
  await page.keyboard.press("Escape");

  const hero = page.locator(".commerce-hero");
  await hero.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector(".commerce-hero")?.dataset.autoplay === "running");
  const heroIndex = page.locator(".hero-v7__edge-index strong");
  const firstIndex = (await heroIndex.textContent())?.trim();
  await page.locator(".hero-v7__visual").hover();
  await page.waitForTimeout(AUTO_WAIT_MS);
  const afterHoverIndex = (await heroIndex.textContent())?.trim();
  if (afterHoverIndex === firstIndex) throw new Error("featured carousel stopped merely because the pointer rested over it");

  await page.locator(".hero-v7__pause").click();
  const pausedIndex = (await heroIndex.textContent())?.trim();
  if ((await hero.getAttribute("data-autoplay")) !== "paused") throw new Error("manual carousel pause did not enter paused state");
  await page.waitForTimeout(AUTO_WAIT_MS);
  const afterPauseIndex = (await heroIndex.textContent())?.trim();
  if (afterPauseIndex !== pausedIndex) throw new Error("carousel advanced while explicitly paused");
  await page.locator(".hero-v7__pause").click();
  await page.waitForFunction(() => document.querySelector(".commerce-hero")?.dataset.autoplay === "running");
  await page.waitForTimeout(AUTO_WAIT_MS);
  const resumedIndex = (await heroIndex.textContent())?.trim();
  if (resumedIndex === pausedIndex) throw new Error("carousel did not resume after pressing play");

  const quickButton = page.locator(".product-card-quick-view").first();
  await quickButton.scrollIntoViewIfNeeded();
  await quickButton.click();
  const quick = page.locator(".quick-view");
  await quick.waitFor({ state: "visible" });
  const modalLayers = await page.evaluate(() => ({
    quick: Number.parseInt(getComputedStyle(document.querySelector(".quick-view-layer")).zIndex, 10) || 0,
    header: Number.parseInt(getComputedStyle(document.querySelector(".site-header")).zIndex, 10) || 0,
  }));
  if (modalLayers.quick <= modalLayers.header) throw new Error(`quick view must cover the header: ${JSON.stringify(modalLayers)}`);

  // New enquiry controls must work inside Quick View, not just render.
  const bulkMode = quick.getByRole("button", { name: "Bulk / wholesale" });
  await bulkMode.click();
  if ((await bulkMode.getAttribute("aria-pressed")) !== "true") throw new Error("Quick View bulk mode did not activate");
  const hundredPreset = quick.locator(".quick-view__quantity-presets button").filter({ hasText: /^100$/ });
  if (await hundredPreset.count() !== 1) throw new Error("Quick View bulk quantity preset 100 is missing");
  await hundredPreset.click();
  const requestedQuantity = (await quick.locator(".quick-view__stepper output").textContent())?.trim();
  if (requestedQuantity !== "100") throw new Error(`Quick View bulk preset did not update quantity: ${requestedQuantity}`);
  await quick.getByRole("button", { name: /^Add to enquiry$/ }).click();
  const basketItem = await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]")[0]);
  if (!basketItem || basketItem.quantity !== 100 || !basketItem.note?.includes("Enquiry mode: Bulk")) {
    throw new Error(`Quick View did not persist bulk mode and quantity into enquiry basket: ${JSON.stringify(basketItem)}`);
  }

  await page.locator(".quick-view__details").focus();
  await page.keyboard.press("Tab");
  const wrappedToClose = await page.locator(".quick-view__close").evaluate((node) => document.activeElement === node);
  if (!wrappedToClose) throw new Error("Quick View focus escaped instead of wrapping to the first control");
  await page.keyboard.press("Escape");
  await quick.waitFor({ state: "detached" });

  await page.keyboard.press("Control+K");
  const search = page.locator(".search-dialog");
  await search.waitFor({ state: "visible" });
  const searchLayers = await page.evaluate(() => ({
    search: Number.parseInt(getComputedStyle(document.querySelector(".search-dialog-backdrop")).zIndex, 10) || 0,
    header: Number.parseInt(getComputedStyle(document.querySelector(".site-header")).zIndex, 10) || 0,
  }));
  if (searchLayers.search <= searchLayers.header) throw new Error(`search must cover navigation: ${JSON.stringify(searchLayers)}`);
  await page.keyboard.press("Escape");

  if (errors.length) throw new Error(`desktop browser errors: ${errors.join(" | ")}`);
  await context.close();
}

async function testMobile(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
    localStorage.setItem("fakhri_theme", "light");
  });
  const { page, errors } = await openPage(context);

  const menu = page.locator(".menu-toggle");
  await menu.click();
  const drawer = page.locator(".mobile-nav-drawer");
  await drawer.waitFor({ state: "visible" });
  const drawerAudit = await page.evaluate(() => ({
    drawer: Number.parseInt(getComputedStyle(document.querySelector(".mobile-nav-drawer")).zIndex, 10) || 0,
    header: Number.parseInt(getComputedStyle(document.querySelector(".site-header")).zIndex, 10) || 0,
    locked: document.body.classList.contains("menu-lock"),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  if (drawerAudit.drawer <= drawerAudit.header) throw new Error(`mobile drawer must cover header: ${JSON.stringify(drawerAudit)}`);
  if (!drawerAudit.locked) throw new Error("mobile navigation did not lock background scrolling");
  if (drawerAudit.overflow > 1) throw new Error(`mobile navigation creates horizontal overflow: ${drawerAudit.overflow}px`);
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector(".mobile-nav-drawer")?.classList.contains("is-open"));

  const firstRail = page.locator(".commerce-product-rail").first();
  await firstRail.scrollIntoViewIfNeeded();
  await page.waitForTimeout(180);
  const railSection = firstRail.locator("xpath=ancestor::section[1]");
  const railButtons = railSection.locator(".commerce-rail-actions button");
  const buttonCount = await railButtons.count();
  if (buttonCount !== 2) throw new Error(`mobile overflowing rail should expose two scroll controls, found ${buttonCount}`);
  if (!(await railButtons.nth(0).isDisabled())) throw new Error("left rail control should start disabled at scroll origin");
  if (await railButtons.nth(1).isDisabled()) throw new Error("right rail control should be enabled when more products are off-screen");
  await railButtons.nth(1).click();
  await page.waitForTimeout(500);
  const railState = await firstRail.evaluate((node) => ({ left: node.scrollLeft, max: node.scrollWidth - node.clientWidth }));
  if (railState.left < 10) throw new Error(`rail next control did not move the scroller: ${JSON.stringify(railState)}`);
  if (await railButtons.nth(0).isDisabled()) throw new Error("left rail control did not enable after moving right");

  if (errors.length) throw new Error(`mobile browser errors: ${errors.join(" | ")}`);
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}) });
  try {
    await testDesktop(browser);
    await testMobile(browser);
    console.log("Interaction, layering and carousel integrity checks passed.");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
