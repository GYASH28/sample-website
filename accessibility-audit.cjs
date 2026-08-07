const { chromium } = require("playwright");
const { AxeBuilder } = require("@axe-core/playwright");

const baseUrl = "http://127.0.0.1:4173";
const allRoutes = [
  "/",
  "/products",
  "/products/makhhi-thread",
  "/enquiry",
  "/wishlist",
  "/about",
  "/contact",
  "/blog",
  "/blog/how-to-choose-yarn-weight",
  "/privacy",
  "/terms",
  "/delivery-enquiries",
  "/not-a-real-page",
];
const routes = process.env.A11Y_ROUTE ? [process.env.A11Y_ROUTE] : allRoutes;

(async () => {
  const browser = await chromium.launch();
  const failures = [];

  const allViewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
  ];
  const viewports = process.env.A11Y_VIEWPORT
    ? allViewports.filter((viewport) => viewport.name === process.env.A11Y_VIEWPORT)
    : allViewports;

  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("pageerror", (error) => consoleErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });

      await page.goto(`${baseUrl}${route}`, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      await page.waitForFunction(() => {
        return (
          document.querySelectorAll("main").length === 1 &&
          document.querySelectorAll("h1").length === 1 &&
          !document.documentElement.classList.contains("intro-booting")
        );
      }, { timeout: 10000 });
      await page.evaluate(() => document.fonts.ready);

      const structure = await page.evaluate(() => ({
        mains: document.querySelectorAll("main").length,
        h1s: document.querySelectorAll("h1").length,
        overflow: Math.max(
          0,
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
        unnamedButtons: Array.from(document.querySelectorAll("button")).filter(
          (button) => !button.getAttribute("aria-label") && !button.textContent.trim(),
        ).length,
        missingAlt: Array.from(document.images).filter(
          (image) => !image.hasAttribute("alt"),
        ).length,
      }));

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const violations = axe.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        nodes: violation.nodes.length,
        help: violation.help,
        examples: violation.nodes.slice(0, 10).map((node) => ({
          target: node.target,
          html: node.html,
          summary: node.failureSummary,
        })),
      }));

      if (
        structure.mains !== 1 ||
        structure.h1s !== 1 ||
        structure.overflow > 1 ||
        structure.unnamedButtons > 0 ||
        structure.missingAlt > 0 ||
        consoleErrors.length > 0 ||
        violations.length > 0
      ) {
        failures.push({
          viewport: viewport.name,
          route,
          structure,
          consoleErrors,
          violations,
        });
      }

      console.log(
        `${viewport.name.padEnd(7)} ${route.padEnd(38)} ` +
        `axe=${violations.length} h1=${structure.h1s} overflow=${structure.overflow}px`,
      );
      await page.close();
    }

    await context.close();
  }

  await browser.close();

  if (failures.length > 0) {
    console.error("\nAccessibility audit failures:");
    console.error(JSON.stringify(failures, null, 2));
    process.exit(1);
  }

  console.log("\nAccessibility audit passed on all routes and viewports.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
