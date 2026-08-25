# Fakhri Mart — Current Operational Limits & Intentional Design Choices

Last reviewed: 2026-08-25

This file records current, verified constraints that can look like defects during an audit. Stale notes for removed components and old structured-data behavior have been removed.

## Enquiry-led catalogue: no live price or inventory promise

Fakhri Mart currently operates as a catalogue and enquiry experience rather than a transactional store. Live price, stock, exact composition, shade availability and order timing are confirmed personally through the enquiry flow.

This is deliberate. The structured data does not manufacture `Offer`, availability, review or rating data that the site cannot verify.

**Status:** Intentional until a trusted inventory/pricing backend exists.

---

## Opening motion adapts to the visitor and device

The commerce opening sequence uses the site's motion profile. Reduced-motion visitors skip the animated opening, lower-resource/touch devices receive lighter motion, and the intro is remembered for the session unless explicitly forced for testing.

**Status:** Intentional accessibility/performance behavior. Covered by cinematic, lifecycle and intro-performance regression tests.

---

## Public route prerendering uses the explicit prerender build

`npm run build` creates the normal sitemap + Vite production bundle.

`npm run build:prerender` additionally prerenders the public route set. CI uses the stricter prerender build before route, SEO and performance validation.

**Status:** Intentional separation between a fast bundle build and full prerender validation/deployment output.

---

## No fake social-proof or concurrency counters

The site does not invent live visitor counts, real-time purchase counters, verified-review totals or other dynamic signals without a trusted backing data source.

**Status:** Intentional trust requirement.

---

## Current audit status

As of the review date above, no unresolved runtime defect is intentionally accepted in this file. New reproducible issues should be added here only when they are genuine current constraints and should include the affected route/component, user impact, and planned resolution.
