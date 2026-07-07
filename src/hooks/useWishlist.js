// src/hooks/useWishlist.js
import { useCollection } from "./useLocalStorage.js";
export function useWishlist() {
  return useCollection("fakhri:wishlist");
}
