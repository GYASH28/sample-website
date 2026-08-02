import { useEffect } from "react";

const defaults = {
  title: "Fakhri Mart | Yarn Store & Craft Supplier",
  description:
    "Fakhri Mart offers yarns, crochet threads, macrame cords, embroidery threads, beads, purse accessories, bases, handles and craft essentials with all-India delivery and bulk enquiry support.",
  image: "/assets/images/products/cotton-dreamz/hero.webp",
};

function setMeta(name, content, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function absoluteUrl(value) {
  return new URL(value || "/", window.location.origin).href;
}

function setCanonical(pathname) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  const href = absoluteUrl(pathname || window.location.pathname);
  el.setAttribute("href", href);
  return href;
}

export default function useDocumentMeta({ title, description, pathname, canonical, image } = {}) {
  useEffect(() => {
    const suffix = " | Fakhri Mart";
    const trimmed = (title || "").trim();
    const fullTitle = trimmed
      ? trimmed.toLowerCase().endsWith("fakhri mart")
        ? trimmed
        : trimmed + suffix
      : defaults.title;
    const desc = description || defaults.description;
    const canonicalHref = setCanonical(pathname || canonical || window.location.pathname);
    const imageHref = absoluteUrl(image || defaults.image);

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:type", "website", "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:url", canonicalHref, "property");
    setMeta("og:image", imageHref, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle, "property");
    setMeta("twitter:description", desc, "property");
    setMeta("twitter:image", imageHref, "property");

    return () => {
      document.title = defaults.title;
      setMeta("description", defaults.description);
      setMeta("og:title", defaults.title, "property");
      setMeta("og:description", defaults.description, "property");
      setMeta("twitter:title", defaults.title, "property");
      setMeta("twitter:description", defaults.description, "property");
    };
  }, [title, description, pathname, canonical, image]);
}
