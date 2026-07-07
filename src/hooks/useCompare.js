// src/hooks/useCompare.js
// Compare is capped at 4 — keeps the comparison tray sane.
import { useCollection } from "./useLocalStorage.js";
export function useCompare() {
  return useCollection("fakhri:compare", 4);
}
