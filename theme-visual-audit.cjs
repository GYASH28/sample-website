const { chromium } = require("playwright");
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

function luminance([r, g, b]) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function rgb(value) {
  const match = String(value).match(/rgba?\((\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return match.slice(1, 4).map(Number);
}

(async () => {
  fs.rmSync(OUTPUT, { recursive: true, force: true });
  fs.mkdirSync(OUTPUT, { recursive: true });

  const browser = await chromium.launch();
  const failures = [];
  const report = [];

  try {
    for (const [viewportName, viewport] of viewports) {
      for (const theme of themes) {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        await context.addInitScript(({ selectedTheme }) => {
          localStorage.setItem("fakhri_theme", selectedTheme);
          sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
          document.documentElement.dataset.theme = selectedTheme;
          document.documentElement.style.colorScheme = selectedTheme;
        }, { selectedTheme: theme });

        for (const [name, route] of routes) {
          const page = await context.newPage();
          const errors = [];
          page.on("pageerror", (error) => errors.push(error.message));
          page.on("console", (message) => {
            if (message.type() === "error") errors.push(message.text());
          });

          await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
          await page.waitForFunction(() => document.readyState === "complete" && document.querySelector("#main-content"));
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(120);

          const metrics = await page.evaluate(() => {
            const parse = (value) => {
              const m = String(value).match(/rgba?\((\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)[ ,]+(\d+(?:\.\d+)?)(?:[ ,/]+([\d.]+))?/i);
              return m ? [Number(m[1]), Number(m[2]), Number(m[3]), m[4] == null ? 1 : Number(m[4])] : null;
            };
            const visible = (element) => {
              const rect = element.getBoundingClientRect();
              const style = getComputedStyle(element);
              return rect.width > 2 && rect.height > 2 && style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity || 1) > 0.03;
            };
            const effectiveBackground = (element) => {
              let node = element;
              while (node && node instanceof HTMLElement) {
                const color = parse(getComputedStyle(node).backgroundColor);
                if (color && color[3] >= 0.82) return color.slice(0, 3);
                node = node.parentElement;
              }
              const root = parse(getComputedStyle(document.body).backgroundColor);
              return root ? root.slice(0, 3) : [255, 255, 255];
            };

            const uiSelectors = [
              "header", "nav", "main section", "article", "button", "input", "textarea", "select",
              ".product-card", ".category-card", ".contact-card", ".blog-story-card", ".wishlist-card-shell",
              ".enquiry-basket-items-panel", ".enquiry-form-panel", ".basket-item-card-row", ".tabs-navigation-strip",
              ".mobile-nav-drawer", ".search-dialog", ".quick-view-panel", ".enquiry-drawer", ".site-footer"
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
                    selector: element.className || element.tagName,
                    background: style.backgroundColor,
                    area: Math.round(rect.width * rect.height),
                  });
                }
              });
            }

            const textCandidates = [];
            document.querySelectorAll("h1,h2,h3,h4,p,span,a,button,label,small,strong,li").forEach((element) => {
              if (!(element instanceof HTMLElement) || !visible(element)) return;
              const text = element.innerText?.trim();
              if (!text || text.length > 400) return;
              if (element.children.length > 3) return;
              const style = getComputedStyle(element);
              const fg = parse(style.color);
              if (!fg) return;
              textCandidates.push({
                text: text.slice(0, 90),
                selector: element.className || element.tagName,
                color: fg.slice(0, 3),
                background: effectiveBackground(element),
                size: Number.parseFloat(style.fontSize || "16"),
                weight: Number.parseInt(style.fontWeight || "400", 10) || 400,
              });
            });

            return {
              theme: document.documentElement.dataset.theme,
              overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
              h1Count: document.querySelectorAll("h1").length,
              lightSurfaceLeaks,
              textCandidates,
            };
          });

          const lowContrast = metrics.textCandidates
            .map((item) => ({ ...item, ratio: contrast(item.color, item.background) }))
            .filter((item) => {
              const large = item.size >= 24 || (item.size >= 18.66 && item.weight >= 700);
              return item.ratio < (large ? 3 : 4.5);
            })
            .sort((a, b) => a.ratio - b.ratio)
            .slice(0, 25);

          const entry = { viewport: viewportName, theme, route, errors, ...metrics, lowContrast };
          report.push(entry);

          if (metrics.theme !== theme || metrics.overflow > 1 || metrics.h1Count !== 1 || errors.length || metrics.lightSurfaceLeaks.length || lowContrast.length) {
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

  console.log(`Theme visual audit passed ${report.length} rendered route/theme/viewport combinations.`);
})();