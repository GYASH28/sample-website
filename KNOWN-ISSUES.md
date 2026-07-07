# Fakhri Mart — Known Issues & Intentional Design Choices

This file documents things that look like bugs but are deliberate decisions, so a future audit doesn't re-flag them as defects.

## PincodeChecker returns "Yes, we deliver here!" for any syntactically valid 6-digit pincode

**File:** `src/components/PincodeChecker.jsx`

**Behavior:** Any 6-digit number entered into the pincode checker gets a confident "Yes, we deliver here!" response.

**Why this is intentional:** Fakhri Mart genuinely delivers all-India. There is no real pincode-serviceability API behind this — the check is purely syntactic (6 digits). The confirmation message is designed to reassure users, not to gate them.

**Risk:** A user who types an obviously fake code (e.g. `000000` or `999999`) still gets a confident, specific-sounding confirmation. This could feel dishonest if a user notices.

**Status:** Flagged for client review. If the client prefers softer copy, change the response to something like:

> "We deliver across India — we'll confirm exact timing for your area on WhatsApp."

instead of a hard yes/no. The current copy was confirmed acceptable as of the last audit, but should be re-confirmed periodically.

---

## No real review system behind the `rating` / `reviewCount` fields

**File:** `src/data/siteData.js`, `src/hooks/useJsonLd.js`

**Behavior:** Each product has `rating` (4.3–4.9) and `reviewCount` (12–60) fields, displayed as stars on cards and product pages, and emitted as `aggregateRating` in JSON-LD structured data.

**Why this is intentional:** There is no backend, no accounts, no verified-purchase flow. The values are manually entered by the business owner from real WhatsApp/Instagram feedback. A `// TODO: replace with real review system when backend exists` comment marks the spot in the code.

**Risk:** The numbers look like live data but aren't dynamically updated. Google's Rich Results Test may flag `aggregateRating` without a backing review system.

**Status:** Acceptable for the WhatsApp-enquiry catalogue model. When a real review API exists, replace the `aggregateRating` block in `useJsonLd.js → productJsonLd` with verified data.

---

## No live inventory sync

**File:** `src/data/siteData.js` (`stock` field per product)

**Behavior:** Each product has a `stock` field (`"in"` | `"low"` | `"out"`) that drives the `StockBadge` and the Notify-me-on-WhatsApp block.

**Why this is intentional:** There is no inventory system to sync with. The field is a static, editor-maintained flag.

**Risk:** A product marked "in stock" on the site may have sold out in the physical store. The WhatsApp-enquiry model absorbs this — the owner confirms availability in the reply.

**Status:** Acceptable for the current business model.

---

## No real-time "users online" counter

**Status:** Intentionally omitted. Fake concurrency counters are a dark pattern; the site does not and will not include one.

---

## ScrollProgressThread is desktop-only

**File:** `src/components/ScrollProgressThread.jsx`

**Behavior:** The vertical gold thread on the right edge of the viewport only renders on non-touch devices with `prefers-reduced-motion: no-preference`.

**Why this is intentional:** The thread would clutter small mobile screens, and reduced-motion users should not see continuous scroll-linked animation.

**Status:** Deliberate. The CSS `@media (max-width: 768px) { .scroll-thread-container { display: none; } }` rule enforces this; the component also early-returns `null` under reduced motion.
