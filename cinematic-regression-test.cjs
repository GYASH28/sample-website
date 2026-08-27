const { chromium } = require("playwright");

const BASE_URL = "http://127.0.0.1:4173";
const INTRO_SELECTOR = '.commerce-intro[aria-label="Fakhri Mart opening sequence"]';
const HERO_STAGE_SELECTOR = ".hero-v6__stage";
const SPOOL_SELECTOR = ".scroll-spool-progress";
const SPOOL_RING_SELECTOR = ".scroll-spool-progress__ring";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertIntroShell(page, label) {
  const shell = await page.evaluate((selector) => {
    const overlay = document.querySelector(selector);
    const stylesheet = [...document.styleSheets].find((sheet) => sheet.href?.includes("commerce-intro-v18.css"));
    if (!overlay) return { missing: true };
    const rect = overlay.getBoundingClientRect();
    const style = getComputedStyle(overlay);
    const skip = overlay.querySelector(".commerce-intro__skip")?.getBoundingClientRect();
    return {
      missing: false,
      className: overlay.className,
      position: style.position,
      opacity: Number.parseFloat(style.opacity),
      width: rect.width,
      height: rect.height,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      inlineStyleTag: Boolean(overlay.querySelector("style")),
      stylesheetLoaded: Boolean(stylesheet),
      bodyLocked: document.body.classList.contains("commerce-intro-open"),
      skip: skip ? { left: skip.left, top: skip.top, right: skip.right, bottom: skip.bottom } : null,
    };
  }, INTRO_SELECTOR);

  assert(!shell.missing, `${label}: opening overlay should exist`);
  assert(shell.className.includes("commerce-intro--v18"), `${label}: expected hardened v18 intro shell`);
  assert(shell.position === "fixed", `${label}: intro must be a fixed viewport overlay: ${JSON.stringify(shell)}`);
  assert(shell.opacity > 0.95, `${label}: intro should render fully visible: ${JSON.stringify(shell)}`);
  assert(Math.abs(shell.width - shell.viewportWidth) <= 2, `${label}: intro width should match viewport: ${JSON.stringify(shell)}`);
  assert(Math.abs(shell.height - shell.viewportHeight) <= 2, `${label}: intro height should match viewport: ${JSON.stringify(shell)}`);
  assert(!shell.inlineStyleTag, `${label}: intro CSS must not be injected inside the animated overlay`);
  assert(shell.stylesheetLoaded, `${label}: external intro stylesheet must be loaded before playback`);
  assert(shell.bodyLocked, `${label}: page should be locked only while intro is active`);
  assert(
    shell.skip && shell.skip.left >= -1 && shell.skip.top >= -1 && shell.skip.right <= shell.viewportWidth + 1 && shell.skip.bottom <= shell.viewportHeight + 1,
    `${label}: skip control must stay inside viewport: ${JSON.stringify(shell)}`,
  );
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
    await assertIntroShell(page, "desktop");

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
    assert(!(await page.evaluate(() => document.body.classList.contains("commerce-intro-open"))), "Desktop intro must always release the body lock after exit");

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
    await assertIntroShell(mobile, "mobile");

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
    assert(!(await mobile.evaluate(() => document.body.classList.contains("commerce-intro-open"))), "Mobile intro must always release the body lock after exit");
    await mobile.close();

    assert(errors.length === 0, `Browser errors detected:\n${errors.join("\n")}`);
    console.log("✓ Opening stylesheet, lifecycle cleanup, cinematic intro, hero and spool progress passed desktop/mobile regression checks");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
