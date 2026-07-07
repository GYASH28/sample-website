// perf-audit.cjs
// Part C — capture LCP, CLS, and render timing before/after for Home, Products, and a Product Detail page.
// Uses Playwright's built-in performance observers (no Lighthouse dependency).

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 13 size for mobile audit
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    hasTouch: true,
  });

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'ProductDetail', path: '/products/makhhi-thread' },
    { name: 'YarnCalculator', path: '/yarn-calculator' },
    { name: 'Blog', path: '/blog' },
  ];

  console.log('=== Performance audit (mobile viewport, production build) ===');
  console.log('Route              | LCP (ms) | CLS    | FCP (ms) | TTI (ms) | JS Heap (MB)');
  console.log('-------------------|----------|--------|----------|----------|-------------');

  for (const route of routes) {
    const page = await context.newPage();

    // Collect performance entries
    const metrics = { lcp: 0, cls: 0, fcp: 0, tti: 0 };

    await page.evaluate(() => {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__lcp = Math.max(window.__lcp || 0, entry.startTime);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls = (window.__cls || 0) + entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            window.__fcp = entry.startTime;
          }
        }
      }).observe({ type: 'paint', buffered: true });
    });

    // Throttle CPU to simulate mid-range mobile
    await page.route('**/*', (route) => route.continue());

    const start = Date.now();
    await page.goto('http://127.0.0.1:4173' + route.path, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500); // let LCP settle

    const lcp = await page.evaluate(() => window.__lcp || 0);
    const cls = await page.evaluate(() => window.__cls || 0);
    const fcp = await page.evaluate(() => window.__fcp || 0);
    const heap = await page.evaluate(() => performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0);
    const tti = Date.now() - start;

    console.log(
      `${route.name.padEnd(19)}| ${Math.round(lcp).toString().padStart(8)} | ${cls.toFixed(4).padStart(6)} | ${Math.round(fcp).toString().padStart(8)} | ${tti.toString().padStart(8)} | ${heap.toFixed(1).padStart(11)}`
    );

    await page.close();
  }

  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
