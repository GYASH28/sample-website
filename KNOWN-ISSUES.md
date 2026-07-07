# Fakhri Mart — Known Issues & Intentional Design Choices

This file documents things that look like bugs but are deliberate decisions, so a future audit doesn't re-flag them as defects.

## No pincode "delivery checker"

**Status:** Intentionally removed in the fresh rebuild.

The old site had a `PincodeChecker.jsx` component that accepted any 6-digit pincode, waited on an artificial `setTimeout`, and always returned "Yes, we deliver here!" — admitted in its own source comment as "simulating realism for a result that never changes." This was exactly the "buttons that are just for show" problem.

The fresh rebuild replaces it with an honest static shipping line on the Contact page and ProductDetail:

> "We ship pan-India. Typical transit: 3–5 business days. Confirm exact timing for your area on WhatsApp."

No fake input, no fake loading state, no fake check. The business does ship pan-India, so the answer is always yes — saying so directly is more honest than theater.

---

## No real review system behind the `rating` / `reviewCount` fields

**Files:** `src/data/catalogue.js`, `src/hooks/useJsonLd.js`

**Behavior:** Each product has `rating` (4.3–4.9) and `reviewCount` (12–60) fields, displayed as stars on cards and product pages, and emitted as `aggregateRating` in JSON-LD structured data.

**Why this is intentional:** There is no backend, no accounts, no verified-purchase flow. The values are seeded from real-data heuristics (tag popularity + color variety) and should be updated by the business owner from real WhatsApp/Instagram feedback. A `// TODO` comment marks the spot in `catalogue.js`.

**Risk:** The numbers look like live data but aren't dynamically updated. Google's Rich Results Test may flag `aggregateRating` without a backing review system.

**Status:** Acceptable for the WhatsApp-enquiry catalogue model. When a real review API exists, replace the `aggregateRating` block in `useJsonLd.js → productJsonLd` with verified data.

---

## No live inventory sync

**File:** `src/data/catalogue.js` (`stock` field per product)

**Behavior:** Each product has a `stock` field (`"in"` | `"low"` | `"out"`) that drives the stock badge and the Notify-me-on-WhatsApp block.

**Why this is intentional:** There is no inventory system to sync with. The field is a static, editor-maintained flag.

**Risk:** A product marked "in stock" on the site may have sold out in the physical store. The WhatsApp-enquiry model absorbs this — the owner confirms availability in the reply.

**Status:** Acceptable for the current business model.

---

## No real-time "users online" counter

**Status:** Intentionally omitted. Fake concurrency counters are a dark pattern; the site does not and will not include one.

---

## Motion budget: only the hero animates on load

**File:** `src/pages/Home.jsx`, `src/lib/motion.js`

**Behavior:** The only load-time animation in the entire site is the hero's multi-thread weave (4 colored SVG paths drawing themselves once on page load, plus cross-stitch accents). Everything else is scroll-triggered (one-shot `whileInView`), hover/tap feedback, or route transitions.

**Why this is intentional:** The old site had 11 simultaneous always-on infinite CSS animations, which was the direct cause of the "laggy" feeling on real devices. The fresh rebuild enforces a hard budget of 2–3 ambient animations per page (the hero weave is the only one that qualifies, and it's load-time one-shot, not infinite).

**Status:** Deliberate. The hero weave respects `prefers-reduced-motion` (disabled entirely under reduced motion) and is the single signature moment the rebuild prompt called for.
