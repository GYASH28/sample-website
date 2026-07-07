import { useEffect, useState } from "react";

/**
 * useRecentlyViewed — tracks recently viewed product slugs with timestamps.
 * Stores as array of { slug, viewedAt } in localStorage.
 * Returns array of slugs (for backward compat) OR array of { slug, viewedAt } objects
 * if `withTimestamps` is true.
 */
export function useRecentlyViewed(currentSlug, withTimestamps = false) {
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fakhri_recently_viewed_v2");
      let items = stored ? JSON.parse(stored) : [];

      // Migrate old format (plain slug array) if present
      if (items.length > 0 && typeof items[0] === "string") {
        items = items.map((slug) => ({ slug, viewedAt: Date.now() }));
      }

      if (currentSlug) {
        // Remove if exists
        items = items.filter((item) =>
          typeof item === "string" ? item !== currentSlug : item.slug !== currentSlug
        );
        // Add to front with timestamp
        items.unshift({ slug: currentSlug, viewedAt: Date.now() });
        // Keep only max 6
        if (items.length > 6) items = items.slice(0, 6);
        localStorage.setItem("fakhri_recently_viewed_v2", JSON.stringify(items));
      }

      // Filter out the currently viewed product
      const filtered = items.filter(
        (item) => (typeof item === "string" ? item : item.slug) !== currentSlug
      );
      setRecentItems(filtered);
    } catch (e) {
      console.warn("Failed to read/write recently viewed from localStorage", e);
    }
  }, [currentSlug]);

  // Return format: slugs array (backward compat) or objects with timestamps
  if (withTimestamps) {
    return recentItems;
  }
  return recentItems.map((item) => (typeof item === "string" ? item : item.slug));
}

/**
 * formatTimeAgo — human-readable "2 days ago" from a timestamp.
 */
export function formatTimeAgo(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "last week";
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}
