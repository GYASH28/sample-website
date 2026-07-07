// src/hooks/useJsonLd.js
// JSON-LD structured data injection. Mirrors useDocumentMeta pattern.
// Builders: productJsonLd, localBusinessJsonLd, breadcrumbJsonLd, articleJsonLd.

import { useEffect } from "react";
import { businessInfo } from "../data/catalogue.js";

export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    el.setAttribute("data-jsonld", "managed");
    document.head.appendChild(el);
    return () => el.remove();
  }, [JSON.stringify(data)]);
}

export function productJsonLd(product, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [new URL(product.images.hero, canonicalUrl).href],
    brand: { "@type": "Brand", name: product.brand || product.category },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
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

export function localBusinessJsonLd() {
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

export function articleJsonLd(post, canonicalUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: businessInfo.name },
    publisher: { "@type": "Organization", name: businessInfo.name },
    mainEntityOfPage: canonicalUrl,
  };
}
