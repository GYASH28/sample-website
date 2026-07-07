/**
 * Fakhri Mart — i18n + WhatsApp helpers
 * ═══════════════════════════════════════════════════════════════
 * Phase 2 item 14: the dead phrases object has been removed. Only 3 of 30
 * entries were used (boutiquePride, heroCallout, emptyWishlist) — those
 * usages have been inlined directly into the JSX (Home.jsx, Wishlist.jsx).
 * Phase 4 will rewrite those inlined values to the bilingual-split tone.
 *
 * What remains:
 *   - smartWhatsAppLink: context-aware WhatsApp deep-link builder
 */

// ─── Smart WhatsApp Link Helper ────────────────────────────────────────────
// Builds context-aware pre-filled WhatsApp messages.
import { businessInfo } from "./data/siteData.js";

export function smartWhatsAppLink(context) {
  let message = "";

  switch (context.type) {
    case "product-card":
      message = `Hi Fakhri Mart! Mujhe is product ke baare mein jaankari chahiye:\n\n*${context.productName}*\nCategory: ${context.category || "N/A"}\n\nPlease share:\n- Price (retail + bulk)\n- Availability\n- Shade options\n- Delivery time\n\nDhanyavaad!`;
      break;

    case "shade-card":
      message = `Hi Fakhri Mart! Mujhe is product ka *digital shade card* chahiye:\n\n*${context.productName}*${context.shade ? ` (Shade: ${context.shade})` : ""}\n\nColor confirm karne ke liye photos bhej do please. Dhanyavaad!`;
      break;

    case "bulk":
      message = `Hi Fakhri Mart! Mujhe *bulk pricing* chahiye:\n\nProduct: ${context.productName || "Multiple products"}\nQuantity: ${context.quantity || "To be decided"}\nDelivery city: ${context.city || "To be confirmed"}\n\nBest quote bhej do please. Dhanyavaad!`;
      break;

    case "basket":
      message = `Hi Fakhri Mart! Mera enquiry basket yeh hai:\n\n`;
      context.items.forEach((item, i) => {
        message += `${i + 1}. *${item.name}*\n`;
        message += `   Shade: ${item.shade?.name || "Any"}\n`;
        message += `   Qty: ${item.quantity} ${item.unit}\n\n`;
      });
      message += `Please share total quote + delivery time. Dhanyavaad!`;
      break;

    case "wishlist":
      message = `Hi Fakhri Mart! Mujhe in products ke baare mein enquiry hai:\n\n`;
      context.items.forEach((item, i) => {
        message += `${i + 1}. *${item.name}* (${item.category})\n`;
      });
      message += `\nPrice, availability aur shade details bhej do please. Dhanyavaad!`;
      break;

    case "floating":
      message = `Hi Fakhri Mart! Main aapka catalogue dekh raha/rahi hoon aur ek question hai:\n\n`;
      break;

    case "general":
    default:
      message = businessInfo.whatsappMessage;
      break;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encoded}`;
}
