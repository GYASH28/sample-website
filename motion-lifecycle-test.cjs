const { chromium } = require("playwright");

const BASE_URL = process.env.MOTION_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForStablePage(page) {
  await page.waitForLoadState("networkidle");
  await page.waitForFunction(() => {
    return Boolean(
      document.documentElement.dataset.motionProfile &&
      document.querySelector("main#main-content") &&
      document.querySelector(".route-stage"),
    );
  });
}

async function waitForRouteFamily(page, family) {
  await page.waitForFunction(
    (expected) => document.querySelector(".route-stage")?.dataset.routeFamily === expected,
    family,
    { timeout: 5_000 },
  );
}

async function createRememberedContext(browser, options = {}) {
  const context = await browser.newContext(options);
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
  });
  return context;
}

(async () => {
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
  });
  const failures = [];

  async function run(name, task) {
    try {
      await task();
      console.log(`PASS ${name}`);
    } catch (error) {
      failures.push({ name, error: error.message });
      console.error(`FAIL ${name}: ${error.message}`);
    }
  }

  await run("opening sequence focus, Escape and body-lock cleanup", async () => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/?intro=1`, { waitUntil: "domcontentloaded" });

    const intro = page.getByRole("dialog", { name: "Fakhri Mart opening sequence" });
    await intro.waitFor({ state: "visible", timeout: 5_000 });
    check(
      await page.locator("body").evaluate((node) => node.classList.contains("commerce-intro-open")),
      "opening sequence did not lock the page",
    );

    const skip = page.getByRole("button", { name: /skip intro/i });
    await skip.waitFor({ state: "visible" });
    check(
      await skip.evaluate((node) => node === document.activeElement),
      "opening sequence skip control did not receive focus",
    );

    await page.keyboard.press("Escape");
    await intro.waitFor({ state: "detached", timeout: 2_000 });
    check(
      !(await page.locator("body").evaluate((node) => node.classList.contains("commerce-intro-open"))),
      "opening sequence left the body locked after exit",
    );
    await context.close();
  });

  await run("reduced-motion visitors skip the opening sequence", async () => {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    check(
      await page.locator("html").getAttribute("data-motion-profile") === "reduced",
      "reduced-motion preference did not select the reduced motion profile",
    );
    check(
      (await page.getByRole("dialog", { name: "Fakhri Mart opening sequence" }).count()) === 0,
      "opening sequence rendered for a reduced-motion visitor",
    );
    await context.close();
  });

  await run("current route families, rapid navigation and history stay clean", async () => {
    const context = await createRememberedContext(browser, { viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await waitForStablePage(page);
    await waitForRouteFamily(page, "home");

    await page.getByRole("link", { name: "Products", exact: true }).click();
    await page.waitForURL("**/products");
    await waitForRouteFamily(page, "catalogue");

    await page.getByRole("link", { name: "Projects", exact: true }).click();
    await page.waitForURL("**/projects");
    await waitForRouteFamily(page, "catalogue");

    await page.getByRole("link", { name: "About", exact: true }).click();
    await page.waitForURL("**/about");
    await waitForRouteFamily(page, "editorial");

    await page.goBack();
    await page.waitForURL("**/projects");
    await waitForRouteFamily(page, "catalogue");
    await page.goForward();
    await page.waitForURL("**/about");
    await waitForRouteFamily(page, "editorial");

    check(errors.length === 0, `route lifecycle logged errors: ${errors.join(" | ")}`);
    check(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1),
      "route lifecycle introduced horizontal overflow",
    );
    await context.close();
  });

  await run("mobile drawer exits cleanly and restores the page", async () => {
    const context = await createRememberedContext(browser, {
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await waitForStablePage(page);

    const drawer = page.locator(".mobile-nav-drawer");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    await page.waitForFunction(() => document.querySelector(".mobile-nav-drawer")?.getAttribute("aria-hidden") === "false");
    check(await drawer.getAttribute("aria-hidden") === "false", "mobile drawer did not open");
    check(
      await page.locator("body").evaluate((node) => node.classList.contains("menu-lock")),
      "mobile drawer did not lock the page",
    );

    await page.keyboard.press("Escape");
    await page.waitForFunction(() => {
      const drawerNode = document.querySelector(".mobile-nav-drawer");
      return drawerNode?.getAttribute("aria-hidden") === "true" && !document.body.classList.contains("menu-lock");
    });
    check(await drawer.getAttribute("aria-hidden") === "true", "mobile drawer did not close");
    check(
      await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth <= 1),
      "mobile page has horizontal overflow after drawer cleanup",
    );
    await context.close();
  });

  await browser.close();

  if (failures.length) {
    console.error("\nMotion lifecycle failures:");
    failures.forEach((failure) => console.error(`- ${failure.name}: ${failure.error}`));
    process.exit(1);
  }

  console.log("\nMotion lifecycle checks passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
