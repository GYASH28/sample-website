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
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
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

    // Deep filter state is represented in the URL and UI using attributes the
    // supplier data can actually support. Colour filtering is intentionally not
    // asserted because exact live shades are confirmed from current shade cards.
    await goto(page, "/products?department=Macrame%20%26%20Cords&type=macrame-cord");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Macrame & Cords" }).count() === 1, "department filter chip missing");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Macramé cords" }).count() === 1, "product type filter chip missing");
    assert(await page.locator(".product-card").count() > 0, "verified macrame department returned no products");

    // Brand is a first-class catalogue dimension, separate from material family.
    await goto(page, "/products?brand=Ganga&sort=brand-asc");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Brand · Ganga" }).count() === 1, "brand filter chip missing");
    assert(await page.locator("#catalogue-brand").inputValue() === "Ganga", "brand filter control did not restore from URL");
    assert(await page.locator(".product-card").count() > 0, "Ganga brand filter returned no products");
    assert(new URL(page.url()).searchParams.get("brand") === "Ganga", "brand catalogue state did not persist in the URL");

    // Filter state must behave like normal browser navigation, not a one-way
    // client state machine. Back/forward and copied URLs should restore exactly.
    await goto(page, "/products");
    await page.locator("#catalogue-brand").selectOption("Ganga");
    await page.waitForFunction(() => new URL(location.href).searchParams.get("brand") === "Ganga");
    await page.locator("#catalogue-mode").selectOption("Bulk");
    await page.waitForFunction(() => new URL(location.href).searchParams.get("mode") === "Bulk");
    await page.goBack({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector("#catalogue-brand")?.value === "Ganga" && document.querySelector("#catalogue-mode")?.value === "All");
    await page.goForward({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector("#catalogue-brand")?.value === "Ganga" && document.querySelector("#catalogue-mode")?.value === "Bulk");
    await page.getByRole("button", { name: /Reset all/i }).click();
    await page.waitForFunction(() => !new URL(location.href).searchParams.has("brand") && !new URL(location.href).searchParams.has("mode"));

    // A genuinely incompatible supported filter combination must become a
    // helpful reset state, not a dead end. Ganga is a yarn brand in the current
    // verified catalogue, so combining it with the Threads department is empty.
    await goto(page, "/products?brand=Ganga&department=Threads");
    assert(await page.locator(".product-card").count() === 0, "incompatible brand/department filters unexpectedly returned products");
    assert(await page.locator(".empty-results-box").count() === 1, "zero-results state is missing");
    await page.getByRole("button", { name: /Clear search and filters/i }).click();
    await page.waitForFunction(() => document.querySelectorAll(".product-card").length > 0);

    // A stale unsupported colour URL must not create a fake active filter.
    await goto(page, "/products?color=Pink");
    assert(await page.locator(".active-filter-chip").filter({ hasText: "Colour" }).count() === 0, "unsupported colour filter should be discarded until product-specific shade data exists");

    // The colour simulator must reuse one product image. Picking a preview shade
    // changes only the browser overlay: no color-*.webp request and no src swap.
    const legacyColourRequests = [];
    page.on("request", (request) => {
      if (/\/color-[^/]+\.webp(?:\?|$)/i.test(request.url())) legacyColourRequests.push(request.url());
    });
    await goto(page, "/products/desire");
    const heroImage = page.locator(".product-detail-hero-image");
    const originalHeroSrc = await heroImage.getAttribute("src");
    const previewButton = page.getByRole("button", { name: "Preview Teal" }).first();
    assert(await previewButton.count() === 1, "digital shade preview controls missing from product detail");
    await previewButton.click();
    await page.waitForTimeout(80);
    assert(await page.locator(".product-detail-image-stage .shade-preview-tint").count() === 1, "shade overlay was not rendered");
    assert(await heroImage.getAttribute("src") === originalHeroSrc, "digital shade preview swapped the product image URL instead of tinting the same image");
    const previewColor = await page.locator(".product-detail-image-stage .shade-preview-tint").evaluate((node) => node.style.getPropertyValue("--shade-preview-color").trim().toUpperCase());
    assert(previewColor === "#328F89", `unexpected Teal preview value: ${previewColor}`);

    const customPicker = page.locator('.shade-preview-studio__custom input[type="color"]').first();
    await customPicker.fill("#123456");
    await page.waitForTimeout(50);
    const customPreview = await page.locator(".product-detail-image-stage .shade-preview-tint").evaluate((node) => node.style.getPropertyValue("--shade-preview-color").trim().toUpperCase());
    assert(customPreview === "#123456", `custom digital shade did not reach product image: ${customPreview}`);
    assert(await heroImage.getAttribute("src") === originalHeroSrc, "custom preview generated or swapped to a second colour image");
    assert(legacyColourRequests.length === 0, `digital preview requested legacy colour image files: ${legacyColourRequests.join(", ")}`);
    assert((await page.locator(".shade-preview-studio__notice").innerText()).includes("does not mean this exact shade is in stock"), "digital preview stock disclaimer is missing");

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

    // Product cards must not invent swatches. When verified preview swatches are
    // present, the selected shade must remain visible and flow into the enquiry.
    await goto(page, "/products");
    await page.evaluate(() => localStorage.removeItem("fakhri_enquiry_basket"));
    const firstCard = page.locator(".product-card").first();
    const firstSwatch = firstCard.locator(".swatch-dot-button").first();
    if (await firstSwatch.count()) {
      const label = await firstSwatch.getAttribute("aria-label");
      const match = label?.match(/representative (.+) shade/i);
      await firstSwatch.click();
      if (match?.[1]) {
        const selectedLabel = await firstCard.locator(".swatches-count-label").innerText();
        assert(selectedLabel.toLocaleLowerCase().includes(match[1].toLocaleLowerCase()), "selected shade is not visible on the product card");
        await firstCard.getByRole("button", { name: /Add to enquiry/i }).click();
        const selectedItem = await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]")[0]);
        assert(selectedItem?.shade?.name === match[1], "selected shade did not persist into the enquiry basket");
      }
    }

    // Add a material and ensure the upgraded enquiry brief is available.
    if ((await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]").length)) === 0) {
      await firstCard.getByRole("button", { name: /Add to enquiry/i }).click();
    }
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
    console.log("✓ desktop discovery, comparison, guide, shade preview, enquiry and SEO paths");
    await page.close();

    // Mobile customer paths must remain horizontally stable.
    const mobile = await context.newPage();
    await mobile.setViewportSize({ width: 390, height: 844 });
    const mobileErrors = await prepare(mobile);
    for (const route of ["/products", "/projects", "/compare", "/yarn-guide", "/enquiry", "/products/desire"]) {
      await goto(mobile, route);
      const overflow = await mobile.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
      assert(overflow <= 1, `${route}: mobile horizontal overflow ${overflow}px`);
    }
    assert(mobileErrors.length === 0, `mobile browser errors: ${mobileErrors.join(" | ")}`);
    console.log("✓ mobile discovery routes and product shade preview have no horizontal overflow");
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
