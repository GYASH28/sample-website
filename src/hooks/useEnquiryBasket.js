import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_enquiry_basket";
const UPDATE_EVENT = "enquiry-basket-updated";
const MAX_BASKET_ITEMS = 100;
const MAX_ITEM_QUANTITY = 10_000;

function normalizeQuantity(value, fallback = 1) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(MAX_ITEM_QUANTITY, Math.max(1, Math.round(numeric)));
}

function normalizeBasket(value) {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object" && typeof item.slug === "string")
    .slice(0, MAX_BASKET_ITEMS)
    .map((item) => ({
      ...item,
      name: typeof item.name === "string" ? item.name : item.slug,
      category: typeof item.category === "string" ? item.category : "Catalogue",
      image: typeof item.image === "string" ? item.image : "",
      shade: item.shade && typeof item.shade === "object" ? item.shade : null,
      quantity: normalizeQuantity(item.quantity),
      unit: typeof item.unit === "string" && item.unit.trim() ? item.unit : "pcs",
      variant: item.variant ?? null,
      note: typeof item.note === "string" ? item.note : "",
    }));
}

export function getEnquiryBasket() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? normalizeBasket(JSON.parse(stored)) : [];
  } catch {
    return [];
  }
}

export function saveEnquiryBasket(basket) {
  const normalized = normalizeBasket(basket);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new Event(UPDATE_EVENT));
  } catch {
    // Storage can be unavailable in private/restricted browser contexts.
  }
  return normalized;
}

export function addToEnquiryBasket(item) {
  if (!item || typeof item.slug !== "string") return;

  const incoming = normalizeBasket([item])[0];
  if (!incoming) return;

  const basket = getEnquiryBasket();
  const existingIndex = basket.findIndex(
    (entry) =>
      entry.slug === incoming.slug &&
      entry.shade?.name === incoming.shade?.name &&
      entry.variant === incoming.variant,
  );

  if (existingIndex > -1) {
    basket[existingIndex] = {
      ...basket[existingIndex],
      quantity: normalizeQuantity(
        basket[existingIndex].quantity + incoming.quantity,
        basket[existingIndex].quantity,
      ),
    };
  } else if (basket.length < MAX_BASKET_ITEMS) {
    basket.push(incoming);
  }

  saveEnquiryBasket(basket);
}

export function removeFromEnquiryBasket(index) {
  const basket = getEnquiryBasket();
  if (!Number.isInteger(index) || index < 0 || index >= basket.length) return;
  basket.splice(index, 1);
  saveEnquiryBasket(basket);
}

export function updateBasketItemQuantity(index, quantity) {
  const basket = getEnquiryBasket();
  if (!basket[index]) return;
  basket[index].quantity = normalizeQuantity(quantity, basket[index].quantity);
  saveEnquiryBasket(basket);
}

export function updateBasketItem(index, updates) {
  const basket = getEnquiryBasket();
  if (!basket[index] || !updates || typeof updates !== "object") return;
  basket[index] = normalizeBasket([{ ...basket[index], ...updates }])[0] || basket[index];
  saveEnquiryBasket(basket);
}

export function clearEnquiryBasket() {
  saveEnquiryBasket([]);
}

export function useEnquiryBasket() {
  const [basket, setBasket] = useState(() => getEnquiryBasket());

  useEffect(() => {
    const handleUpdate = () => setBasket(getEnquiryBasket());
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
    basket,
    add: addToEnquiryBasket,
    remove: removeFromEnquiryBasket,
    updateQuantity: updateBasketItemQuantity,
    updateItem: updateBasketItem,
    clear: clearEnquiryBasket,
    count: basket.reduce((total, item) => total + normalizeQuantity(item.quantity), 0),
    itemsCount: basket.length,
  };
}
