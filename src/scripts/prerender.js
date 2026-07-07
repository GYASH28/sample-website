// src/scripts/prerender.js
// Build-time prerendering via Playwright. Boots the preview server, visits every route,
// writes fully-rendered HTML back into dist/. This makes meta tags + JSON-LD visible
// to crawlers and link-preview bots (WhatsApp/Instagram) that don't execute JS.

import { chromium } from "playwright";
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = resolve(__dirname, "../..");
const distDir = resolve(projectRoot, "dist");

if (!existsSync(distDir)) {
  console.error("✗ dist/ not found. Run `vite build` first.");
  process.exit(1);
}

const { businessInfo, products } = await import("../data/catalogue.js");

const staticRoutes = ["/", "/products", "/about", "/contact", "/wishlist", "/enquiry"];
const productRoutes = products.map((p) => `/products/${p.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes];

// Bypass on Vercel or CI environment where running headless browser during build is unsupported/unreliable
if (process.env.VERCEL || process.env.CI) {
  console.log("⚠️ Vercel or CI environment detected. Skipping Playwright prerendering to prevent build crashes.");
  process.exit(0);
}

let preview;
try {
  console.log("▶ Starting vite preview on port 4173…");
  preview = spawn("npx", ["vite", "preview", "--port", "4173", "--strictPort", "--host", "127.0.0.1"], {
    cwd: projectRoot,
    stdio: "pipe",
    shell: process.platform === "win32",
  });

  await new Promise((res, rej) => {
    const timer = setTimeout(() => rej(new Error("Preview server did not start in 30s")), 30000);
    const onStdout = (d) => {
      const s = d.toString();
      if (s.includes("Local:") || s.includes("4173") || s.includes("ready")) {
        clearTimeout(timer);
        preview.stdout.off("data", onStdout);
        preview.stderr.off("data", onStderr);
        setTimeout(res, 800);
      }
    };
    const onStderr = (d) => {
      const s = d.toString();
      if (s.includes("EADDRINUSE") || s.includes("Error")) {
        clearTimeout(timer);
        preview.stdout.off("data", onStdout);
        preview.stderr.off("data", onStderr);
        rej(new Error(`Preview server error: ${s}`));
      }
    };
    preview.stdout.on("data", onStdout);
    preview.stderr.on("data", onStderr);
  });

  let browser;
  try {
    browser = await chromium.launch();
  } catch (launchError) {
    console.warn(`⚠️ Failed to launch Playwright Chromium: ${launchError.message}`);
    console.warn("Skipping prerendering step.");
    if (preview) preview.kill();
    process.exit(0);
  }

  const page = await browser.newPage();

  let successCount = 0;
  let failCount = 0;

  for (const route of allRoutes) {
    const url = `http://127.0.0.1:4173${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500); // let hydration write JSON-LD + meta tags
      const html = await page.content();
      const finalPath =
        route === "/"
          ? resolve(distDir, "index.html")
          : resolve(distDir, route.slice(1), "index.html");
      mkdirSync(dirname(finalPath), { recursive: true });
      writeFileSync(finalPath, html, "utf-8");
      successCount++;
      console.log(`  ✓ ${route}`);
    } catch (e) {
      console.error(`  ✗ ${route}: ${e.message}`);
      failCount++;
    }
  }

  await browser.close();
  console.log(`\n✓ Prerendered: ${successCount} routes succeeded, ${failCount} failed.`);
  process.exit(failCount > 0 ? 1 : 0);

} catch (error) {
  console.error(`✗ Prerender process failed: ${error.message}`);
  process.exit(1);
} finally {
  if (preview) {
    preview.kill();
  }
}
