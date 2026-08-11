import { useEffect } from "react";
import { PUBLIC_SITE_URL } from "../data/businessProfile.js";

const defaults = {
  title: "Fakhri Mart | Yarn, Crochet & Craft Supplier in Pune",
  description:
    "Fakhri Mart — Colorful Threads, Endless Creation. Browse yarns, crochet threads, macrame cords, embroidery supplies, beads and bag-making materials from Pune, then enquire for current shades, quantity pricing and India-wide delivery.",
  image: `${PUBLIC_SITE_URL}/assets/images/editorial/atelier-hero-960.webp`,
  robots: "index, follow, max-image-preview:large",
};

const NOINDEX_ROUTES = new Set(["/wishlist", "/enquiry"]);
const MAX_DESCRIPTION_LENGTH = 168;

function normalizeDescription(value) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;

  const slice = normalized.slice(0, MAX_DESCRIPTION_LENGTH - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const clean = (lastSpace > 120 ? slice.slice(0, lastSpace) : slice).replace(/[,:;\-\s]+$/g, "");
  return `${clean}…`;
}

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

export default function useDocumentMeta({ title, description, pathname, canonical, image, robots, type = "website" } = {}) {
  useEffect(() => {
    const suffix = " | Fakhri Mart";
    const trimmed = (title || "").trim();
    const fullTitle = trimmed
      ? trimmed.toLowerCase().endsWith("fakhri mart")
        ? trimmed
        : trimmed + suffix
      : defaults.title;
    const desc = normalizeDescription(description || defaults.description);
    const path = pathname || canonical || window.location.pathname;
    const canonicalUrl = setCanonical(path);
    const socialImage = image ? new URL(image, PUBLIC_SITE_URL).href : defaults.image;
    const robotsValue = robots || (NOINDEX_ROUTES.has(path) ? "noindex, follow" : defaults.robots);

    document.title = fullTitle;
    setMeta("description", desc);
    setMeta("robots", robotsValue);
    setMeta("og:type", type, "property");
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:url", canonicalUrl, "property");
    setMeta("og:image", socialImage, "property");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", socialImage);

    return () => {
      document.title = defaults.title;
      setMeta("description", normalizeDescription(defaults.description));
      setMeta("robots", defaults.robots);
      setMeta("og:type", "website", "property");
      setMeta("og:title", defaults.title, "property");
      setMeta("og:description", normalizeDescription(defaults.description), "property");
      setMeta("twitter:title", defaults.title);
      setMeta("twitter:description", normalizeDescription(defaults.description));
    };
  }, [title, description, pathname, canonical, image, robots, type]);
}
