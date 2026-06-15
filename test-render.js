import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";

const html = fs.readFileSync("dist/index.html", "utf-8");
const jsdom = new JSDOM(html, {
  url: "http://localhost/",
  runScripts: "dangerously",
  resources: "usable"
});

jsdom.window.addEventListener("error", (event) => {
  console.error("JSDOM Error:", event.error);
});

jsdom.window.addEventListener("unhandledrejection", (event) => {
  console.error("JSDOM Unhandled Rejection:", event.reason);
});

setTimeout(() => {
  const rootContent = jsdom.window.document.getElementById("root").innerHTML;
  console.log("Root content length:", rootContent.length);
  if (rootContent.length === 0) {
    console.log("Page is BLANK.");
  } else {
    console.log("Page rendered successfully.");
  }
  process.exit(0);
}, 2000);
