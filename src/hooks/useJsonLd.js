// src/hooks/useJsonLd.js
// Phase 1 — JSON-LD structured data injection.
// Mirrors useDocumentMeta.js pattern: append <script type="application/ld+json"> on mount,
// remove on unmount, so per-page schema is always fresh.

import { useEffect } from "react";

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
    aggregateRating: product.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
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
