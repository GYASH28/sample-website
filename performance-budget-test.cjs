const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const BASE_URL = process.env.PERF_BASE_URL || "http://127.0.0.1:4173";
const DIST_ASSETS = path.resolve(__dirname, "dist/assets");

const MAX_MAIN_JS_GZIP = 128 * 1024;
const MAX_MAIN_CSS_GZIP = 72 * 1024;
const MAX_SCROLL_LAYOUT_READS = 12;
const MAX_SCROLL_LONG_TASK_MS = 350;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function gzipSize(filePath) {
  return zlib.gzipSync(fs.readFileSync(filePath), { level: 9 }).length;
}

function largestMatching(extension) {
  const matches = fs.readdirSync(DIST_ASSETS)
    .filter((name) => name.startsWith("index-") && name.endsWith(extension))
    .map((name) => {
      const fullPath = path.join(DIST_ASSETS, name);
      return { name, fullPath, raw: fs.statSync(fullPath).size, gzip: gzipSize(fullPath) };
    })
    .sort((a, b) => b.raw - a.raw);
  return matches[0];
}

async function auditRoute(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.documentElement.dataset.motionProfile && document.querySelector("main#main-content"));
  await page.evaluate(() => document.fonts.ready);

  await page.evaluate(() => {
    const original = Element.prototype.getBoundingClientRect;
    window.__perfLayoutReads = 0;
    Element.prototype.getBoundingClientRect = function instrumentedRect(...args) {
      window.__perfLayoutReads += 1;
      return original.apply(this, args);
    };

    window.__perfLongTasks = [];
    if (typeof PerformanceObserver !== "undefined") {
      try {
        window.__perfLongTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            window.__perfLongTasks.push(entry.duration);
          }
        });
        window.__perfLongTaskObserver.observe({ type: "longtask", buffered: false });
      } catch {
        // Long Task API is optional; layout-read budget still runs.
      }
    }
  });

  await page.evaluate(async () => {
    window.__perfLayoutReads = 0;
    window.__perfLongTasks = [];
    const max = Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, 3600));
    const positions = [];
    for (let step = 0; step <= 48; step += 1) positions.push(Math.round(max * (step / 48)));
    for (let step = 47; step >= 0; step -= 1) positions.push(Math.round(max * (step / 48)));

    for (const top of positions) {
      window.scrollTo(0, top);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  });

  return page.evaluate(() => {
    window.__perfLongTaskObserver?.disconnect?.();
    const longTasks = window.__perfLongTasks || [];
    return {
      layoutReads: window.__perfLayoutReads || 0,
      longTaskTotal: longTasks.reduce((total, duration) => total + duration, 0),
      longTaskMax: longTasks.length ? Math.max(...longTasks) : 0,
      longTaskCount: longTasks.length,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    };
  });
}

(async () => {
  assert(fs.existsSync(DIST_ASSETS), "dist/assets not found; build the app first");

  const mainJs = largestMatching(".js");
  const mainCss = largestMatching(".css");
  assert(mainJs, "main index JS chunk not found");
  assert(mainCss, "main index CSS chunk not found");
  assert(mainJs.gzip <= MAX_MAIN_JS_GZIP, `main JS gzip budget exceeded: ${(mainJs.gzip / 1024).toFixed(1)} KB > ${(MAX_MAIN_JS_GZIP / 1024).toFixed(0)} KB (${mainJs.name})`);
  assert(mainCss.gzip <= MAX_MAIN_CSS_GZIP, `main CSS gzip budget exceeded: ${(mainCss.gzip / 1024).toFixed(1)} KB > ${(MAX_MAIN_CSS_GZIP / 1024).toFixed(0)} KB (${mainCss.name})`);

  console.log(`✓ main JS: ${(mainJs.gzip / 1024).toFixed(1)} KB gzip (${mainJs.name})`);
  console.log(`✓ main CSS: ${(mainCss.gzip / 1024).toFixed(1)} KB gzip (${mainCss.name})`);

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
      sessionStorage.setItem("fakhri_commerce_intro_v2", "played");
      localStorage.setItem("fakhri_theme", "light");
    });

    for (const route of ["/", "/products"]) {
      const page = await context.newPage();
      const result = await auditRoute(page, route);
      assert(result.layoutReads <= MAX_SCROLL_LAYOUT_READS, `${route}: scroll path caused ${result.layoutReads} layout reads (budget ${MAX_SCROLL_LAYOUT_READS})`);
      assert(result.longTaskTotal <= MAX_SCROLL_LONG_TASK_MS, `${route}: scroll long-task total ${result.longTaskTotal.toFixed(1)}ms exceeds ${MAX_SCROLL_LONG_TASK_MS}ms`);
      assert(result.overflow <= 1, `${route}: horizontal overflow ${result.overflow}px`);
      console.log(`✓ ${route} scroll: ${result.layoutReads} layout reads, ${result.longTaskCount} long tasks, ${result.longTaskTotal.toFixed(1)}ms total`);
      await page.close();
    }

    await context.close();
  } finally {
    await browser.close();
  }

  console.log("\nBundle and scroll performance budgets passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
