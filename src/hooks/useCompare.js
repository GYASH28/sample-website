import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_compare_v1";
const EVENT_NAME = "fakhri:compare-change";
const MAX_COMPARE = 3;

function normalize(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter((slug) => typeof slug === "string" && slug))].slice(0, MAX_COMPARE);
}

function readCompare() {
  if (typeof window === "undefined") return [];
  try {
    return normalize(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"));
  } catch {
    return [];
  }
}

function writeCompare(next) {
  const normalized = normalize(next);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    // Comparison still works for the current render if persistence is unavailable.
  }
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: normalized }));
  return normalized;
}

export function useCompare() {
  const [compare, setCompare] = useState(readCompare);

  useEffect(() => {
    const sync = (event) => {
      if (event.type === "storage" && event.key !== STORAGE_KEY) return;
      setCompare(event.detail ? normalize(event.detail) : readCompare());
    };
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const add = useCallback((slug) => {
    const current = readCompare();
    if (current.includes(slug)) return { compare: current, added: false, reason: "exists" };
    if (current.length >= MAX_COMPARE) return { compare: current, added: false, reason: "full" };
    const next = writeCompare([...current, slug]);
    setCompare(next);
    return { compare: next, added: true, reason: null };
  }, []);

  const remove = useCallback((slug) => {
    const next = writeCompare(readCompare().filter((item) => item !== slug));
    setCompare(next);
    return next;
  }, []);

  const toggle = useCallback((slug) => {
    const current = readCompare();
    if (current.includes(slug)) {
      const next = writeCompare(current.filter((item) => item !== slug));
      setCompare(next);
      return { compare: next, added: false, reason: "removed" };
    }
    if (current.length >= MAX_COMPARE) return { compare: current, added: false, reason: "full" };
    const next = writeCompare([...current, slug]);
    setCompare(next);
    return { compare: next, added: true, reason: null };
  }, []);

  const clear = useCallback(() => {
    const next = writeCompare([]);
    setCompare(next);
  }, []);

  return {
    compare,
    count: compare.length,
    max: MAX_COMPARE,
    has: (slug) => compare.includes(slug),
    add,
    remove,
    toggle,
    clear,
  };
}
