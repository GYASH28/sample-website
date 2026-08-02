import { useEffect } from "react";
import { PUBLIC_SITE_URL } from "../data/businessProfile.js";

const defaults = {
  title: "Fakhri Mart | Yarn Store & Craft Supplier in Pune",
  description:
    "Fakhri Mart offers yarns, crochet threads, macrame cords, embroidery threads, beads, purse accessories, bases, handles and craft essentials with all-India delivery and bulk enquiry support.",
  image: `${PUBLIC_SITE_URL}/assets/images/editorial/atelier-hero-960.webp`,
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

function setCanonical(pathname) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  const normalized = pathname === "/" ? "/" : `/${String(pathname || "").replace(/^\/+|\/+$/g, "")}`;
  el.setAttribute("href", `${PUBLIC_SITE_URL}${normalized}`);
  return `${PUBLIC_SITE_URL}${normalized}`;
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
    const path = pathname || canonical || window.location.pathname;
    const canonicalUrl = setCanonical(path);
    const socialImage = image ? new URL(image, PUBLIC_SITE_URL).href : defaults.image;

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", socialImage, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", socialImage);

    return () => {
      document.title = defaults.title;
      setMeta("description", defaults.description);
      setMeta("og:title", defaults.title, "property");
      setMeta("og:description", defaults.description, "property");
      setMeta("twitter:title", defaults.title);
      setMeta("twitter:description", defaults.description);
    };
  }, [title, description, pathname, canonical, image]);
}
