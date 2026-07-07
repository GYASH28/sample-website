// src/hooks/useJsonLd.js
// Phase 1 — JSON-LD structured data injection.
// Mirrors useDocumentMeta.js pattern: append <script type="application/ld+json"> on mount,
// remove on unmount, so per-page schema is always fresh.

import { useEffect } from "react";
import { businessInfo } from "../data/siteData.js";

export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    el.setAttribute("data-jsonld", "managed");
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [JSON.stringify(data)]);
}

// ── Builders ────────────────────────────────────────────────────────────────
export function productJsonLd(product, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [new URL(product.image, canonicalUrl).href] : undefined,
    brand: { "@type": "Brand", name: product.brand || product.category },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      // No public price — contact-for-price via WhatsApp. Availability only.
      availability:
        product.stock === "out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: canonicalUrl,
    },
    // Phase 2 item 7: aggregateRating block removed — StarRating was deleted,
    // and rating/reviewCount fields are not real (no backend review system).
    // Re-add only when a real review API exists.
  };
}

export function localBusinessJsonLd(businessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    name: businessInfo.name,
    description: businessInfo.tagline,
    telephone: businessInfo.phoneDisplay,
    email: businessInfo.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Pune",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    url: businessInfo.url,
    sameAs: [businessInfo.instagramUrl].filter(Boolean),
  };
}

export function breadcrumbJsonLd(trail) {
  // trail = [{ name, url }, ...]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Phase 5 item 6: WebSite schema with SearchAction — enables sitelinks search box in Google results.
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": businessInfo.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${businessInfo.url}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
