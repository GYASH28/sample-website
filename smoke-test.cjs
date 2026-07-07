// smoke-test.cjs
// Smoke test against the production preview build. Visits every route, checks for console errors.

const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];

  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text()}`);
  });

  const { products } = await import("./src/data/catalogue.js");
  const routes = [
    "/", "/products", "/about", "/contact", "/wishlist", "/enquiry",
    ...products.map((p) => `/products/${p.slug}`),
    "/nonexistent-404",
  ];

  console.log(`Smoke testing ${routes.length} routes…`);
  let ok = 0;
  let fail = 0;
  for (const route of routes) {
    try {
      await page.goto("http://127.0.0.1:4173" + route, { waitUntil: "networkidle", timeout: 15000 });
      const rootLen = await page.evaluate(() => document.getElementById("root")?.innerHTML.length || 0);
      if (rootLen < 100) {
        console.log(`  ✗ ${route} — blank page (root=${rootLen})`);
        fail++;
      } else {
        console.log(`  ✓ ${route}`);
        ok++;
      }
    } catch (e) {
      console.log(`  ✗ ${route} — ${e.message}`);
      fail++;
    }
  }

  await browser.close();

  console.log(`\n${ok}/${routes.length} routes OK, ${fail} failed.`);
  if (errors.length) {
    console.log("\nConsole errors:");
    errors.slice(0, 10).forEach((e) => console.log("  " + e));
  }
  process.exit(fail > 0 || errors.length > 0 ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
