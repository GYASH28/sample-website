const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");
const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = process.env.THEME_AUDIT_BASE_URL || "http://127.0.0.1:4173";
const OUTPUT = path.resolve(process.cwd(), "theme-audit-artifacts");
const themes = ["light", "dark"];

async function openPage(browser, theme, viewport) {
  const context = await browser.newContext({ viewport, reducedMotion: "reduce", colorScheme: theme });
  await context.addInitScript(({ selectedTheme }) => {
    localStorage.setItem("fakhri_theme", selectedTheme);
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
  }, { selectedTheme: theme });
  const page = await context.newPage();
  return { context, page };
}

async function assertTheme(page, theme) {
  await page.waitForFunction((selectedTheme) => document.documentElement.dataset.theme === selectedTheme, theme);
}

async function auditVisibleSurface(page, selector, label, theme, viewportName, failures) {
  const surface = page.locator(selector).first();
  await surface.waitFor({ state: "visible", timeout: 10_000 });

  const axe = await new AxeBuilder({ page })
    .include(selector)
    .withRules(["color-contrast"])
    .analyze();

  if (axe.violations.length) {
    failures.push({
      theme,
      viewport: viewportName,
      label,
      selector,
      violations: axe.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.map((node) => ({ target: node.target, html: node.html, summary: node.failureSummary })),
      })),
    });
  }

  const state = await surface.evaluate((element) => {
    const style = getComputedStyle(element);
    const sample = [...element.querySelectorAll("h1,h2,h3,h4,p,strong,small,a,button,label,legend,kbd,em,code,address,span")]
      .filter((node) => {
        const nodeStyle = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return rect.width > 2 && rect.height > 2 && nodeStyle.display !== "none" && nodeStyle.visibility !== "hidden" && Number(nodeStyle.opacity || 1) > 0.08;
      })
      .slice(0, 40)
      .map((node) => ({
        tag: node.tagName,
        className: String(node.className || ""),
        text: node.textContent?.trim().slice(0, 60) || "",
        color: getComputedStyle(node).color,
      }));
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      backgroundImage: style.backgroundImage,
      sample,
    };
  });

  fs.writeFileSync(
    path.join(OUTPUT, `open-${viewportName}-${theme}-${label}.json`),
    JSON.stringify(state, null, 2),
  );
  await page.screenshot({
    path: path.join(OUTPUT, `open-${viewportName}-${theme}-${label}.png`),
    fullPage: false,
    animations: "disabled",
  });
}

async function runDesktop(browser, theme, failures) {
  const { context, page } = await openPage(browser, theme, { width: 1440, height: 960 });
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 30_000 });
    await assertTheme(page, theme);

    await page.locator(".mega-toggle").click();
    await auditVisibleSurface(page, ".category-mega-menu", "mega-menu", theme, "desktop", failures);
    await page.keyboard.press("Escape");

    await page.locator(".header-search-trigger").click();
    await auditVisibleSurface(page, ".search-dialog", "search-dialog", theme, "desktop", failures);
    await page.keyboard.press("Escape");

    await page.goto(`${BASE_URL}/products`, { waitUntil: "networkidle", timeout: 30_000 });
    await assertTheme(page, theme);
    await page.locator(".product-card-quick-view").first().click();
    await auditVisibleSurface(page, ".quick-view", "quick-view", theme, "desktop", failures);
    await page.locator(".quick-view__close").click();

    await page.locator(".header-enquiry-launcher").click();
    await auditVisibleSurface(page, ".enquiry-drawer", "enquiry-drawer", theme, "desktop", failures);
  } finally {
    await context.close();
  }
}

async function runMobile(browser, theme, failures) {
  const { context, page } = await openPage(browser, theme, { width: 390, height: 844 });
  try {
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle", timeout: 30_000 });
    await assertTheme(page, theme);

    await auditVisibleSurface(page, ".mobile-bottom-nav", "bottom-nav", theme, "mobile", failures);

    await page.locator(".menu-toggle").click();
    await auditVisibleSurface(page, ".mobile-nav-drawer", "mobile-drawer", theme, "mobile", failures);
    await page.locator(".mobile-drawer-header .icon-button").click();
    await page.locator(".mobile-nav-drawer").waitFor({ state: "hidden", timeout: 5_000 });
    await assertTheme(page, theme);

    await page.evaluate(() => window.dispatchEvent(new Event("fakhri:open-search")));
    await auditVisibleSurface(page, ".search-dialog", "search-dialog", theme, "mobile", failures);
  } finally {
    await context.close();
  }
}

(async () => {
  fs.mkdirSync(OUTPUT, { recursive: true });
  const browser = await chromium.launch();
  const failures = [];
  try {
    for (const theme of themes) {
      await runDesktop(browser, theme, failures);
      await runMobile(browser, theme, failures);
    }
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(OUTPUT, "open-state-report.json"), JSON.stringify({ failures }, null, 2));
  if (failures.length) {
    console.error(`Open-state theme audit found ${failures.length} contrast failures.`);
    console.error(JSON.stringify(failures.slice(0, 8), null, 2));
    process.exit(1);
  }
  console.log("Open-state light/dark readability audit passed mega menu, search, Quick View, enquiry drawer, mobile drawer and bottom navigation.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
