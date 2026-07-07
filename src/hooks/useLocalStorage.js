// src/hooks/useLocalStorage.js
// Generic localStorage-backed state hook. Single source for all persistent UI state.
// Cross-component sync within the same tab via custom event (the native `storage` event
// only fires for OTHER tabs, not the same one — so we dispatch our own).

import { useCallback, useEffect, useState } from "react";

const EVENT_PREFIX = "fakhri:storage:";

export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Write to localStorage + dispatch a custom event so other hook instances in the same tab sync.
  const setAndNotify = useCallback(
    (updater) => {
      setValue((cur) => {
        const next = typeof updater === "function" ? updater(cur) : updater;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* storage full or disabled — non-fatal */
        }
        // Dispatch custom event for same-tab listeners
        window.dispatchEvent(new CustomEvent(EVENT_PREFIX + key, { detail: next }));
        return next;
      });
    },
    [key]
  );

  // Listen for same-tab custom events AND cross-tab storage events.
  useEffect(() => {
    const customEventType = EVENT_PREFIX + key;
    const onCustom = (e) => setValue(e.detail);
    const onStorage = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          /* ignore malformed */
        }
      }
    };
    window.addEventListener(customEventType, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(customEventType, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [key]);

  return [value, setAndNotify];
}

// Collection helper — powers wishlist, compare, enquiry basket.
export function useCollection(key, max = Infinity) {
  const [items, setItems] = useLocalStorage(key, []);

  const has = useCallback((id) => items.includes(id), [items]);
  const add = useCallback(
    (id) => setItems((cur) => (cur.includes(id) ? cur : [...cur, id].slice(-max))),
    [setItems, max]
  );
  const remove = useCallback(
    (id) => setItems((cur) => cur.filter((x) => x !== id)),
    [setItems]
  );
  const toggle = useCallback(
    (id) => setItems((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id].slice(-max))),
    [setItems, max]
  );
  const clear = useCallback(() => setItems([]), [setItems]);

  return { items, has, add, remove, toggle, clear, count: items.length };
}
