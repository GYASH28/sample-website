# Fakhri Mart — SEO Operations

This document covers the SEO operations that **cannot be automated** and must be done by the site owner.

## What the build does for you

- `npm run build` runs `generate-sitemap.js` → `public/sitemap.xml` covers all static routes + every product slug.
- `npm run build` then runs `vite build` → static assets in `dist/`.
- Finally `npm run build` runs `prerender.js` → boots Playwright against the preview server, visits every route, writes fully-rendered HTML (with JSON-LD + meta tags) back into `dist/`. This makes the structured data visible to crawlers that don't execute JS.
- `useDocumentMeta` hook sets title/description/OG/canonical per route.
- `useJsonLd` hook emits `Product`, `LocalBusiness` (Store), and `BreadcrumbList` JSON-LD on the appropriate routes.
- `public/robots.txt` allows all crawlers and points to the sitemap.

## What you (the site owner) must do once

### 1. Submit the sitemap in Google Search Console

1. Sign in at https://search.google.com/search-console
2. Add your property (`https://fakhrimart.in` — replace with the real domain)
3. Verify ownership (recommended: DNS TXT record)
4. Go to **Sitemaps** → submit `https://fakhrimart.in/sitemap.xml`
5. Check back in 24–48h.

### 2. Update `businessInfo.url` in `src/data/catalogue.js`

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
- Test against the **prerendered** URL (the live deployed URL), not `localhost:4173`.

### 4. Verify prerendering with curl

```bash
curl -s https://fakhrimart.in/products/makhhi-thread | grep -o '"@type":"[^"]*"'
```

Should output `Product`, `BreadcrumbList`, `AggregateRating`, `Offer`, `Brand` — proving the JSON-LD is in the static HTML, not just the runtime DOM.
