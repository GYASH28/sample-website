import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

if (process.env.VERCEL !== "1") {
  console.log("Skipping Playwright browser install outside Vercel.");
  process.exit(0);
}

const cli = resolve(process.cwd(), "node_modules/playwright/cli.js");
if (!existsSync(cli)) {
  console.error("Playwright CLI was not found after dependency installation.");
  process.exit(1);
}

console.log("Installing Playwright Chromium and required Linux dependencies…");
const result = spawnSync(
  process.execPath,
  [cli, "install", "--with-deps", "chromium"],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    env: process.env,
  },
);

if (result.error) {
  console.error(`Unable to install Chromium dependencies: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
