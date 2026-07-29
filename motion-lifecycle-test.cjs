const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function expectHidden(page, selector, timeout = 1200) {
  await page.waitForFunction(
    (target) => !document.querySelector(target),
    selector,
    { timeout },
  );
}

(async () => {
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
  });
  const failures = [];
  const results = [];

  async function run(name, task) {
    try {
      await task();
      results.push({ name, status: "passed" });
      console.log(`PASS ${name}`);
    } catch (error) {
      failures.push({ name, error: error.message });
      console.error(`FAIL ${name}: ${error.message}`);
    }
  }

  await run("intro phases, focus, Escape and cleanup", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });

    const intro = page.locator('[aria-label="Fakhri Mart introduction"]');
    await intro.waitFor({ state: "visible", timeout: 5000 });
    check(await intro.getAttribute("data-phase") === "tension", "intro did not begin in tension phase");
    check(await page.locator("body").evaluate((node) => node.classList.contains("intro-running")), "body scroll lock was not applied");
    await page.getByRole("button", { name: "Skip intro" }).waitFor({ state: "visible" });
    check(
      await page.getByRole("button", { name: "Skip intro" }).evaluate((node) => node === document.activeElement),
      "Skip control did not receive focus",
    );

    await page.keyboard.press("Escape");
    await expectHidden(page, '[aria-label="Fakhri Mart introduction"]');
    const cleanup = await page.evaluate(() => ({
      bodyLocked:
        document.body.classList.contains("intro-running") ||
        document.body.classList.contains("intro-hold-hero"),
      booting: document.documentElement.classList.contains("intro-booting"),
    }));
    check(!cleanup.bodyLocked && !cleanup.booting, "intro left a page lock behind");
    await context.close();
  });

  await run("intro full automatic lifecycle and session replay rules", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });
    const phases = new Set();
    await page.waitForSelector('[aria-label="Fakhri Mart introduction"]', { timeout: 5000 });

    const started = Date.now();
    while (Date.now() - started < 5000) {
      const phase = await page
        .locator('[aria-label="Fakhri Mart introduction"]')
        .getAttribute("data-phase")
        .catch(() => null);
      if (phase) phases.add(phase);
      if (!(await page.locator('[aria-label="Fakhri Mart introduction"]').count())) break;
      await page.waitForTimeout(90);
    }

    check(phases.has("material"), "material phase was not observed");
    check(phases.has("identity"), "identity phase was not observed");
    check(phases.has("handoff"), "handoff phase was not observed");
    await expectHidden(page, '[aria-label="Fakhri Mart introduction"]', 1000);

    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(700);
    check(
      !(await page.locator('[aria-label="Fakhri Mart introduction"]').count()),
      "intro replayed after it had been remembered for the session",
    );

    await page.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });
    await page.locator('[aria-label="Fakhri Mart introduction"]').waitFor({
      state: "visible",
      timeout: 5000,
    });
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expectHidden(page, '[aria-label="Fakhri Mart introduction"]');
    await context.close();
  });

  await run("reduced and lite profiles", async () => {
    const reduced = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const reducedPage = await reduced.newPage();
    await reducedPage.goto(`${baseUrl}/?intro=1`, { waitUntil: "networkidle" });
    check(
      await reducedPage.locator("html").getAttribute("data-motion-profile") === "reduced",
      "reduced-motion preference did not select the reduced profile",
    );
    check(
      !(await reducedPage.locator('[aria-label="Fakhri Mart introduction"]').count()),
      "intro rendered for a reduced-motion visitor",
    );
    await reduced.close();

    const lite = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await lite.addInitScript(() => {
      Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 1 });
    });
    const litePage = await lite.newPage();
    await litePage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    check(
      await litePage.locator("html").getAttribute("data-motion-profile") === "lite",
      "low-memory device did not select the lite profile",
    );
    await lite.close();
  });

  await run("route families, rapid navigation and history", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_v3", "played");
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    check(
      await page.locator(".route-stage").getAttribute("data-route-family") === "home",
      "home route family was not assigned",
    );
    await page.locator('.desktop-nav a[href="/products"]').click();
    await page.waitForURL("**/products");
    await page.locator('.route-stage[data-route-family="catalogue"]').waitFor();
    await page.locator('.desktop-nav a[href="/gallery"]').click();
    await page.waitForURL("**/gallery");
    await page.goBack();
    await page.waitForURL("**/products");
    await page.locator('.route-stage[data-route-family="catalogue"]').waitFor();
    await page.goForward();
    await page.waitForURL("**/gallery");
    await page.locator('.route-stage[data-route-family="editorial"]').waitFor();
    check(errors.length === 0, `route lifecycle logged errors: ${errors.join(" | ")}`);
    await context.close();
  });

  await run("search and mobile drawer presence lifecycle", async () => {
    const desktop = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await desktop.addInitScript(() => sessionStorage.setItem("fakhri_intro_v3", "played"));
    const page = await desktop.newPage();
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /search/i }).click();
    const dialog = page.locator(".search-dialog");
    check(await dialog.getAttribute("aria-modal") === "true", "search dialog did not enter");
    check(
      await page.locator(".command-search input").evaluate((node) => node === document.activeElement),
      "search input did not receive focus",
    );
    await page.keyboard.press("Escape");
    await page.waitForTimeout(350);
    check(!(await page.locator(".search-dialog-backdrop").evaluate((node) => node.classList.contains("is-open"))), "search backdrop remained open");
    check(!(await page.locator("body").evaluate((node) => node.classList.contains("dialog-lock"))), "search dialog left body locked");
    await desktop.close();

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobile.addInitScript(() => sessionStorage.setItem("fakhri_intro_v3", "played"));
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await mobilePage.getByRole("button", { name: "Menu", exact: true }).click();
    const drawer = mobilePage.locator(".mobile-nav-drawer");
    await drawer.waitFor({ state: "visible" });
    check(await drawer.getAttribute("aria-hidden") === "false", "mobile drawer did not enter");
    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForTimeout(350);
    check(await drawer.getAttribute("aria-hidden") === "true", "mobile drawer did not exit");
    check(!(await mobilePage.locator("body").evaluate((node) => node.classList.contains("menu-lock"))), "mobile drawer left body locked");
    await mobile.close();
  });

  await run("catalogue filtering and detail feedback", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() => sessionStorage.setItem("fakhri_intro_v3", "played"));
    const page = await context.newPage();
    await page.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
    const firstBefore = await page.locator("[data-product-key]").first().getAttribute("data-product-key");
    await page.locator("#product-sort-select").selectOption("name-asc");
    await page.waitForTimeout(500);
    const firstAfter = await page.locator("[data-product-key]").first().getAttribute("data-product-key");
    check(firstBefore && firstAfter, "catalogue items disappeared after sorting");
    check(
      (await page.locator("[data-product-key]").count()) > 3,
      "catalogue did not retain a useful result set",
    );

    await page.goto(`${baseUrl}/products/makhhi-thread`, { waitUntil: "networkidle" });
    const valueBefore = await page.locator(".quantity-value-feedback").textContent();
    await page.getByRole("button", { name: "Increase quantity" }).click();
    const valueAfter = await page.locator(".quantity-value-feedback").textContent();
    check(valueBefore !== valueAfter, "quantity feedback did not update");
    check(
      (await page.locator(".quantity-value-feedback").evaluate((node) => node.getAnimations().length)) > 0,
      "quantity feedback animation did not run",
    );
    await context.close();
  });

  await browser.close();

  if (failures.length) {
    console.error(JSON.stringify({ results, failures }, null, 2));
    process.exit(1);
  }

  console.log(`\nMotion lifecycle suite passed (${results.length} scenarios).`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
