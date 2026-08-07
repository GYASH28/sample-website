import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { businessInfo, featuredProducts, blogPosts } = await import("../data/siteData.js");

const staticRoutes = [
  "/",
  "/products",
  "/yarn-guide",
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
const today = new Date().toISOString().split("T")[0];

const urls = allRoutes
  .map((route) => `  <url>\n    <loc>${businessInfo.url}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route === "/" ? "weekly" : "monthly"}</changefreq>\n    <priority>${route === "/" ? "1.0" : route.startsWith("/products/") ? "0.8" : route === "/yarn-guide" ? "0.8" : "0.6"}</priority>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const outPath = resolve(__dirname, "../../public/sitemap.xml");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf-8");
console.log(`Sitemap written: ${allRoutes.length} URLs → ${outPath}`);
