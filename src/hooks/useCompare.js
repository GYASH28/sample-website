import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_compare";
const MAX_COMPARE_ITEMS = 4;

export function getCompareList() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load compare list from localStorage", e);
    return [];
  }
}

export function saveCompareList(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event("compare-updated"));
  } catch (e) {
    console.error("Failed to save compare list to localStorage", e);
  }
}

export function toggleCompare(slug) {
  const list = getCompareList();
  const index = list.indexOf(slug);
  if (index > -1) {
    list.splice(index, 1);
  } else {
    if (list.length >= MAX_COMPARE_ITEMS) {
      alert(`You can compare up to ${MAX_COMPARE_ITEMS} products at once.`);
      return false;
    }
    list.push(slug);
  }
  saveCompareList(list);
  return true;
}

export function addToCompare(slug) {
  const list = getCompareList();
  if (list.includes(slug)) return true;
  if (list.length >= MAX_COMPARE_ITEMS) {
    alert(`You can compare up to ${MAX_COMPARE_ITEMS} products at once.`);
    return false;
  }
  list.push(slug);
  saveCompareList(list);
  return true;
}

export function removeFromCompare(slug) {
  const list = getCompareList();
  const index = list.indexOf(slug);
  if (index > -1) {
    list.splice(index, 1);
    saveCompareList(list);
  }
}

export function clearCompareList() {
  saveCompareList([]);
}

export function useCompare() {
  const [compareList, setCompareList] = useState(() => getCompareList());

  useEffect(() => {
    const handleUpdate = () => {
      setCompareList(getCompareList());
    };
    window.addEventListener("compare-updated", handleUpdate);
    return () => {
      window.removeEventListener("compare-updated", handleUpdate);
    };
  }, []);

  return {
    compareList,
    toggle: toggleCompare,
    add: addToCompare,
    remove: removeFromCompare,
    clear: clearCompareList,
    has: (slug) => compareList.includes(slug),
    count: compareList.length,
    maxItems: MAX_COMPARE_ITEMS,
  };
}
