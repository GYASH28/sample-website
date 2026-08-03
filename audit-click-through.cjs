const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:4173";
const routes = [
  "/",
  "/products",
  "/gallery",
  "/about",
  "/contact",
  "/enquiry",
  "/wishlist",
  "/blog",
  "/privacy",
  "/terms",
  "/delivery-enquiries",
  "/products/makhhi-thread",
  "/products/single-macrame-cord",
  "/products/purse-handles",
  "/blog/how-to-choose-yarn-weight",
  "/nonexistent-route-test-404",
];

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  const brokenRoutes = [];
  const deadLinks = [];

  page.on("pageerror", (error) => errors.push(`[pageerror] ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`[console.error] ${message.text()}`);
  });

  console.log("=== Route visit audit ===");
  for (const route of routes) {
    const response = await page
      .goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 30000 })
      .catch(() => null);
    const rootLength = await page.evaluate(
      () => document.getElementById("root")?.innerHTML.length || 0,
    );
    if (!response || response.status() >= 400 || rootLength === 0) {
      brokenRoutes.push(`${route}: HTTP ${response?.status() || "none"}, root=${rootLength}`);
      console.log(`  FAIL ${route}`);
    } else {
      console.log(`  PASS ${route.padEnd(42)} HTTP ${response.status()}`);
    }
  }

  console.log("\n=== Internal link audit ===");
  const knownPaths = new Set(routes.filter((route) => !route.includes("nonexistent")));
  for (const sourceRoute of ["/", "/products", "/gallery", "/about", "/contact", "/blog"]) {
    await page.goto(`${baseUrl}${sourceRoute}`, { waitUntil: "networkidle" });
    const links = await page.locator("a[href]").evaluateAll((anchors) =>
      anchors.map((anchor) => anchor.getAttribute("href")),
    );
    for (const href of links) {
      if (!href?.startsWith("/")) continue;
      const path = href.split("?")[0].split("#")[0] || "/";
      const isDetail = path.startsWith("/products/") || path.startsWith("/blog/");
      if (!knownPaths.has(path) && !isDetail) deadLinks.push(`${sourceRoute} -> ${href}`);
    }
  }
  console.log(deadLinks.length ? `  FAIL ${deadLinks.length} dead links` : "  PASS Internal links");

  console.log("\n=== Catalogue interactions ===");
  await page.goto(`${baseUrl}/products`, { waitUntil: "networkidle" });
  const tabs = page.locator(".department-tab");
  const tabCount = await tabs.count();
  for (let index = 0; index < tabCount; index += 1) {
    await tabs.nth(index).click();
    await page.waitForTimeout(100);
    console.log(`  Tab ${index + 1}: ${await page.locator(".product-card").count()} products`);
  }
  const search = page.locator('input[type="search"]').first();
  await search.fill("yarn");
  await page.waitForTimeout(200);
  console.log(`  Search: ${await page.locator(".product-card").count()} products`);
  await search.fill("");

  console.log("\n=== Product detail interactions ===");
  await page.goto(`${baseUrl}/products/makhhi-thread`, { waitUntil: "networkidle" });
  const swatches = page.locator(".swatch-btn");
  if (await swatches.count()) await swatches.first().click();
  const quantityPresets = page.locator(".quantity-preset");
  if (await quantityPresets.count()) await quantityPresets.first().click();
  const image = page.locator(".product-image-container");
  if (await image.count()) {
    await image.click();
    const lightbox = page.locator(".lightbox-backdrop");
    await lightbox.waitFor({ state: "visible" });
    await page.keyboard.press("Escape");
  }
  console.log("  PASS Swatch, quantity and lightbox");

  console.log("\n=== Keyboard interactions ===");
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.keyboard.press("Control+K");
  const dialog = page.getByRole("dialog", { name: "Search materials" });
  await dialog.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "hidden" });
  console.log("  PASS Search opens and closes from keyboard");

  await browser.close();

  console.log("\n=== Summary ===");
  console.log(`  Broken routes: ${brokenRoutes.length}`);
  console.log(`  Dead internal links: ${deadLinks.length}`);
  console.log(`  Console errors: ${errors.length}`);
  if (brokenRoutes.length) console.log(brokenRoutes.join("\n"));
  if (deadLinks.length) console.log(deadLinks.join("\n"));
  if (errors.length) console.log(errors.join("\n"));
  process.exit(brokenRoutes.length + deadLinks.length + errors.length > 0 ? 1 : 0);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
