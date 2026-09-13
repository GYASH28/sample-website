# Fakhri Mart — Current Operational Limits & Intentional Design Choices

Last reviewed: 2026-09-13

This file records current, verified constraints that can look like defects during an audit. Stale notes for removed components and old structured-data behavior have been removed.

## Enquiry-led catalogue: no live price or inventory promise

Fakhri Mart currently operates as a catalogue and enquiry experience rather than a transactional store. Live price, stock, exact composition, shade availability and order timing are confirmed personally through the enquiry flow.

This is deliberate. The structured data does not manufacture `Offer`, availability, review or rating data that the site cannot verify.

**Status:** Intentional until a trusted inventory/pricing backend exists.

---

## Digital colour preview is not supplier shade availability

Product pages and Quick View can recolour the existing representative product photo in the browser. The preview uses the same underlying image and does not create, download or store a separate product image for each colour.

The quick palette and custom colour picker are visual exploration tools only. A preview colour must never be copied into `product.colors`, stock data or structured data unless a current supplier source explicitly verifies that shade. The enquiry flow records a digital preview hex only as a visual reference and asks the store to match it to the nearest currently available supplier shade.

The legacy colour-image generation script is retired. Regression tests fail if the colour preview changes the product image URL or requests legacy `color-*.webp` variants.

**Status:** Intentional single-image architecture and catalogue-integrity requirement.

---

## Opening motion adapts to the visitor and device

The commerce opening sequence uses the site's motion profile. Reduced-motion visitors skip the animated opening, lower-resource/touch devices receive lighter motion, and the intro is remembered for the session unless explicitly forced for testing.

**Status:** Intentional accessibility/performance behavior. Covered by cinematic, lifecycle and intro-performance regression tests.

---

## Public route prerendering uses the explicit prerender build

`npm run build` creates the normal sitemap + Vite production bundle.

`npm run build:prerender` additionally prerenders the public route set. CI uses the stricter prerender build before route, SEO and performance validation/deployment output.

**Status:** Intentional separation between a fast bundle build and full prerender validation/deployment output.

---

## No fake social-proof or concurrency counters

The site does not invent live visitor counts, real-time purchase counters, verified-review totals or other dynamic signals without a trusted backing data source.

**Status:** Intentional trust requirement.

---

## Current audit status

As of the review date above, no unresolved runtime defect is intentionally accepted in this file. New reproducible issues should be added here only when they are genuine current constraints and should include the affected route/component, user impact, and planned resolution.
