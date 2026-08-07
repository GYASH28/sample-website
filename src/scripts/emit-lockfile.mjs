import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

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
