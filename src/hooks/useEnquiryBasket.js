import { useEffect, useState } from "react";

const STORAGE_KEY = "fakhri_enquiry_basket";

export function getEnquiryBasket() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load enquiry basket from localStorage", e);
    return [];
  }
}

export function saveEnquiryBasket(basket) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(basket));
    window.dispatchEvent(new Event("enquiry-basket-updated"));
  } catch (e) {
    console.error("Failed to save enquiry basket to localStorage", e);
  }
}

export function addToEnquiryBasket(item) {
  const basket = getEnquiryBasket();
  // Find if same product, same shade, and same variant already exists
  const existingIndex = basket.findIndex(
    (i) => i.slug === item.slug && 
           i.shade?.name === item.shade?.name && 
           i.variant === item.variant
  );

  if (existingIndex > -1) {
    // Add quantity
    basket[existingIndex].quantity += item.quantity;
  } else {
    basket.push(item);
  }
  saveEnquiryBasket(basket);
}

export function removeFromEnquiryBasket(index) {
  const basket = getEnquiryBasket();
  basket.splice(index, 1);
  saveEnquiryBasket(basket);
}

export function updateBasketItemQuantity(index, quantity) {
  const basket = getEnquiryBasket();
  if (basket[index]) {
    basket[index].quantity = quantity;
    saveEnquiryBasket(basket);
  }
}

export function clearEnquiryBasket() {
  saveEnquiryBasket([]);
}

export function useEnquiryBasket() {
  const [basket, setBasket] = useState(() => getEnquiryBasket());

  useEffect(() => {
    const handleUpdate = () => {
      setBasket(getEnquiryBasket());
    };
    window.addEventListener("enquiry-basket-updated", handleUpdate);
    return () => {
      window.removeEventListener("enquiry-basket-updated", handleUpdate);
    };
  }, []);

  return {
    basket,
    add: addToEnquiryBasket,
    remove: removeFromEnquiryBasket,
    updateQuantity: updateBasketItemQuantity,
    clear: clearEnquiryBasket,
    count: basket.reduce((acc, item) => acc + item.quantity, 0),
    itemsCount: basket.length,
  };
}
