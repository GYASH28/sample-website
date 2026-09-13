const { chromium } = require("playwright");

const BASE_URL = process.env.V14_BASE_URL || "http://127.0.0.1:4173";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function prepare(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

async function goto(page, path) {
  await page.goto(`${BASE_URL}${path}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector("main#main-content"));
  await page.waitForTimeout(180);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v2", "played");
    localStorage.setItem("fakhri_theme", "light");
  });

  try {
    const page = await context.newPage();
    const errors = await prepare(page);

    // Intent-aware search and typo tolerance.
    await goto(page, "/products?q=yarn%20for%20baby%20blanket&sort=relevance");
    assert(await page.locator(".product-card").count() > 0, "intent search returned no product cards");
    assert((await page.locator("body").innerText()).includes("yarn for baby blanket"), "intent query is not represented in the catalogue state");

    await goto(page, "/products?q=macrme&sort=relevance");
    assert(await page.locator(".product-card").count() > 0, "one-edit typo search should find macrame-related products");

    // Deep filter state is represented in the URL and UI.
    await goto(page, "/products?material=Cotton&color=Pink&sort=most-shades");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Material · Cotton" }).count() === 1, "material filter chip missing");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Colour · Pink" }).count() === 1, "colour filter chip missing");

    // Shop by Project is a complete route and links back into catalogue intent state.
    await goto(page, "/projects");
    assert(await page.locator(".project-card").count() >= 8, "project discovery page should expose all configured projects");
    assert(await page.locator('a[href*="/products?project="]').count() >= 8, "project cards should link to filtered catalogue routes");
    assert((await page.locator(".made-with-fakhri").innerText()).includes("verified customer submissions"), "customer creation framework must remain verification-first");

    // Guided finder generates a real catalogue shortlist.
    await goto(page, "/yarn-guide");
    await page.getByRole("button", { name: /Baby blanket/i }).click();
    await page.getByRole("button", { name: /Soft \/ comfortable/i }).click();
    await page.getByRole("button", { name: /I’m learning/i }).click();
    await page.getByRole("button", { name: /Find matching materials/i }).click();
    await page.waitForTimeout(180);
    assert(await page.locator("#guide-results .product-card").count() > 0, "guided finder did not render catalogue recommendations");

    // Comparison persists locally and never requires an account.
    await goto(page, "/products");
    const compareButtons = page.locator('button[aria-label*="comparison"]');
    assert(await compareButtons.count() >= 2, "compare buttons missing from product cards");
    await compareButtons.nth(0).click();
    await compareButtons.nth(1).click();
    const compareState = await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_compare_v1") || "[]"));
    assert(compareState.length === 2, `expected 2 compared products, found ${compareState.length}`);
    await goto(page, "/compare");
    assert(await page.locator(".compare-product-head").count() === 2, "compare page did not restore two selected products");
    assert((await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"), "compare utility route must be noindex");

    // Global shortlist workspace exposes recent/saved/compare in one place.
    await page.locator(".shopping-workspace-launcher").click();
    await page.waitForTimeout(80);
    assert(await page.locator(".shopping-workspace.is-open").count() === 1, "shortlist workspace did not open");
    await page.getByRole("tab", { name: /Compare/ }).click();
    assert(await page.locator(".workspace-product-row").count() === 2, "workspace compare tab did not reflect comparison state");
    await page.locator(".shopping-workspace__head .icon-button").click();

    // Exact shade context flows into photo-request CTA.
    await goto(page, "/products");
    const firstCard = page.locator(".product-card").first();
    const firstSwatch = firstCard.locator(".swatch-dot-button").first();
    if (await firstSwatch.count()) {
      const label = await firstSwatch.getAttribute("aria-label");
      const match = label?.match(/representative (.+) shade/i);
      await firstSwatch.click();
      if (match?.[1]) {
        const secondaryText = await firstCard.locator(".product-card-secondary-actions").innerText();
        assert(secondaryText.toLocaleLowerCase().includes(match[1].toLocaleLowerCase()), "selected shade was not preserved in current-photo CTA");
      }
    }

    // Add a material and ensure the upgraded enquiry brief is available.
    await firstCard.getByRole("button", { name: /Add to enquiry/i }).click();
    await goto(page, "/enquiry");
    assert(await page.locator(".enquiry-summary-tools").count() === 1, "enquiry summary builder missing for basket enquiries");
    const toolText = await page.locator(".enquiry-summary-tools").innerText();
    assert(toolText.includes("Copy brief") && toolText.includes("Share") && toolText.includes("Print / save PDF"), "enquiry summary share/copy/print tools incomplete");

    // SEO collection pages are indexable, canonical, and stay offer-free.
    await goto(page, "/collections/crochet-yarn");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    assert(canonical === "https://fakhriyarns.vercel.app/collections/crochet-yarn", `wrong collection canonical: ${canonical}`);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    assert(!robots.includes("noindex"), "collection landing page should be indexable");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    assert(!scripts.join(" ").includes('"@type":"Offer"'), "collection/product discovery reintroduced fake Offer schema");

    // Analytics script should not 404 or load in localhost CI.
    assert(await page.locator('script[src="/_vercel/insights/script.js"]').count() === 0, "Vercel analytics script should not load on localhost previews");

    assert(errors.length === 0, `browser errors: ${errors.join(" | ")}`);
    console.log("✓ desktop discovery, comparison, guide, enquiry and SEO paths");
    await page.close();

    // Mobile customer paths must remain horizontally stable.
    const mobile = await context.newPage();
    await mobile.setViewportSize({ width: 390, height: 844 });
    const mobileErrors = await prepare(mobile);
    for (const route of ["/products", "/projects", "/compare", "/yarn-guide", "/enquiry"]) {
      await goto(mobile, route);
      const overflow = await mobile.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      assert(overflow <= 1, `${route}: mobile horizontal overflow ${overflow}px`);
    }
    assert(mobileErrors.length === 0, `mobile browser errors: ${mobileErrors.join(" | ")}`);
    console.log("✓ mobile discovery routes have no horizontal overflow");
    await mobile.close();
  } finally {
    await context.close();
    await browser.close();
  }

  console.log("\nFakhri Mart v14 discovery and conversion regression passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
