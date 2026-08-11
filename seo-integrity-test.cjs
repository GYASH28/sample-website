const { chromium } = require("playwright");

const BASE_URL = process.env.SEO_BASE_URL || "http://127.0.0.1:4173";
const SITE_URL = "https://fakhriyarns.vercel.app";
const TAGLINE = "Colorful Threads, Endless Creation";
const EMAIL = "fakhrimart2025@gmail.com";
const PRIMARY_PHONE = "+91 88307 37551";
const SECONDARY_PHONE = "+91 96735 21786";

const routes = [
  { path: "/", canonical: "/", indexable: true },
  { path: "/products", canonical: "/products", indexable: true },
  { path: "/products/makhhi-thread", canonical: "/products/makhhi-thread", indexable: true },
  { path: "/contact", canonical: "/contact", indexable: true },
  { path: "/wishlist", canonical: "/wishlist", indexable: false },
  { path: "/enquiry", canonical: "/enquiry", indexable: false },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v2", "played");
    localStorage.setItem("fakhri_theme", "light");
  });

  try {
    for (const route of routes) {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });

      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: "networkidle", timeout: 30_000 });
      await page.waitForFunction(() => document.title && document.querySelector("main#main-content"));

      const state = await page.evaluate(() => {
        const canonical = document.querySelector('link[rel="canonical"]')?.href || "";
        const robots = document.querySelector('meta[name="robots"]')?.content || "";
        const description = document.querySelector('meta[name="description"]')?.content || "";
        const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
          .map((script) => {
            try { return JSON.parse(script.textContent); } catch { return null; }
          })
          .filter(Boolean);
        return {
          title: document.title,
          canonical,
          robots,
          description,
          h1Count: document.querySelectorAll("h1").length,
          jsonLd,
          text: document.body.innerText,
        };
      });

      assert(state.title.length >= 18 && state.title.length <= 80, `${route.path}: weak title length (${state.title.length})`);
      assert(state.description.length >= 80 && state.description.length <= 210, `${route.path}: weak description length (${state.description.length})`);
      assert(state.h1Count === 1, `${route.path}: expected one H1, found ${state.h1Count}`);
      assert(state.canonical === `${SITE_URL}${route.canonical}`, `${route.path}: wrong canonical ${state.canonical}`);

      const normalizedRobots = state.robots.toLowerCase();
      if (route.indexable) {
        assert(normalizedRobots.includes("index") && !normalizedRobots.includes("noindex"), `${route.path}: should be indexable (${state.robots})`);
      } else {
        assert(normalizedRobots.includes("noindex"), `${route.path}: utility route must be noindex (${state.robots})`);
      }

      if (route.path === "/") {
        const store = state.jsonLd.find((item) => item["@type"] === "Store");
        const website = state.jsonLd.find((item) => item["@type"] === "WebSite");
        assert(store, "home: Store JSON-LD missing");
        assert(website, "home: WebSite JSON-LD missing");
        assert(store.slogan === TAGLINE, `home: wrong slogan ${store.slogan}`);
        assert(store.email === EMAIL, `home: wrong email ${store.email}`);
        const contacts = Array.isArray(store.contactPoint) ? store.contactPoint : [store.contactPoint].filter(Boolean);
        const phones = contacts.map((point) => point.telephone).filter(Boolean);
        assert(phones.includes(PRIMARY_PHONE), `home: primary phone absent from Store JSON-LD (${phones.join(", ")})`);
        assert(phones.includes(SECONDARY_PHONE), `home: secondary phone absent from Store JSON-LD (${phones.join(", ")})`);
        assert(website.alternateName === TAGLINE, "home: tagline missing from WebSite schema");
      }

      if (route.path === "/contact") {
        assert(state.text.includes(TAGLINE), "contact: tagline missing");
        assert(state.text.includes(EMAIL), "contact: verified email missing");
        assert(state.text.includes(PRIMARY_PHONE), "contact: primary phone missing");
        assert(state.text.includes(SECONDARY_PHONE), "contact: secondary phone missing");
      }

      if (route.path.startsWith("/products/")) {
        const itemPage = state.jsonLd.find((item) => item["@type"] === "ItemPage");
        const breadcrumb = state.jsonLd.find((item) => item["@type"] === "BreadcrumbList");
        assert(itemPage, "product: ItemPage JSON-LD missing");
        assert(breadcrumb, "product: BreadcrumbList JSON-LD missing");
        const serialized = JSON.stringify(state.jsonLd);
        assert(!serialized.includes('"@type":"Offer"'), "product: unsupported Offer schema present");
        assert(!serialized.includes("aggregateRating"), "product: unsupported aggregateRating present");
        assert(!serialized.includes("reviewCount"), "product: unsupported reviewCount present");
        assert(!serialized.includes("InStock") && !serialized.includes("OutOfStock"), "product: unsupported live availability schema present");
      }

      assert(errors.length === 0, `${route.path}: browser errors: ${errors.join(" | ")}`);
      console.log(`✓ SEO ${route.path}`);
      await page.close();
    }

    const sitemapResponse = await context.request.get(`${BASE_URL}/sitemap.xml`);
    assert(sitemapResponse.ok(), `sitemap request failed: ${sitemapResponse.status()}`);
    const sitemap = await sitemapResponse.text();
    assert(sitemap.includes(`${SITE_URL}/products/makhhi-thread`), "sitemap: product detail missing");
    assert(sitemap.includes(`${SITE_URL}/contact`), "sitemap: contact missing");
    assert(!sitemap.includes(`${SITE_URL}/wishlist`), "sitemap: wishlist utility route should be excluded");
    assert(!sitemap.includes(`${SITE_URL}/enquiry`), "sitemap: enquiry utility route should be excluded");
    assert(!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap), "sitemap: synthetic lastmod should not be emitted");

    console.log("\nSEO, structured-data, sitemap and verified-business integrity passed.");
  } finally {
    await context.close();
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
