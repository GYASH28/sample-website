const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = process.env.V14_BASE_URL || "http://127.0.0.1:4173";
const OUTPUT = path.resolve(process.cwd(), "v14-visual-artifacts");
const routes = [
  ["projects", "/projects"],
  ["collection", "/collections/crochet-yarn"],
  ["compare", "/compare"],
  ["guide", "/yarn-guide"],
  ["catalogue", "/products?project=crochet-bag&sort=relevance"],
  ["enquiry", "/enquiry"],
];
const viewports = [
  ["desktop", { width: 1440, height: 960 }],
  ["mobile", { width: 390, height: 844 }],
];
const themes = ["light", "dark"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function settle(page) {
  await page.evaluate(async () => {
    const max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    const step = Math.max(460, innerHeight * 0.72);
    for (let y = 0; y <= max; y += step) {
      scrollTo(0, Math.min(y, max));
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(120);
}

(async () => {
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });
  const browser = await chromium.launch();
  const report = [];
  const failures = [];

  try {
    for (const [viewportName, viewport] of viewports) {
      for (const theme of themes) {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce", colorScheme: theme });
        await context.addInitScript(({ selectedTheme }) => {
          localStorage.setItem("fakhri_theme", selectedTheme);
          sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
          sessionStorage.setItem("fakhri_commerce_intro_v2", "played");
          if (!localStorage.getItem("fakhri_compare_v1")) localStorage.setItem("fakhri_compare_v1", JSON.stringify(["makhhi-thread", "4-ply-cotton-thread"]));
        }, { selectedTheme: theme });

        for (const [name, route] of routes) {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
          await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
          await page.waitForFunction(() => document.querySelector("main#main-content"));
          await page.evaluate(() => document.fonts.ready);
          await settle(page);

          const metrics = await page.evaluate(() => {
            const visible = (element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return rect.width > 2 && rect.height > 2 && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) > 0.04;
            };
            const keySelectors = [
              ".project-card", ".collection-guidance li", ".compare-table-scroll", ".guided-question",
              ".product-card", ".shopping-workspace-launcher", ".enquiry-summary-tools", ".made-with-fakhri",
              ".product-at-glance", ".catalogue-controls-sticky",
            ];
            return {
              theme: document.documentElement.dataset.theme,
              overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
              h1: document.querySelectorAll("h1").length,
              brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
              visibleKeySurfaces: keySelectors.flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map((element) => ({ selector, text: element.innerText?.trim().slice(0, 80) || "" }))),
            };
          });
          const axe = await new AxeBuilder({ page }).withRules(["color-contrast"]).analyze();
          const entry = { viewportName, theme, route, errors, ...metrics, contrast: axe.violations.length };
          report.push(entry);
          if (errors.length || metrics.theme !== theme || metrics.overflow > 1 || metrics.h1 !== 1 || metrics.brokenImages.length || axe.violations.length) failures.push(entry);

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
    console.error(JSON.stringify(failures.slice(0, 8), null, 2));
    throw new Error(`v14 visual audit found ${failures.length} failing rendered states`);
  }

  assert(report.length === routes.length * viewports.length * themes.length, "incomplete rendered-state matrix");
  console.log(`✓ v14 visual audit passed ${report.length} rendered states`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
