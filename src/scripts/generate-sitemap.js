import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const { featuredProducts, blogPosts } = await import("../data/siteData.js");
const { PUBLIC_SITE_URL } = await import("../data/businessProfile.js");

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
];
const productRoutes = featuredProducts.map((product) => `/products/${product.slug}`);
const blogRoutes = blogPosts.map((post) => `/blog/${post.slug}`);
const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes];

const today = new Date().toISOString().split("T")[0];

function routeMeta(route) {
  if (route === "/") return { changefreq: "weekly", priority: "1.0" };
  if (route === "/products" || route === "/yarn-guide") return { changefreq: "weekly", priority: "0.9" };
  if (route.startsWith("/products/")) return { changefreq: "monthly", priority: "0.8" };
  if (route.startsWith("/blog/")) return { changefreq: "monthly", priority: "0.7" };
  return { changefreq: "monthly", priority: "0.6" };
}

const urls = allRoutes
  .map((route) => {
    const meta = routeMeta(route);
    return `  <url>
    <loc>${PUBLIC_SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
  })
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
