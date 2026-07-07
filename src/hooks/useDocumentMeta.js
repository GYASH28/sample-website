import { useEffect } from "react";

const defaults = {
  title: "Fakhri Mart | Yarn Store & Craft Supplier",
  description:
    "Fakhri Mart offers yarns, crochet threads, macrame cords, embroidery threads, beads, purse accessories, bases, handles and craft essentials with all-India delivery and bulk enquiry support.",
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
  el.setAttribute("href", `${window.location.origin}${pathname}`);
}

/**
 * Sets document title, meta description, OG tags, and canonical link.
 * Resets to defaults on unmount.
 */
export default function useDocumentMeta({ title, description, pathname } = {}) {
  useEffect(() => {
    // Phase 5 — avoid double-suffix when callers already include "| Fakhri Mart"
    const suffix = " | Fakhri Mart";
    const trimmed = (title || "").trim();
    const fullTitle = trimmed
      ? trimmed.toLowerCase().endsWith("fakhri mart")
        ? trimmed
        : trimmed + suffix
      : defaults.title;
    const desc = description || defaults.description;
    const path = pathname || window.location.pathname;

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("twitter:title", fullTitle, "property");
    setMeta("twitter:description", desc, "property");
    setCanonical(path);

    return () => {
      document.title = defaults.title;
      setMeta("description", defaults.description);
      setMeta("og:title", defaults.title, "property");
      setMeta("og:description", defaults.description, "property");
      setMeta("twitter:title", defaults.title, "property");
      setMeta("twitter:description", defaults.description, "property");
    };
  }, [title, description, pathname]);
}
