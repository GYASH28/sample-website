// src/scripts/generate-sitemap.js
// Phase 1.4 — generate public/sitemap.xml at build time.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { businessInfo, featuredProducts, blogPosts } = await import("../data/siteData.js");

const staticRoutes = ["/", "/products", "/gallery", "/about", "/contact", "/wishlist", "/enquiry", "/blog"];
const productRoutes = featuredProducts.map((p) => `/products/${p.slug}`);
const blogRoutes = blogPosts.map((p) => `/blog/${p.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];

const today = new Date().toISOString().split("T")[0];

const urls = allRoutes
  .map(
    (route) => `  <url>
    <loc>${businessInfo.url}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route.startsWith("/products/") ? "0.8" : "0.6"}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outPath = resolve(__dirname, "../../public/sitemap.xml");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf-8");
console.log(`✓ sitemap.xml written: ${allRoutes.length} URLs → ${outPath}`);
