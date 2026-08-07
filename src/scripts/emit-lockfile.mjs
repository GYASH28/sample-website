import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const lock = readFileSync("package-lock.json");
const encoded = lock.toString("base64");

mkdirSync("public", { recursive: true });
writeFileSync("public/resolved-lock.b64", encoded, "utf8");

const parsed = JSON.parse(lock.toString("utf8"));
const router = parsed.packages?.["node_modules/react-router"];
const routerDom = parsed.packages?.["node_modules/react-router-dom"];
console.log("Resolved router packages:", JSON.stringify({
  reactRouter: router?.version,
  reactRouterDom: routerDom?.version,
}));

const matches = [];
function walk(directory) {
  for (const name of readdirSync(directory)) {
    const path = join(directory, name);
    const stats = statSync(path);
    if (stats.isDirectory()) walk(path);
    else if (/\.(js|jsx|mjs|cjs)$/.test(name)) {
      const source = readFileSync(path, "utf8");
      if (source.includes("react-router-dom")) matches.push(path);
    }
  }
}
walk("src");
console.log("ROUTER_DOM_IMPORT_FILES:", JSON.stringify(matches));
