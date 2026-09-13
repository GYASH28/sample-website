const { chromium } = require("playwright");

const BASE_URL = process.env.GUIDE_ABOUT_BASE_URL || "http://127.0.0.1:4173";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

(async () => {
  const browser = await chromium.launch();
  try {
    const desktop = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await desktop.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
      localStorage.setItem("fakhri_theme", "light");
    });

    const guide = await desktop.newPage();
    const guideErrors = await collectErrors(guide);
    await guide.goto(`${BASE_URL}/blog`, { waitUntil: "networkidle", timeout: 30_000 });

    assert(await guide.locator("#quantity-planner").count() === 1, "Guides page is missing the quantity planner");
    assert(await guide.locator("#shade-checklist").count() === 1, "Guides page is missing the shade checklist");
    assert(await guide.locator("#wholesale-checklist").count() === 1, "Guides page is missing the wholesale checklist");
    assert(await guide.getByRole("heading", { name: "Start with the job the material has to do" }).count() === 1, "Guides page is missing practical material guidance");

    await guide.getByLabel("Pattern needs").fill("550");
    await guide.getByLabel("One pack contains").fill("100");
    await guide.getByLabel("Safety buffer").selectOption("10");
    const calculatorText = await guide.locator(".quantity-calculator__result").innerText();
    assert(/7\s+packs/i.test(calculatorText), `Quantity calculator returned an unexpected result: ${calculatorText}`);

    const home = await desktop.newPage();
    const homeErrors = await collectErrors(home);
    await home.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 30_000 });
    assert(await home.locator(".home-guide-help").count() === 1, "Homepage is missing the useful guide entry section");

    const about = await desktop.newPage();
    const aboutErrors = await collectErrors(about);
    await about.goto(`${BASE_URL}/about`, { waitUntil: "networkidle", timeout: 30_000 });
    const aboutState = await about.evaluate(() => ({
      legacy3d: Boolean(document.querySelector(".brand-model-highlight, model-viewer")),
      modelScript: Boolean(document.querySelector('script[data-fakhri-model-viewer="true"]')),
      stats: Boolean(document.querySelector(".about-v22__stats")),
      audience: Boolean(document.querySelector(".about-v22__audience")),
      truth: Boolean(document.querySelector(".about-v22__truth")),
      process: Boolean(document.querySelector(".about-v22__process")),
      location: Boolean(document.querySelector(".about-v22__location")),
    }));
    assert(!aboutState.legacy3d && !aboutState.modelScript, `Legacy 3D About experience still exists: ${JSON.stringify(aboutState)}`);
    assert(aboutState.stats && aboutState.audience && aboutState.truth && aboutState.process && aboutState.location, `About page is missing practical trust content: ${JSON.stringify(aboutState)}`);

    assert(guideErrors.length === 0, `Guides browser errors:\n${guideErrors.join("\n")}`);
    assert(homeErrors.length === 0, `Homepage browser errors:\n${homeErrors.join("\n")}`);
    assert(aboutErrors.length === 0, `About browser errors:\n${aboutErrors.join("\n")}`);

    await desktop.close();

    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await mobile.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
      localStorage.setItem("fakhri_theme", "light");
    });
    for (const route of ["/blog", "/about"]) {
      const page = await mobile.newPage();
      const errors = await collectErrors(page);
      await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
      const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      assert(overflow <= 1, `${route} has ${overflow}px horizontal overflow on mobile`);
      assert(errors.length === 0, `${route} mobile browser errors:\n${errors.join("\n")}`);
      await page.close();
    }
    await mobile.close();

    console.log("✓ Guides are practical and interactive, homepage help is discoverable, About is useful and 3D-free, and both pages remain mobile-safe");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
