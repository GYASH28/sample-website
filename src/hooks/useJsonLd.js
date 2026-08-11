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
  try { return new URL(pathOrUrl, PUBLIC_SITE_URL).href; } catch { return pathOrUrl; }
}

function productPageParts(product) {
  const parts = [];
  if (product.variants) {
    parts.push({
      "@type": "WebPageElement",
      name: "Catalogue options",
      text: String(product.variants),
    });
  }
  if (product.colors?.length) {
    parts.push({
      "@type": "WebPageElement",
      name: "Representative shade names",
      text: product.colors.map((shade) => shade.name).join(", "),
    });
  }
  if (product.quantityOptions?.soldAs) {
    parts.push({
      "@type": "WebPageElement",
      name: "Listed pack format",
      text: String(product.quantityOptions.soldAs),
    });
  }
  return parts;
}

// Fakhri Mart is enquiry-led: live price, stock, exact composition and exact
// shade are confirmed personally. Google Product rich results require genuine
// merchant/review information, so this describes the page and its *published
// catalogue options* without manufacturing Offer, availability or rating data.
export function productJsonLd(product, canonicalUrl) {
  const url = canonicalUrl || `${PUBLIC_SITE_URL}/products/${product.slug}`;
  const images = [product.image, ...(product.galleryImages || [])].filter(Boolean).map((image) => absoluteUrl(image));
  const hasPart = productPageParts(product);

  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "@id": `${url}#webpage`,
    url,
    name: `${product.name} | Fakhri Mart`,
    description: product.description,
    isPartOf: { "@id": `${PUBLIC_SITE_URL}/#website` },
    primaryImageOfPage: images[0] ? { "@type": "ImageObject", contentUrl: images[0] } : undefined,
    about: {
      "@type": "Thing",
      name: product.name,
      identifier: product.slug,
      description: product.description,
      image: images,
      sameAs: url,
    },
    hasPart: hasPart.length ? hasPart : undefined,
  };
}

export function localBusinessJsonLd(info = businessInfo) {
  const contactPoints = [
    {
      "@type": "ContactPoint",
      telephone: info.phoneDisplay,
      email: info.email,
      contactType: "sales and catalogue enquiries",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
    info.secondaryPhoneDisplay ? {
      "@type": "ContactPoint",
      telephone: info.secondaryPhoneDisplay,
      contactType: "sales and catalogue enquiries",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    } : null,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${PUBLIC_SITE_URL}/#store`,
    name: info.name,
    slogan: info.tagline,
    description: "Yarns, crochet threads, macrame cords, embroidery threads, beads, purse accessories, bases, handles and craft essentials from Pune with all-India delivery and retail or bulk enquiry support.",
    url: PUBLIC_SITE_URL,
    logo: `${PUBLIC_SITE_URL}/assets/brand/fakhri-logo-640.webp`,
    image: `${PUBLIC_SITE_URL}/assets/images/editorial/atelier-hero-960.webp`,
    telephone: info.phoneDisplay,
    email: info.email,
    hasMap: googlePresence.mapsUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: googlePresence.locality,
      addressRegion: googlePresence.region,
      addressCountry: "IN",
    },
    areaServed: [{ "@type": "City", name: "Pune" }, { "@type": "Country", name: "India" }],
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    }],
    contactPoint: contactPoints,
    knowsAbout: ["Yarn", "Crochet thread", "Knitting yarn", "Macrame cord", "Embroidery thread", "Crochet hooks", "Beads", "Purse handles", "Bag-making accessories", "Bulk yarn orders"],
    sameAs: [info.instagramUrl, googlePresence.businessProfileUrl, googlePresence.mapsUrl].filter(Boolean),
  };
}

export function breadcrumbJsonLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${PUBLIC_SITE_URL}/#website`,
    name: businessInfo.name,
    alternateName: businessInfo.tagline,
    url: PUBLIC_SITE_URL,
    publisher: { "@id": `${PUBLIC_SITE_URL}/#store` },
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
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}
