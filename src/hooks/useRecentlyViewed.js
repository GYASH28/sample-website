import { useEffect, useState } from "react";

export function useRecentlyViewed(currentSlug) {
  const [recentSlugs, setRecentSlugs] = useState([]);

  useEffect(() => {
    // Load from localStorage
    try {
      const stored = localStorage.getItem("fakhri_recently_viewed");
      let slugs = stored ? JSON.parse(stored) : [];

      if (currentSlug) {
        // Remove if exists
        slugs = slugs.filter((slug) => slug !== currentSlug);
        // Add to front
        slugs.unshift(currentSlug);
        // Keep only max 4
        if (slugs.length > 4) {
          slugs = slugs.slice(0, 4);
        }
        localStorage.setItem("fakhri_recently_viewed", JSON.stringify(slugs));
      }

      // We don't want to show the currently viewed product in the "Recently Viewed" list on its own page
      setRecentSlugs(slugs.filter(slug => slug !== currentSlug));
    } catch (e) {
      console.warn("Failed to read/write recently viewed from localStorage", e);
    }
  }, [currentSlug]);

  return recentSlugs;
}
