// src/hooks/useEnquiryBasket.js
// The enquiry basket is the ONLY conversion mechanism on the site (no cart, no checkout).
// Each entry is a full record so the WhatsApp message can be assembled without re-resolving.
// Extends the old site's pattern faithfully — rebuilt fresh, not patched.

import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import { createWhatsAppLink } from "../data/catalogue.js";

export function useEnquiryBasket() {
  const [items, setItems] = useLocalStorage("fakhri:enquiry-basket", []);

  const has = useCallback((slug) => items.some((i) => i.slug === slug), [items]);
  const add = useCallback(
    (entry) => {
      setItems((cur) => (cur.some((i) => i.slug === entry.slug) ? cur : [...cur, entry]));
    },
    [setItems]
  );
  const addMany = useCallback(
    (entries) => {
      setItems((cur) => {
        const existing = new Set(cur.map((i) => i.slug));
        return [...cur, ...entries.filter((e) => !existing.has(e.slug))];
      });
    },
    [setItems]
  );
  const remove = useCallback(
    (slug) => setItems((cur) => cur.filter((i) => i.slug !== slug)),
    [setItems]
  );
  const clear = useCallback(() => setItems([]), [setItems]);

  const buildMessage = useCallback(() => {
    if (!items.length) return "";
    const lines = items.map((i, idx) => {
      const parts = [`${idx + 1}. ${i.name}`];
      if (i.colorName) parts.push(`   Shade: ${i.colorName}`);
      if (i.quantity) parts.push(`   Qty: ${i.quantity}`);
      return parts.join("\n");
    });
    return `Hello Fakhri Mart, I'd like to enquire about:\n\n${lines.join("\n")}\n\nPlease share availability and pricing. Thank you!`;
  }, [items]);

  const whatsappLink = useCallback(() => createWhatsAppLink(buildMessage()), [buildMessage]);

  return { items, has, add, addMany, remove, clear, buildMessage, whatsappLink, count: items.length };
}
