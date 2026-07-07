# Fakhri Mart — SEO Operations

This document covers the SEO operations that **cannot be automated** and must be done by the site owner. The automated parts (sitemap generation, JSON-LD emission, prerendering) are wired into the build pipeline.

## What the build does for you

- `npm run build` runs `generate-sitemap.js` → `public/sitemap.xml` covers all static routes, all product slugs, and all blog post slugs.
- `npm run build` then runs `vite build` → static assets in `dist/`.
- Finally `npm run build` runs `prerender.js` → boots Playwright against the preview server, visits every route, writes fully-rendered HTML (with JSON-LD + meta tags) back into `dist/`. This makes the structured data visible to crawlers that don't execute JS.
- `useDocumentMeta` hook sets title/description/OG/canonical per route.
- `useJsonLd` hook emits `Product`, `LocalBusiness` (Store), `BreadcrumbList`, and `Article` JSON-LD on the appropriate routes.
- `public/robots.txt` allows all crawlers and points to the sitemap.

## What you (the site owner) must do once

### 1. Submit the sitemap in Google Search Console

1. Sign in at https://search.google.com/search-console
2. Add your property (`https://fakhrimart.in` — replace with the real domain configured in `vercel.json` / Vercel project settings)
3. Verify ownership (recommended: DNS TXT record)
4. Go to **Sitemaps** → submit `https://fakhrimart.in/sitemap.xml`
5. Check back in 24–48h; the coverage report should show all submitted URLs as "Discovered — currently not indexed" initially, then progressively indexed.

### 2. Update `businessInfo.url` in `src/data/siteData.js`

Change `https://fakhrimart.in` to the real production URL **before deploying**. This URL is used for:
- Canonical URLs (`<link rel="canonical">`)
- Sitemap `<loc>` values
- JSON-LD `image` and `item` URLs
- `robots.txt` Sitemap directive

### 3. Validate structured data

After deploying, run each unique URL through:
- **Google Rich Results Test** — https://search.google.com/test/rich-results
  - Submit a product detail page URL (e.g. `/products/makhhi-thread`) and confirm `Product` + `BreadcrumbList` schemas are detected.
  - Submit the homepage and confirm `Store` (LocalBusiness) is detected.
  - Submit a blog post URL (e.g. `/blog/how-to-choose-yarn-weight`) and confirm `Article` is detected.
- Test against the **prerendered** URL (the live deployed URL), not `localhost:5173` — the prerendered HTML is what crawlers see.

### 4. Per-page metadata audit (one-time)

Each route's `useDocumentMeta({ title, description, ... })` call should have a unique description. Grep `src/pages/**/*.jsx` for `useDocumentMeta` and confirm:
- No copy-pasted defaults
- Product detail pages use `product.description` as the meta description (already wired)
- Blog posts use `post.excerpt` as the meta description (already wired)

### 5. Internal linking

The site already has contextual internal links between:
- Home → Products (`/products`)
- Home → Yarn Calculator (Phase 3)
- ProductDetail → Related products + Recently Viewed + Frequently Enquired Together bundles (Phase 1)
- Blog → individual posts (Phase 6)
- Products page → Departments (`?department=yarns` etc., Prompt 2 Part 2)

If you add new pages, link to them from at least one existing page so crawlers can discover them.

## Known limitations

- **No real review system.** `rating` and `reviewCount` in `siteData.js` are manually entered from real WhatsApp/Instagram feedback. When a backend with verified-purchase reviews exists, replace the `aggregateRating` block in `useJsonLd.js → productJsonLd` with real data. A `// TODO` comment marks this spot.
- **No live inventory sync.** The `stock` field on each product is a static, manually-maintained flag.
- **No real-time "users online" counter.** This is intentional — fake concurrency counters are a dark pattern.
