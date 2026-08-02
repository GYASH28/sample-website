import { useEffect } from "react";
import { businessInfo } from "../data/siteData.js";
import { googlePresence, PUBLIC_SITE_URL } from "../data/businessProfile.js";

export function useJsonLd(data) {
  useEffect(() => {
    if (!data) return undefined;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    el.setAttribute("data-jsonld", "managed");
    document.head.appendChild(el);
    return () => el.remove();
  }, [JSON.stringify(data)]);
}

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return undefined;
  try {
    return new URL(pathOrUrl, PUBLIC_SITE_URL).href;
  } catch {
    return pathOrUrl;
  }
}

export function productJsonLd(product, canonicalUrl) {
  const url = canonicalUrl || `${PUBLIC_SITE_URL}/products/${product.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image ? [absoluteUrl(product.image)] : undefined,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand || product.category },
    additionalProperty: [
      product.variants
        ? { "@type": "PropertyValue", name: "Variants", value: product.variants }
        : null,
      product.suitableFor
        ? { "@type": "PropertyValue", name: "Suitable for", value: product.suitableFor }
        : null,
    ].filter(Boolean),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      availability:
        product.stock === "out"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url,
      seller: { "@id": `${PUBLIC_SITE_URL}/#store` },
    },
  };
}

export function localBusinessJsonLd(info = businessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${PUBLIC_SITE_URL}/#store`,
    name: info.name,
    description:
      "Yarns, crochet threads, macrame cords, embroidery threads, beads, purse accessories, bases, handles and craft essentials from Pune with all-India delivery and bulk enquiry support.",
    url: PUBLIC_SITE_URL,
    logo: `${PUBLIC_SITE_URL}/assets/fakhri-mart-logo.webp`,
    image: `${PUBLIC_SITE_URL}/assets/images/products/cotton-dreamz/hero.webp`,
    telephone: info.phoneDisplay,
    email: info.email,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, bank transfer",
    hasMap: googlePresence.mapsUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: googlePresence.locality,
      addressRegion: googlePresence.region,
      addressCountry: "IN",
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "Country", name: "India" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: info.phoneDisplay,
      contactType: "sales and catalogue enquiries",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
    knowsAbout: [
      "Yarn",
      "Crochet thread",
      "Knitting yarn",
      "Macrame cord",
      "Embroidery thread",
      "Crochet hooks",
      "Beads",
      "Purse handles",
      "Bag-making accessories",
      "Bulk yarn orders",
    ],
    sameAs: [
      info.instagramUrl,
      googlePresence.businessProfileUrl,
      googlePresence.mapsUrl,
    ].filter(Boolean),
  };
}

export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${PUBLIC_SITE_URL}/#website`,
    name: businessInfo.name,
    url: PUBLIC_SITE_URL,
    publisher: { "@id": `${PUBLIC_SITE_URL}/#store` },
    potentialAction: {
      "@type": "SearchAction",
      target: `${PUBLIC_SITE_URL}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function contactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact and visit Fakhri Mart",
    url: `${PUBLIC_SITE_URL}/contact`,
    mainEntity: { "@id": `${PUBLIC_SITE_URL}/#store` },
  };
}

export function faqPageJsonLd(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
