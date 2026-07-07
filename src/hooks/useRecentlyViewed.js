// src/hooks/useRecentlyViewed.js
// Tracks last 8 product slugs the user has visited, oldest-first.

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";

export function useRecentlyViewed(max = 8) {
  const [items, setItems] = useLocalStorage("fakhri:recently-viewed", []);

  const push = useCallback(
    (slug) => {
      if (!slug) return;
      setItems((cur) => {
        const filtered = cur.filter((s) => s !== slug);
        return [...filtered, slug].slice(-max);
      });
    },
    [setItems, max]
  );

  const others = useCallback(
    (excludeSlug) => items.filter((s) => s !== excludeSlug),
    [items]
  );

  return { items, push, others };
}
