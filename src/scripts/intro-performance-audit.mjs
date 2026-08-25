import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const outputPath = process.argv[3];
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
const INTRO_SELECTOR = '.commerce-intro[aria-label="Fakhri Mart opening sequence"]';

const runs = [
  {
    name: "mobile-normal",
    expectedProfile: "compact",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
    expectIntro: true,
  },
  {
    name: "mobile-throttled-4x",
    expectedProfile: "compact",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 4,
    expectIntro: true,
  },
  {
    name: "desktop-normal",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 1,
    expectIntro: true,
  },
  {
    name: "desktop-throttled-2x",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 2,
    expectIntro: true,
  },
  {
    name: "lite-normal",
    expectedProfile: "lite",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
    expectIntro: true,
  },
  {
    name: "reduced-normal",
    expectedProfile: "reduced",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
    reduced: true,
    expectIntro: false,
  },
  {
    name: "session-repeat",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 1,
    repeat: true,
    expectIntro: false,
  },
];

function percentile(values, quantile) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * quantile))];
}

function metricMap(metrics) {
  return Object.fromEntries(metrics.map(({ name, value }) => [name, value]));
}

const browser = await chromium.launch({
  ...(executablePath ? { executablePath } : {}),
});
const results = [];

try {
  for (const run of runs) {
    const context = await browser.newContext({
      viewport: run.viewport,
      isMobile: run.mobile,
      hasTouch: run.mobile,
      reducedMotion: run.reduced ? "reduce" : "no-preference",
    });

    await context.addInitScript(
      ({ expectedProfile, repeat }) => {
        const hardware = {
          lite: { deviceMemory: 1, hardwareConcurrency: 2 },
          compact: { deviceMemory: 4, hardwareConcurrency: 4 },
          full: { deviceMemory: 8, hardwareConcurrency: 8 },
          reduced: { deviceMemory: 8, hardwareConcurrency: 8 },
        }[expectedProfile];

        if (hardware) {
          for (const [property, value] of Object.entries(hardware)) {
            Object.defineProperty(navigator, property, {
              configurable: true,
              get: () => value,
            });
          }
        }

        if (repeat) {
          sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
          sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
        }

        window.__introAudit = {
          seen: false,
          active: false,
          complete: false,
          start: 0,
          end: 0,
          previousFrame: 0,
          frameGaps: [],
          longTasks: [],
          cls: 0,
          lcp: 0,
          maxConcurrentAnimations: 0,
        };

        const probe = window.__introAudit;
        if (typeof PerformanceObserver !== "undefined") {
          try {
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) probe.longTasks.push(entry.duration);
            }).observe({ type: "longtask", buffered: true });
          } catch {
            // Optional metric.
          }

          try {
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) probe.cls += entry.value;
              }
            }).observe({ type: "layout-shift", buffered: true });
          } catch {
            // Optional metric.
          }

          try {
            new PerformanceObserver((list) => {
              const entry = list.getEntries().at(-1);
              if (entry) probe.lcp = entry.startTime;
            }).observe({ type: "largest-contentful-paint", buffered: true });
          } catch {
            // Optional metric.
          }
        }

        const frame = (now) => {
          const intro = document.querySelector('.commerce-intro[aria-label="Fakhri Mart opening sequence"]');
          if (intro) {
            if (!probe.seen) {
              probe.seen = true;
              probe.active = true;
              probe.start = now;
              probe.previousFrame = now;
            } else {
              probe.frameGaps.push(now - probe.previousFrame);
              probe.previousFrame = now;
            }

            const runningAnimations = intro
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length;
            probe.maxConcurrentAnimations = Math.max(probe.maxConcurrentAnimations, runningAnimations);
          } else if (probe.active) {
            probe.active = false;
            probe.complete = true;
            probe.end = now;
          }

          requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
      },
      { expectedProfile: run.expectedProfile, repeat: Boolean(run.repeat) },
    );

    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const cdp = await context.newCDPSession(page);
    await cdp.send("Performance.enable");
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: run.cpuRate });
    const before = metricMap((await cdp.send("Performance.getMetrics")).metrics);

    const url = run.expectIntro ? `${baseUrl}/?intro=1` : `${baseUrl}/`;
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 });

    if (run.expectIntro) {
      const intro = page.locator(INTRO_SELECTOR);
      await intro.waitFor({ state: "visible", timeout: 5_000 });
      await intro.waitFor({ state: "detached", timeout: 20_000 });
    } else {
      await page.waitForFunction(() => {
        return document.readyState === "complete" && document.querySelector(".route-stage");
      });
      await page.waitForTimeout(600);
    }

    const after = metricMap((await cdp.send("Performance.getMetrics")).metrics);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

    const state = await page.evaluate(() => {
      const probe = window.__introAudit;
      const images = [...document.images];
      return {
        profile: document.documentElement.dataset.motionProfile,
        introRendered: probe.seen,
        introDuration: probe.seen ? (probe.end || performance.now()) - probe.start : 0,
        frameGaps: probe.frameGaps,
        longTasks: probe.longTasks,
        maxConcurrentAnimations: probe.maxConcurrentAnimations,
        lcp: probe.lcp,
        cls: probe.cls,
        bodyLocked: document.body.classList.contains("commerce-intro-open"),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        brokenImages: images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      };
    });

    const performanceWarnings = [];
    const frameP95 = percentile(state.frameGaps, 0.95);
    const frameMax = Math.max(0, ...state.frameGaps);
    const longTaskMax = Math.max(0, ...state.longTasks);
    if (frameP95 > 50) performanceWarnings.push(`frame p95 ${frameP95.toFixed(1)}ms`);
    if (longTaskMax > 200) performanceWarnings.push(`long task max ${longTaskMax.toFixed(1)}ms`);
    if (state.cls > 0.1) performanceWarnings.push(`CLS ${state.cls.toFixed(3)}`);

    results.push({
      name: run.name,
      viewport: `${run.viewport.width}x${run.viewport.height}`,
      cpuRate: run.cpuRate,
      expectedProfile: run.expectedProfile,
      actualProfile: state.profile,
      expectedIntro: run.expectIntro,
      introRendered: state.introRendered,
      introDuration: Math.round(state.introDuration),
      frameP95: Number(frameP95.toFixed(2)),
      frameMax: Number(frameMax.toFixed(2)),
      framesOver33: state.frameGaps.filter((gap) => gap > 33).length,
      framesOver50: state.frameGaps.filter((gap) => gap > 50).length,
      longTaskMax: Number(longTaskMax.toFixed(2)),
      longTaskCount: state.longTasks.filter((duration) => duration > 50).length,
      maxConcurrentAnimations: state.maxConcurrentAnimations,
      lcp: Math.round(state.lcp),
      cls: Number(state.cls.toFixed(4)),
      styleRecalcDelta: Math.round((after.RecalcStyleCount ?? 0) - (before.RecalcStyleCount ?? 0)),
      layoutDelta: Math.round((after.LayoutCount ?? 0) - (before.LayoutCount ?? 0)),
      scriptDuration: Number(((after.ScriptDuration ?? 0) - (before.ScriptDuration ?? 0)).toFixed(4)),
      taskDuration: Number(((after.TaskDuration ?? 0) - (before.TaskDuration ?? 0)).toFixed(4)),
      bodyLocked: state.bodyLocked,
      overflow: state.overflow,
      brokenImages: state.brokenImages,
      consoleErrors: errors,
      performanceWarnings,
    });

    await context.close();
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

const correctnessFailures = results.filter((result) => {
  return (
    result.actualProfile !== result.expectedProfile ||
    result.introRendered !== result.expectedIntro ||
    result.bodyLocked ||
    result.overflow ||
    result.brokenImages.length ||
    result.consoleErrors.length
  );
});

if (correctnessFailures.length) {
  console.error(`Intro performance audit found ${correctnessFailures.length} correctness failure(s).`);
  process.exitCode = 1;
}
