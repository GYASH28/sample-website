const { chromium } = require("playwright");

const baseUrl = process.env.MOTION_BASE_URL || "http://127.0.0.1:4173";
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

async function waitForStablePage(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => {
    return (
      document.documentElement.dataset.motionProfile &&
      !document.documentElement.classList.contains("intro-booting") &&
      !document.body.classList.contains("intro-running")
    );
  });
}

async function addIntroPhaseProbe(context) {
  await context.addInitScript(() => {
    window.__introPhaseHistory = [];
    const record = () => {
      const phase = document
        .querySelector('[aria-label="Fakhri Mart introduction"]')
        ?.getAttribute("data-phase");
      if (
        phase &&
        window.__introPhaseHistory.at(-1) !== phase
      ) {
        window.__introPhaseHistory.push(phase);
      }
    };
    new MutationObserver(record).observe(document, {
      attributes: true,
      attributeFilter: ["data-phase"],
      childList: true,
      subtree: true,
    });
    record();
  });
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
    await addIntroPhaseProbe(context);
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });

    const intro = page.locator('[aria-label="Fakhri Mart introduction"]');
    await intro.waitFor({ state: "visible", timeout: 5000 });
    check(
      (await page.evaluate(() => window.__introPhaseHistory))[0] === "tension",
      "intro did not begin in tension phase",
    );
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

  await run("legacy playback marker does not suppress the cinematic intro", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_v3", "played");
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await page
      .locator('[aria-label="Fakhri Mart introduction"]')
      .waitFor({ state: "visible", timeout: 5000 });
    await page.getByRole("button", { name: "Skip intro" }).click();
    await expectHidden(page, '[aria-label="Fakhri Mart introduction"]');
    await context.close();
  });

  await run("intro full automatic lifecycle and session replay rules", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await addIntroPhaseProbe(context);
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[aria-label="Fakhri Mart introduction"]', { timeout: 5000 });
    await expectHidden(page, '[aria-label="Fakhri Mart introduction"]', 5000);
    const phaseHistory = await page.evaluate(() => window.__introPhaseHistory);
    const expectedPhases = [
      "tension",
      "material-one",
      "material-two",
      "identity",
      "handoff",
    ];
    check(
      expectedPhases.every(
        (phase, index) => phaseHistory.indexOf(phase) === index,
      ),
      `intro phase order was incomplete: ${phaseHistory.join(" → ")}`,
    );

    await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
    await waitForStablePage(page);
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

  await run("reduced, compact and lite profile-specific cuts", async () => {
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

    const compact = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const compactPage = await compact.newPage();
    await compactPage.goto(`${baseUrl}/?intro=1`, {
      waitUntil: "domcontentloaded",
    });
    const compactIntro = compactPage.locator(
      '[aria-label="Fakhri Mart introduction"]',
    );
    await compactIntro.waitFor({ state: "visible" });
    check(
      await compactIntro.getAttribute("data-profile") === "compact",
      "mobile intro did not use the compact cut",
    );
    check(
      (await compactIntro.locator("img").count()) === 2,
      "compact cut rendered more than one editorial image plus the logo",
    );
    check(
      Number(await compactIntro.getAttribute("data-cut-duration")) <= 1700,
      "compact cut is configured beyond the 1.2–1.7 second budget",
    );
    await compactIntro.waitFor({ state: "detached", timeout: 3000 });
    await compact.close();

    const lite = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await lite.addInitScript(() => {
      Object.defineProperty(navigator, "deviceMemory", { configurable: true, get: () => 1 });
    });
    const litePage = await lite.newPage();
    await litePage.goto(`${baseUrl}/?intro=1`, { waitUntil: "domcontentloaded" });
    const liteIntro = litePage.locator(
      '[aria-label="Fakhri Mart introduction"]',
    );
    await liteIntro.waitFor({ state: "visible" });
    check(
      await litePage.locator("html").getAttribute("data-motion-profile") === "lite",
      "low-memory device did not select the lite profile",
    );
    check(
      (await liteIntro.locator("img").count()) === 1,
      "lite cut rendered editorial media instead of identity only",
    );
    check(
      Number(await liteIntro.getAttribute("data-cut-duration")) <= 1000,
      "lite cut is configured beyond the 0.6–1.0 second budget",
    );
    await liteIntro.waitFor({ state: "detached", timeout: 2000 });
    await lite.close();
  });

  await run("route families, rapid navigation and history", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v1", "played");
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
    await desktop.addInitScript(() =>
      sessionStorage.setItem("fakhri_intro_cinematic_v1", "played"),
    );
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
    await page.waitForFunction(() => {
      return (
        !document
          .querySelector(".search-dialog-backdrop")
          ?.classList.contains("is-open") &&
        !document.body.classList.contains("dialog-lock")
      );
    });
    check(!(await page.locator(".search-dialog-backdrop").evaluate((node) => node.classList.contains("is-open"))), "search backdrop remained open");
    check(!(await page.locator("body").evaluate((node) => node.classList.contains("dialog-lock"))), "search dialog left body locked");
    await desktop.close();

    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobile.addInitScript(() =>
      sessionStorage.setItem("fakhri_intro_cinematic_v1", "played"),
    );
    const mobilePage = await mobile.newPage();
    await mobilePage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await mobilePage.getByRole("button", { name: "Menu", exact: true }).click();
    const drawer = mobilePage.locator(".mobile-nav-drawer");
    await drawer.waitFor({ state: "visible" });
    check(await drawer.getAttribute("aria-hidden") === "false", "mobile drawer did not enter");
    await mobilePage.keyboard.press("Escape");
    await mobilePage.waitForFunction(() => {
      return (
        document
          .querySelector(".mobile-nav-drawer")
          ?.getAttribute("aria-hidden") === "true" &&
        !document.body.classList.contains("menu-lock")
      );
    });
    check(await drawer.getAttribute("aria-hidden") === "true", "mobile drawer did not exit");
    check(!(await mobilePage.locator("body").evaluate((node) => node.classList.contains("menu-lock"))), "mobile drawer left body locked");
    await mobile.close();
  });

  await run("gallery lightbox focus, navigation and cleanup", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() =>
      sessionStorage.setItem("fakhri_intro_cinematic_v1", "played"),
    );
    const page = await context.newPage();
    await page.goto(`${baseUrl}/gallery`, { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", {
      name: /Open From yarn to a finished bag/,
    });
    await trigger.click();
    const dialog = page.getByRole("dialog", {
      name: "Fullscreen gallery",
    });
    await dialog.waitFor({ state: "visible" });
    check(
      await dialog.evaluate((node) => node.parentElement === document.body),
      "lightbox was trapped inside the transformed route stage",
    );
    check(
      await page
        .getByRole("button", { name: "Close Lightbox" })
        .evaluate((node) => node === document.activeElement),
      "lightbox close control did not receive focus",
    );

    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() =>
      document.body.textContent.includes("2 / 6: Colour-rich yarn ranges"),
    );
    await page.getByRole("button", { name: "Close Lightbox" }).focus();
    await page.keyboard.press("Shift+Tab");
    check(
      await page
        .getByRole("button", { name: "Next Image" })
        .evaluate((node) => node === document.activeElement),
      "lightbox focus trap did not wrap backward",
    );

    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "detached" });
    check(
      await trigger.evaluate((node) => node === document.activeElement),
      "lightbox did not restore focus to its trigger",
    );
    check(
      await page.locator("body").evaluate(
        (node) =>
          !node.classList.contains("dialog-lock") &&
          node.style.overflow !== "hidden",
      ),
      "lightbox left a body lock behind",
    );
    await context.close();
  });

  await run("catalogue filtering and detail feedback", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(() =>
      sessionStorage.setItem("fakhri_intro_cinematic_v1", "played"),
    );
    const page = await context.newPage();
    await page.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
    const firstBefore = await page.locator("[data-product-key]").first().getAttribute("data-product-key");
    await page.locator("#product-sort-select").selectOption("name-asc");
    await page.waitForFunction(
      () => document.querySelector("#product-sort-select")?.value === "name-asc",
    );
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
