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

const { featuredProducts, blogPosts } = await import("../data/siteData.js");
const { INTRO_SESSION_KEY } = await import("../lib/introPlayback.js");

const staticRoutes = [
  "/",
  "/products",
  "/yarn-guide",
  "/gallery",
  "/about",
  "/contact",
  "/wishlist",
  "/enquiry",
  "/blog",
  "/privacy",
  "/terms",
  "/delivery-enquiries",
];
const productRoutes = featuredProducts.map((product) => `/products/${product.slug}`);
const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];

let preview;
let browser;
try {
  console.log("▶ Starting vite preview on port 4173…");
  const viteCli = resolve(projectRoot, "node_modules/vite/bin/vite.js");
  preview = spawn(
    process.execPath,
    [viteCli, "preview", "--port", "4173", "--strictPort", "--host", "127.0.0.1"],
    { cwd: projectRoot, stdio: "pipe" },
  );

  await new Promise((resolveReady, rejectReady) => {
    const timer = setTimeout(() => rejectReady(new Error("Preview server did not start in 30s")), 30000);
    const onStdout = (data) => {
      const output = data.toString();
      if (output.includes("Local:") || output.includes("4173") || output.includes("ready")) {
        clearTimeout(timer);
        preview.stdout.off("data", onStdout);
        preview.stderr.off("data", onStderr);
        setTimeout(resolveReady, 800);
      }
    };
    const onStderr = (data) => {
      const output = data.toString();
      if (output.includes("EADDRINUSE") || output.includes("Error")) {
        clearTimeout(timer);
        preview.stdout.off("data", onStdout);
        preview.stderr.off("data", onStderr);
        rejectReady(new Error(`Preview server error: ${output}`));
      }
    };
    preview.stdout.on("data", onStdout);
    preview.stderr.on("data", onStderr);
  });

  try {
    browser = await chromium.launch();
  } catch (launchError) {
    console.warn(`⚠️ Failed to launch Playwright Chromium: ${launchError.message}`);
    console.warn("Skipping prerendering step.");
    if (preview) preview.kill();
    process.exit(0);
  }

  const page = await browser.newPage();
  await page.addInitScript((sessionKey) => {
    sessionStorage.setItem(sessionKey, "played");
  }, INTRO_SESSION_KEY);

  let successCount = 0;
  let failCount = 0;

  for (const route of allRoutes) {
    const url = `http://localhost:4173${route}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500);
      await page.evaluate(() => {
        document.documentElement.classList.remove("motion-ready", "intro-booting", "intro-handoff");
        document.body.classList.remove("intro-running", "intro-hold-hero");
      });

      const html = await page.content();
      const finalPath = route === "/"
        ? resolve(distDir, "index.html")
        : resolve(distDir, route.slice(1), "index.html");

      mkdirSync(dirname(finalPath), { recursive: true });
      writeFileSync(finalPath, html, "utf-8");
      successCount += 1;
      console.log(`  ✓ ${route}`);
    } catch (error) {
      console.error(`  ✗ ${route}: ${error.message}`);
      failCount += 1;
    }
  }

  await browser.close();
  browser = undefined;
  console.log(`\n✓ Prerendered: ${successCount} routes succeeded, ${failCount} failed.`);
  process.exitCode = failCount > 0 ? 1 : 0;
} catch (error) {
  console.error(`✗ Prerender process failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close().catch(() => {});
  if (preview) {
    preview.stdout?.destroy();
    preview.stderr?.destroy();
    if (preview.exitCode === null && preview.signalCode === null) preview.kill();
  }
}
