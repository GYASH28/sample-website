import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_wishlist";

export function getWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load wishlist from localStorage", e);
    return [];
  }
}

export function saveWishlist(wishlist) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(new Event("wishlist-updated"));
  } catch (e) {
    console.error("Failed to save wishlist to localStorage", e);
  }
}

export function toggleWishlist(slug) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(slug);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(slug);
  }
  saveWishlist(wishlist);
}

export function addToWishlist(slug) {
  const wishlist = getWishlist();
  if (!wishlist.includes(slug)) {
    wishlist.push(slug);
    saveWishlist(wishlist);
  }
}

export function removeFromWishlist(slug) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(slug);
  if (index > -1) {
    wishlist.splice(index, 1);
    saveWishlist(wishlist);
  }
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(() => getWishlist());

  useEffect(() => {
    const handleUpdate = () => {
      setWishlist(getWishlist());
    };
    window.addEventListener("wishlist-updated", handleUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleUpdate);
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
