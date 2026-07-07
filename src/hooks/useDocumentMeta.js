// src/hooks/useDocumentMeta.js
// Per-route document metadata. Sets title/description/OG/canonical.

import { useEffect } from "react";
import { businessInfo } from "../data/catalogue.js";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useDocumentMeta({ title, description, image, canonical, type = "website" }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${businessInfo.shortName}` : businessInfo.shortName;
    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:site_name", businessInfo.name);
    upsertMeta("property", "og:image", image || "/assets/og-default.png");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertLink("canonical", canonical || window.location.href);
  }, [title, description, image, canonical, type]);
}
