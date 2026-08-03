import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:4173";
const outputPath = process.argv[3];
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

const runs = [
  {
    name: "mobile-normal",
    expectedProfile: "compact",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
  },
  {
    name: "mobile-throttled-4x",
    expectedProfile: "compact",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 4,
  },
  {
    name: "desktop-normal",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 1,
  },
  {
    name: "desktop-throttled-2x",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 2,
  },
  {
    name: "lite-normal",
    expectedProfile: "lite",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
    lite: true,
  },
  {
    name: "reduced-normal",
    expectedProfile: "reduced",
    viewport: { width: 390, height: 844 },
    mobile: true,
    cpuRate: 1,
    reduced: true,
  },
  {
    name: "session-repeat",
    expectedProfile: "full",
    viewport: { width: 1440, height: 960 },
    mobile: false,
    cpuRate: 1,
    repeat: true,
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
      ({ lite, repeat }) => {
        if (lite) {
          Object.defineProperty(navigator, "deviceMemory", {
            configurable: true,
            get: () => 1,
          });
        }
        if (repeat) {
          sessionStorage.setItem("fakhri_intro_cinematic_v1", "played");
        }

        window.__cinematicProbe = {
          active: false,
          complete: false,
          seen: false,
          start: 0,
          animationStart: 0,
          end: 0,
          previousFrame: 0,
          frameGaps: [],
          frameSamples: [],
          startupFrameGaps: [],
          longTasks: [],
          cls: 0,
          lcp: 0,
          maxConcurrentAnimations: 0,
          phaseTimings: [],
          lastPhase: null,
        };

        const probe = window.__cinematicProbe;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            probe.longTasks.push({
              startTime: entry.startTime,
              duration: entry.duration,
              phase: probe.lastPhase,
            });
          }
        }).observe({ type: "longtask", buffered: true });

        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) probe.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });

        new PerformanceObserver((list) => {
          const entry = list.getEntries().at(-1);
          if (entry) probe.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });

        const frame = (now) => {
          const intro = document.querySelector(
            '[aria-label="Fakhri Mart introduction"]',
          );

          if (intro) {
            const phase = intro.dataset.phase || "unknown";
            const isReady = intro.dataset.ready === "true";
            if (!probe.seen) {
              probe.seen = true;
              probe.active = true;
              probe.start = now;
              probe.previousFrame = now;
            } else if (!isReady) {
              probe.startupFrameGaps.push(now - probe.previousFrame);
              probe.previousFrame = now;
            } else if (!probe.animationStart) {
              probe.animationStart = now;
              probe.previousFrame = now;
            } else {
              const gap = now - probe.previousFrame;
              probe.frameGaps.push(gap);
              probe.frameSamples.push({
                gap,
                phase,
                at: now - probe.start,
              });
              probe.previousFrame = now;
            }

            if (isReady && phase !== probe.lastPhase) {
              probe.lastPhase = phase;
              probe.phaseTimings.push({
                phase,
                at: Number((now - probe.animationStart).toFixed(1)),
              });
            }

            const runningAnimations = intro
              .getAnimations({ subtree: true })
              .filter((animation) => animation.playState === "running").length;
            probe.maxConcurrentAnimations = Math.max(
              probe.maxConcurrentAnimations,
              runningAnimations,
            );
          } else if (probe.active) {
            probe.active = false;
            probe.complete = true;
            probe.end = now;
          }

          if (!probe.complete) requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);
      },
      { lite: Boolean(run.lite), repeat: Boolean(run.repeat) },
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

    await page.goto(`${baseUrl}/`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });

    if (run.reduced || run.repeat) {
      await page.waitForFunction(() => {
        return (
          document.readyState === "complete" &&
          document.querySelector(".route-stage") &&
          !document.documentElement.classList.contains("intro-booting")
        );
      });
    } else {
      await page.waitForFunction(
        () => window.__cinematicProbe?.complete === true,
        null,
        { timeout: 12_000 },
      );
    }

    const after = metricMap((await cdp.send("Performance.getMetrics")).metrics);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

    const state = await page.evaluate(() => {
      const probe = window.__cinematicProbe;
      const start = probe.start;
      const animationStart = probe.animationStart;
      const end = probe.end || performance.now();
      const animationLongTasks = probe.animationStart
        ? probe.longTasks.filter((entry) => {
            return entry.startTime >= animationStart && entry.startTime <= end;
          })
        : [];
      const startupLongTasks = probe.seen
        ? probe.longTasks.filter((entry) => {
            return (
              entry.startTime >= start &&
              entry.startTime < (animationStart || end)
            );
          })
        : [];
      const images = [...document.images];

      return {
        profile: document.documentElement.dataset.motionProfile,
        introRendered: probe.seen,
        introDuration: probe.animationStart ? end - animationStart : 0,
        introWallDuration: probe.seen ? end - start : 0,
        frameGaps: probe.frameGaps,
        frameSamples: probe.frameSamples,
        startupFrameGaps: probe.startupFrameGaps,
        longTasks: animationLongTasks,
        startupLongTasks,
        maxConcurrentAnimations: probe.maxConcurrentAnimations,
        phaseTimings: probe.phaseTimings,
        lcp: probe.lcp,
        cls: probe.cls,
        locks: {
          introRunning: document.body.classList.contains("intro-running"),
          introHoldHero: document.body.classList.contains("intro-hold-hero"),
          introHandoff:
            document.documentElement.classList.contains("intro-handoff"),
          introBooting:
            document.documentElement.classList.contains("intro-booting"),
        },
        overflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
        brokenImages: images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src),
      };
    });

    results.push({
      name: run.name,
      viewport: `${run.viewport.width}x${run.viewport.height}`,
      cpuRate: run.cpuRate,
      expectedProfile: run.expectedProfile,
      actualProfile: state.profile,
      introRendered: state.introRendered,
      introDuration: Math.round(state.introDuration),
      introWallDuration: Math.round(state.introWallDuration),
      startupGapMax: Number(
        Math.max(0, ...state.startupFrameGaps).toFixed(2),
      ),
      startupLongTaskMax: Number(
        Math.max(
          0,
          ...state.startupLongTasks.map(({ duration }) => duration),
        ).toFixed(2),
      ),
      frameP95: Number(percentile(state.frameGaps, 0.95).toFixed(2)),
      frameMax: Number(Math.max(0, ...state.frameGaps).toFixed(2)),
      framesOver33: state.frameGaps.filter((gap) => gap > 33).length,
      framesOver50: state.frameGaps.filter((gap) => gap > 50).length,
      longTaskMax: Number(
        Math.max(0, ...state.longTasks.map(({ duration }) => duration)).toFixed(
          2,
        ),
      ),
      longTaskCount: state.longTasks.filter(({ duration }) => duration > 50)
        .length,
      phaseFrameBudget: Object.fromEntries(
        [...new Set(state.frameSamples.map(({ phase }) => phase))].map(
          (phase) => {
            const samples = state.frameSamples
              .filter((sample) => sample.phase === phase)
              .map(({ gap }) => gap);
            return [
              phase,
              {
                p95: Number(percentile(samples, 0.95).toFixed(2)),
                max: Number(Math.max(0, ...samples).toFixed(2)),
                over33: samples.filter((gap) => gap > 33).length,
                over50: samples.filter((gap) => gap > 50).length,
              },
            ];
          },
        ),
      ),
      longTasksByPhase: state.longTasks.map(({ duration, phase }) => ({
        duration: Number(duration.toFixed(2)),
        phase,
      })),
      maxConcurrentAnimations: state.maxConcurrentAnimations,
      phaseTimings: state.phaseTimings,
      lcp: Math.round(state.lcp),
      cls: Number(state.cls.toFixed(4)),
      styleRecalcDelta: Math.round(
        (after.RecalcStyleCount ?? 0) - (before.RecalcStyleCount ?? 0),
      ),
      layoutDelta: Math.round(
        (after.LayoutCount ?? 0) - (before.LayoutCount ?? 0),
      ),
      scriptDuration: Number(
        ((after.ScriptDuration ?? 0) - (before.ScriptDuration ?? 0)).toFixed(4),
      ),
      taskDuration: Number(
        ((after.TaskDuration ?? 0) - (before.TaskDuration ?? 0)).toFixed(4),
      ),
      locks: state.locks,
      overflow: state.overflow,
      brokenImages: state.brokenImages,
      consoleErrors: errors,
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
