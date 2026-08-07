import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_wishlist";
const UPDATE_EVENT = "wishlist-updated";
const MAX_ITEMS = 250;

function normalizeWishlist(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((slug) => typeof slug === "string" && slug.trim()).map((slug) => slug.trim()))].slice(0, MAX_ITEMS);
}

export function getWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeWishlist(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

export function saveWishlist(wishlist) {
  const normalized = normalizeWishlist(wishlist);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
  return normalized;
}

export function toggleWishlist(slug) {
  if (typeof slug !== "string" || !slug.trim()) return;
  const wishlist = getWishlist();
  const cleanSlug = slug.trim();
  const next = wishlist.includes(cleanSlug)
    ? wishlist.filter((item) => item !== cleanSlug)
    : [...wishlist, cleanSlug];
  saveWishlist(next);
}

export function addToWishlist(slug) {
  if (typeof slug !== "string" || !slug.trim()) return;
  const wishlist = getWishlist();
  const cleanSlug = slug.trim();
  if (!wishlist.includes(cleanSlug)) saveWishlist([...wishlist, cleanSlug]);
}

export function removeFromWishlist(slug) {
  if (typeof slug !== "string") return;
  saveWishlist(getWishlist().filter((item) => item !== slug));
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => getWishlist());

  useEffect(() => {
    const handleUpdate = () => setWishlist(getWishlist());
    const handleStorage = (event) => {
      if (!event || event.key === STORAGE_KEY) handleUpdate();
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return {
    wishlist,
    toggle: toggleWishlist,
    add: addToWishlist,
    remove: removeFromWishlist,
    has: (slug) => wishlist.includes(slug),
    count: wishlist.length,
  };
}
