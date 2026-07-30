import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const outputPath = process.argv[3];
const routes = [
  "/",
  "/products",
  "/products/makhhi-thread",
  "/gallery",
  "/about",
  "/blog",
  "/contact",
  "/enquiry",
  "/wishlist",
];
const profiles = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 960 },
];

function percentile(values, quantile) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * quantile))];
}

const browser = await chromium.launch({
  ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
    : {}),
});
const results = [];

try {
  for (const profile of profiles) {
    for (const route of routes) {
      const page = await browser.newPage({
        viewport: { width: profile.width, height: profile.height },
      });
      const errors = [];

      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      page.on("pageerror", (error) => errors.push(error.message));

      await page.addInitScript(() => {
        sessionStorage.setItem("fakhri_intro_cinematic_v1", "played");
        window.__motionAudit = { cls: 0, lcp: 0 };

        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries.at(-1);
          if (last) window.__motionAudit.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              window.__motionAudit.cls += entry.value;
            }
          }
        }).observe({ type: "layout-shift", buffered: true });
      });

      const startedAt = performance.now();
      await page.goto(`${baseUrl}${route}`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });
      await page.waitForFunction(() => {
        return (
          document.readyState === "complete" &&
          document.documentElement.dataset.motionProfile &&
          document.querySelector(".route-stage") &&
          !document.body.classList.contains("intro-running")
        );
      });
      await page.evaluate(() => document.fonts.ready);

      const visual = await page.evaluate(async () => {
        window.scrollTo({ top: 0, behavior: "instant" });
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        );

        const frameGaps = [];
        const longTasks = [];
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) longTasks.push(entry.duration);
        });
        longTaskObserver.observe({ type: "longtask", buffered: false });

        const maxScroll = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const duration = maxScroll > 0 ? 2_200 : 900;
        const start = performance.now();
        let previous = start;

        await new Promise((resolve) => {
          const tick = (now) => {
            frameGaps.push(now - previous);
            previous = now;
            const progress = Math.min(1, (now - start) / duration);
            const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
            window.scrollTo(0, maxScroll * eased);

            if (progress < 1) requestAnimationFrame(tick);
            else requestAnimationFrame(() => requestAnimationFrame(resolve));
          };
          requestAnimationFrame(tick);
        });

        longTaskObserver.disconnect();
        const navigation = performance.getEntriesByType("navigation")[0];
        const images = [...document.images];

        return {
          frameGaps,
          longTasks,
          pageHeight: document.documentElement.scrollHeight,
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
          brokenImages: images
            .filter((image) => image.complete && image.naturalWidth === 0)
            .map((image) => image.currentSrc || image.src),
          lcp: window.__motionAudit?.lcp ?? 0,
          cls: window.__motionAudit?.cls ?? 0,
          domContentLoaded: navigation?.domContentLoadedEventEnd ?? 0,
          load: navigation?.loadEventEnd ?? 0,
        };
      });

      results.push({
        profile: profile.name,
        viewport: `${profile.width}x${profile.height}`,
        route,
        wallTime: Math.round(performance.now() - startedAt),
        lcp: Math.round(visual.lcp),
        cls: Number(visual.cls.toFixed(4)),
        domContentLoaded: Math.round(visual.domContentLoaded),
        load: Math.round(visual.load),
        frameP95: Number(percentile(visual.frameGaps, 0.95).toFixed(2)),
        frameMax: Number(Math.max(...visual.frameGaps).toFixed(2)),
        framesOver33: visual.frameGaps.filter((gap) => gap > 33).length,
        framesOver50: visual.frameGaps.filter((gap) => gap > 50).length,
        longTaskMax: Number(Math.max(0, ...visual.longTasks).toFixed(2)),
        pageHeight: visual.pageHeight,
        overflow: visual.overflow,
        brokenImages: visual.brokenImages,
        consoleErrors: errors,
      });

      await page.close();
    }
  }
} finally {
  await browser.close();
}

const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  results,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (outputPath) await writeFile(outputPath, serialized, "utf8");
process.stdout.write(serialized);
