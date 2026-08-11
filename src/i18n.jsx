/**
 * Fakhri Mart — context-aware WhatsApp helpers.
 */
import { businessInfo } from "./data/siteData.js";

export function smartWhatsAppLink(context) {
  let message = "";

  switch (context.type) {
    case "product-card":
      message = `Hi Fakhri Mart! Mujhe is product ke baare mein jaankari chahiye:\n\n*${context.productName}*\nCategory: ${context.category || "N/A"}${context.shade ? `\nSelected shade: *${context.shade}*` : ""}\n\nPlease share:\n- Current price (retail + bulk)\n- Current availability\n- Shade/photo confirmation\n- Delivery time to my city\n\nDhanyavaad!`;
      break;

    case "shade-card":
      message = `Hi Fakhri Mart! Mujhe is product ka *digital shade card* chahiye:\n\n*${context.productName}*${context.shade ? ` (Shade: ${context.shade})` : ""}\n\nColor confirm karne ke liye current photos bhej do please. Dhanyavaad!`;
      break;

    case "bulk":
      message = `Hi Fakhri Mart! Mujhe *bulk pricing* chahiye:\n\nProduct: ${context.productName || "Multiple products"}\nQuantity: ${context.quantity || "To be decided"}\nDelivery city: ${context.city || "To be confirmed"}\n\nCurrent availability ke saath best quote bhej do please. Dhanyavaad!`;
      break;

    case "basket":
      message = `Hi Fakhri Mart! Mera enquiry basket yeh hai:\n\n`;
      context.items.forEach((item, i) => {
        message += `${i + 1}. *${item.name}*\n`;
        message += `   Shade: ${item.shade?.name || "Any / please confirm"}\n`;
        message += `   Qty: ${item.quantity} ${item.unit}\n`;
        if (item.note) message += `   Note: ${item.note}\n`;
        message += `\n`;
      });
      message += `Please share current availability, total quote and delivery time. Dhanyavaad!`;
      break;

    case "wishlist":
      message = `Hi Fakhri Mart! Mujhe in products ke baare mein enquiry hai:\n\n`;
      context.items.forEach((item, i) => {
        message += `${i + 1}. *${item.name}* (${item.category})\n`;
      });
      message += `\nCurrent price, availability aur shade details bhej do please. Dhanyavaad!`;
      break;

    case "floating":
      message = `Hi Fakhri Mart! Main aapka catalogue dekh raha/rahi hoon aur ek question hai:\n\n`;
      break;

    case "general":
    default:
      message = businessInfo.whatsappMessage;
      break;
  }

  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
