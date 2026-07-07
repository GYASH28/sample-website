// src/scripts/generate-sitemap.js
// Generate public/sitemap.xml at build time. Covers static routes + every product slug.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { businessInfo, products } = await import("../data/catalogue.js");

const staticRoutes = ["/", "/products", "/about", "/contact", "/wishlist", "/enquiry"];
const productRoutes = products.map((p) => `/products/${p.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes];

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
