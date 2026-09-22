const { chromium } = require("playwright");

const BASE_URL = process.env.SHADE_PREVIEW_BASE_URL || "http://127.0.0.1:4173";
const PRODUCT_PATH = "/products/blankie-solid";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch();
  const errors = [];
  const legacyColourImageRequests = [];

  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
      localStorage.setItem("fakhri_theme", "light");
    });

    const page = await context.newPage();
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("request", (request) => {
      const url = request.url();
      if (/\/color-[^/]+\.webp(?:\?|$)/i.test(url)) legacyColourImageRequests.push(url);
    });

    await page.goto(`${BASE_URL}${PRODUCT_PATH}`, { waitUntil: "networkidle", timeout: 30_000 });

    const studio = page.getByRole("region", { name: "Colour reference picker" }).first();
    await studio.waitFor({ state: "visible", timeout: 5000 });

    const hero = page.locator(".product-detail-hero-image");
    await hero.waitFor({ state: "visible", timeout: 5000 });

    const originalImage = await hero.evaluate((image) => ({
      src: image.getAttribute("src"),
      currentSrc: image.currentSrc,
    }));
    assert(originalImage.src, "Product hero should have a source before previewing colours");
    assert(originalImage.currentSrc, "Product hero should resolve an image before previewing colours");

    const teal = studio.getByRole("button", { name: "Select Teal" });
    await teal.click();
    await page.waitForFunction(() => document.querySelector(".shade-preview-studio__heading strong")?.textContent?.includes("#328F89"));

    const tealState = await page.evaluate(() => {
      const image = document.querySelector(".product-detail-hero-image");
      const tint = document.querySelector(".product-detail-image-stage .shade-preview-tint");
      return {
        src: image?.getAttribute("src") || "",
        currentSrc: image?.currentSrc || "",
        tint: tint?.style.getPropertyValue("--shade-preview-color") || "",
      };
    });

    assert(tealState.src === originalImage.src, `Preset preview changed image src: ${JSON.stringify({ originalImage, tealState })}`);
    assert(tealState.currentSrc === originalImage.currentSrc, `Preset preview downloaded/switched another image: ${JSON.stringify({ originalImage, tealState })}`);
    assert(!tealState.tint, `A colour overlay obscured the new product label: ${JSON.stringify(tealState)}`);

    const custom = studio.getByLabel("Choose a custom colour enquiry reference");
    await custom.evaluate((input) => {
      // React tracks controlled-input values internally. Calling the native
      // prototype setter changes the DOM value without updating React's value
      // tracker first, so the bubbled input/change events are observed exactly
      // like a real browser colour selection.
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      if (!setter) throw new Error("Native HTMLInputElement value setter is unavailable");
      setter.call(input, "#123456");
      input.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
      input.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    });

    await page.waitForFunction(() => document.querySelector(".shade-preview-studio__heading strong")?.textContent?.includes("#123456"), null, { timeout: 5000 });

    const customState = await page.evaluate(() => {
      const image = document.querySelector(".product-detail-hero-image");
      const tint = document.querySelector(".product-detail-image-stage .shade-preview-tint");
      const heading = document.querySelector(".shade-preview-studio__heading strong")?.textContent || "";
      return {
        src: image?.getAttribute("src") || "",
        currentSrc: image?.currentSrc || "",
        tint: tint?.style.getPropertyValue("--shade-preview-color") || "",
        heading,
      };
    });

    assert(customState.src === originalImage.src, `Custom preview changed image src: ${JSON.stringify({ originalImage, customState })}`);
    assert(customState.currentSrc === originalImage.currentSrc, `Custom preview downloaded/switched another image: ${JSON.stringify({ originalImage, customState })}`);
    assert(!customState.tint, `Custom colour obscured the new product label: ${JSON.stringify(customState)}`);
    assert(customState.heading.includes("#123456"), `Custom preview label did not update: ${JSON.stringify(customState)}`);

    await studio.getByRole("button", { name: "Clear" }).click();
    await page.waitForFunction(() => !document.querySelector(".product-detail-image-stage .shade-preview-tint"), null, { timeout: 5000 });

    const resetCurrentSrc = await hero.evaluate((image) => image.currentSrc);
    assert(resetCurrentSrc === originalImage.currentSrc, "Resetting preview should keep the original image URL");
    assert(legacyColourImageRequests.length === 0, `Legacy per-colour images were requested:\n${legacyColourImageRequests.join("\n")}`);
    assert(errors.length === 0, `Browser errors detected:\n${errors.join("\n")}`);

    console.log("✓ Colour references preserve labelled packaging and do not request per-colour image files");
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
