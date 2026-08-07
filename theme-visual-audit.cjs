const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = process.env.THEME_AUDIT_BASE_URL || "http://127.0.0.1:4173";
const OUTPUT = path.resolve(process.cwd(), "theme-audit-artifacts");
const routes = [
  ["home", "/"],
  ["catalogue", "/products"],
  ["product", "/products/makhhi-thread"],
  ["about", "/about"],
  ["contact", "/contact"],
  ["guides", "/blog"],
  ["yarn-guide", "/yarn-guide"],
  ["enquiry", "/enquiry"],
  ["wishlist", "/wishlist"],
  ["delivery", "/delivery-enquiries"],
];
const viewports = [
  ["desktop", { width: 1440, height: 960 }],
  ["mobile", { width: 390, height: 844 }],
];
const themes = ["light", "dark"];

async function settleEntirePage(page) {
  await page.evaluate(async () => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const steps = Math.max(1, Math.ceil(max / Math.max(window.innerHeight * 0.8, 500)));
    for (let index = 0; index <= steps; index += 1) {
      window.scrollTo(0, Math.round(max * (index / steps)));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

async function inspectRenderedState(page) {
  return page.evaluate(() => {
    const parse = (value) => {
      const match = String(value).match(/rgba?\((\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)(?:[ ,/]+([\d.]+))?/i);
      return match
        ? [Number(match[1]), Number(match[2]), Number(match[3]), match[4] == null ? 1 : Number(match[4])]
        : null;
    };
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return rect.width > 2 && rect.height > 2 && style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0.03;
    };

    const uiSelectors = [
      "header", "nav", "main section", "article", "button", "input", "textarea", "select",
      ".product-card", ".category-card", ".contact-card", ".blog-story-card", ".wishlist-card-shell",
      ".enquiry-basket-items-panel", ".enquiry-form-panel", ".basket-item-card-row", ".tabs-navigation-strip",
      ".mobile-nav-drawer", ".search-dialog", ".quick-view-panel", ".enquiry-drawer", ".site-footer",
      ".catalogue-cta", ".commerce-category-nav", ".commerce-wholesale", ".enquiry-launcher"
    ];

    const lightSurfaceLeaks = [];
    if (document.documentElement.dataset.theme === "dark") {
      const seen = new Set();
      document.querySelectorAll(uiSelectors.join(",")).forEach((element) => {
        if (!(element instanceof HTMLElement) || !visible(element) || seen.has(element)) return;
        seen.add(element);
        if (element.closest("picture, figure, .product-card-media, .product-gallery, .catalogue-hero-photo")) return;

        const style = getComputedStyle(element);
        const bg = parse(style.backgroundColor);
        if (!bg || bg[3] < 0.82) return;

        const average = (bg[0] + bg[1] + bg[2]) / 3;
        const rect = element.getBoundingClientRect();
        if (average > 225 && rect.width * rect.height > 900) {
          lightSurfaceLeaks.push({
            selector: String(element.className || element.tagName).trim(),
            background: style.backgroundColor,
            area: Math.round(rect.width * rect.height),
            html: element.outerHTML.slice(0, 260),
          });
        }
      });
    }

    const unresolvedReveals = [...document.querySelectorAll(".reveal")]
      .filter((element) => visible(element) && !element.classList.contains("is-visible"))
      .map((element) => String(element.className).slice(0, 160));

    return {
      theme: document.documentElement.dataset.theme,
      overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      h1Count: document.querySelectorAll("h1").length,
      lightSurfaceLeaks,
      unresolvedReveals,
      brokenImages: [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src),
    };
  });
}

async function verifyThemeControls(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, colorScheme: "light", reducedMotion: "reduce" });
  await context.addInitScript(() => {
    localStorage.removeItem("fakhri_theme");
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/about`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.querySelectorAll(".theme-toggle").length >= 2);

  const before = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    states: [...document.querySelectorAll(".theme-toggle")].map((button) => button.getAttribute("aria-pressed")),
  }));
  if (before.theme !== "light") throw new Error(`Expected system-light fallback, got ${before.theme}`);

  await page.locator(".theme-toggle").first().click();
  await page.waitForFunction(() => document.documentElement.dataset.theme === "dark");
  const synchronized = await page.evaluate(() => ({
    stored: localStorage.getItem("fakhri_theme"),
    states: [...document.querySelectorAll(".theme-toggle")].map((button) => button.getAttribute("aria-pressed")),
  }));
  if (synchronized.stored !== "dark" || synchronized.states.some((state) => state !== "true")) {
    throw new Error(`Theme controls did not synchronize: ${JSON.stringify(synchronized)}`);
  }

  await page.reload({ waitUntil: "networkidle" });
  const persisted = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    states: [...document.querySelectorAll(".theme-toggle")].map((button) => button.getAttribute("aria-pressed")),
  }));
  if (persisted.theme !== "dark" || persisted.states.some((state) => state !== "true")) {
    throw new Error(`Dark preference did not persist: ${JSON.stringify(persisted)}`);
  }

  await context.close();
}

(async () => {
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch();
  const failures = [];
  const report = [];

  try {
    await verifyThemeControls(browser);

    for (const [viewportName, viewport] of viewports) {
      for (const theme of themes) {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce", colorScheme: theme });
        await context.addInitScript(({ selectedTheme }) => {
          localStorage.setItem("fakhri_theme", selectedTheme);
          sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
        }, { selectedTheme: theme });

        for (const [name, route] of routes) {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.stack || error.message));
          page.on("console", (message) => {
            if (message.type() === "error") errors.push(message.text());
          });

          await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
          await page.waitForFunction(() => document.readyState === "complete" && document.querySelector("#main-content"));
          await page.evaluate(() => document.fonts.ready);
          await settleEntirePage(page);

          const metrics = await inspectRenderedState(page);
          const axe = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
          const contrastViolations = axe.violations.map((violation) => ({
            id: violation.id,
            nodes: violation.nodes.map((node) => ({
              target: node.target,
              html: node.html,
              summary: node.failureSummary,
            })),
          }));

          const entry = { viewport: viewportName, theme, route, errors, ...metrics, contrastViolations };
          report.push(entry);

          if (
            metrics.theme !== theme ||
            metrics.overflow > 1 ||
            metrics.h1Count !== 1 ||
            errors.length ||
            metrics.lightSurfaceLeaks.length ||
            metrics.unresolvedReveals.length ||
            metrics.brokenImages.length ||
            contrastViolations.length
          ) {
            failures.push(entry);
          }

          await page.screenshot({
            path: path.join(OUTPUT, `${viewportName}-${theme}-${name}.png`),
            fullPage: true,
            animations: "disabled",
          });
          await page.close();
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUTPUT, "report.json"), JSON.stringify(report, null, 2));
  if (failures.length) {
    fs.writeFileSync(path.join(OUTPUT, "failures.json"), JSON.stringify(failures, null, 2));
    console.error(`Theme visual audit found ${failures.length} failing route/theme/viewport combinations.`);
    console.error(JSON.stringify(failures.slice(0, 6), null, 2));
    process.exit(1);
  }

  console.log(`Theme visual audit passed ${report.length} rendered route/theme/viewport combinations plus persistence/synchronization checks.`);
})();
