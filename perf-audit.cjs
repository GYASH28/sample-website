const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:4173";
const routes = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Product detail", path: "/products/makhhi-thread" },
  { name: "Enquiry", path: "/enquiry" },
  { name: "Blog", path: "/blog" },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) " +
      "AppleWebKit/605.1.15 Version/15.0 Mobile/15E148 Safari/604.1",
    hasTouch: true,
  });

  console.log("=== Performance audit: mobile production build ===");
  console.log("Route             | LCP (ms) | CLS    | FCP (ms) | settled (ms)");
  console.log("------------------|----------|--------|----------|-------------");

  for (const route of routes) {
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__lcp = 0;
      window.__cls = 0;
      window.__fcp = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__lcp = Math.max(window.__lcp, entry.startTime);
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") window.__fcp = entry.startTime;
        }
      }).observe({ type: "paint", buffered: true });
    });

    const startedAt = Date.now();
    await page.goto(`${baseUrl}${route.path}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForTimeout(2500);
    const metrics = await page.evaluate(() => ({
      lcp: window.__lcp,
      cls: window.__cls,
      fcp: window.__fcp,
    }));
    const settled = Date.now() - startedAt;

    console.log(
      `${route.name.padEnd(18)}| ${Math.round(metrics.lcp).toString().padStart(8)} | ` +
      `${metrics.cls.toFixed(4).padStart(6)} | ${Math.round(metrics.fcp).toString().padStart(8)} | ` +
      `${settled.toString().padStart(11)}`,
    );
    await page.close();
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
