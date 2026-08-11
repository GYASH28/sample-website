import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { businessInfo, featuredProducts, blogPosts } = await import("../data/siteData.js");
const { verifiedBusiness } = await import("../data/verifiedBusiness.js");
Object.assign(businessInfo, verifiedBusiness);

const staticRoutes = [
  "/",
  "/products",
  "/yarn-guide",
  "/about",
  "/contact",
  "/blog",
  "/privacy",
  "/terms",
  "/delivery-enquiries",
];
const productRoutes = featuredProducts.map((product) => `/products/${product.slug}`);
const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];

const urls = allRoutes
  .map((route) => `  <url>\n    <loc>${businessInfo.url}${route}</loc>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

const outPath = resolve(__dirname, "../../public/sitemap.xml");
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, xml, "utf-8");
console.log(`Sitemap written: ${allRoutes.length} public discovery URLs → ${outPath}`);
