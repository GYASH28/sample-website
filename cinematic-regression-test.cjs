const { chromium } = require("playwright");

const BASE_URL = "http://127.0.0.1:4173";
const INTRO_SELECTOR = '.commerce-intro[aria-label="Fakhri Mart opening sequence"]';
const HERO_STAGE_SELECTOR = ".hero-v6__stage";
const SPOOL_SELECTOR = ".scroll-spool-progress";
const SPOOL_RING_SELECTOR = ".scroll-spool-progress__ring";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto(`${BASE_URL}/?intro=1`, { waitUntil: "networkidle" });
    const intro = page.locator(INTRO_SELECTOR);
    await intro.waitFor({ state: "visible", timeout: 5000 });

    assert((await intro.locator("figure").count()) === 3, "Intro should contain three editorial scenes");
    assert((await intro.locator("img").count()) >= 4, "Intro should use real photography and the real logo");

    await page.waitForFunction((selector) => {
      const overlay = document.querySelector(selector);
      return overlay && overlay.dataset.phase !== "thread";
    }, INTRO_SELECTOR, { timeout: 2500 });

    const skip = intro.getByRole("button", { name: /skip intro/i });
    await skip.click();
    await intro.waitFor({ state: "detached", timeout: 2500 });
    await page.locator(HERO_STAGE_SELECTOR).waitFor({ state: "visible", timeout: 5000 });

    await page.waitForFunction(() => document.querySelectorAll('[data-scroll-scene="true"]').length >= 5);
    await page.locator(SPOOL_SELECTOR).waitFor({ state: "attached", timeout: 3000 });

    const initialProgress = await page.evaluate((ringSelector) => {
      const ring = document.querySelector(ringSelector);
      return Number.parseFloat(ring?.style.strokeDashoffset || "100");
    }, SPOOL_RING_SELECTOR);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(350);

    const finalProgress = await page.evaluate(({ spoolSelector, ringSelector }) => {
      const spool = document.querySelector(spoolSelector);
      const ring = document.querySelector(ringSelector);
      return {
        dashOffset: Number.parseFloat(ring?.style.strokeDashoffset || "100"),
        active: Boolean(spool?.classList.contains("is-active")),
      };
    }, { spoolSelector: SPOOL_SELECTOR, ringSelector: SPOOL_RING_SELECTOR });

    assert(
      finalProgress.dashOffset < initialProgress - 45,
      `Spool progress ring should respond to page movement: ${JSON.stringify({ initialProgress, finalProgress })}`,
    );
    assert(finalProgress.active, "Spool progress control should become active after page movement");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.on("console", (message) => {
      if (message.type() === "error") errors.push(`mobile: ${message.text()}`);
    });
    mobile.on("pageerror", (error) => errors.push(`mobile: ${error.message}`));
    await mobile.goto(`${BASE_URL}/?intro=1`, { waitUntil: "networkidle" });
    const mobileIntro = mobile.locator(INTRO_SELECTOR);
    await mobileIntro.waitFor({ state: "visible", timeout: 5000 });

    const mobileMetrics = await mobileIntro.locator(".commerce-intro__materials").evaluate((stage) => {
      const rect = stage.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    assert(
      mobileMetrics.left >= -1 && mobileMetrics.right <= mobileMetrics.viewportWidth + 1,
      `Mobile cinema frame exceeds viewport: ${JSON.stringify(mobileMetrics)}`,
    );
    assert(
      mobileMetrics.documentWidth <= mobileMetrics.viewportWidth + 1,
      `Mobile intro creates horizontal page overflow: ${JSON.stringify(mobileMetrics)}`,
    );

    await mobileIntro.getByRole("button", { name: /skip intro/i }).click();
    await mobileIntro.waitFor({ state: "detached", timeout: 2500 });
    await mobile.locator(HERO_STAGE_SELECTOR).waitFor({ state: "visible", timeout: 5000 });
    await mobile.close();

    assert(errors.length === 0, `Browser errors detected:\n${errors.join("\n")}`);
    console.log("✓ Opening sequence, animated hero, and spool progress passed desktop/mobile regression checks");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
