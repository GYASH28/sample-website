const { chromium } = require("playwright");

const BASE_URL = "http://127.0.0.1:4173";

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
    const intro = page.locator('[aria-label="Fakhri Mart cinematic introduction"]');
    await intro.waitFor({ state: "visible", timeout: 5000 });

    assert((await intro.locator("figure").count()) === 3, "Intro should contain three editorial scenes");
    assert((await intro.locator("img").count()) >= 4, "Intro should use real photography and the real logo");

    await page.waitForFunction(() => {
      const overlay = document.querySelector('[aria-label="Fakhri Mart cinematic introduction"]');
      return overlay && overlay.dataset.phase !== "opening";
    }, { timeout: 2500 });

    const skip = intro.getByRole("button", { name: /skip intro/i });
    await skip.click();
    await intro.waitFor({ state: "detached", timeout: 2500 });
    await page.locator("[data-home-hero-frame]").waitFor({ state: "visible", timeout: 5000 });

    await page.waitForFunction(() => document.querySelectorAll('[data-scroll-scene="true"]').length >= 5);
    const initialProgress = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-scroll")) || 0,
    );
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(350);
    const finalProgress = await page.evaluate(() =>
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--page-scroll")) || 0,
    );
    assert(finalProgress > initialProgress + 0.45, "Global scroll progress should respond to page movement");

    const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
    mobile.on("console", (message) => {
      if (message.type() === "error") errors.push(`mobile: ${message.text()}`);
    });
    mobile.on("pageerror", (error) => errors.push(`mobile: ${error.message}`));
    await mobile.goto(`${BASE_URL}/?intro=1`, { waitUntil: "networkidle" });
    const mobileIntro = mobile.locator('[aria-label="Fakhri Mart cinematic introduction"]');
    await mobileIntro.waitFor({ state: "visible", timeout: 5000 });

    const mobileMetrics = await mobileIntro.locator("figure").first().evaluate((scene) => {
      const stage = scene.parentElement;
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
    await mobile.close();

    assert(errors.length === 0, `Browser errors detected:\n${errors.join("\n")}`);
    console.log("✓ Cinematic intro and scroll direction passed desktop and mobile regression checks");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
