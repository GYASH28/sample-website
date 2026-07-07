/**
 * Fakhri Mart — i18n + Hinglish Phrases
 * ═══════════════════════════════════════════════════════════════
 * Phase 1 BUG 4 fix: the dead language system (strings, t, LangProvider,
 * useLang, useLangControls) has been removed — HindiToggle did nothing.
 *
 * What remains:
 *   - phrases: Hinglish phrase bank (will be trimmed in Phase 2)
 *   - smartWhatsAppLink: context-aware WhatsApp deep-link builder
 *   - getStockStatus: stock status helper
 */

// ─── Hinglish Catchy Phrases ───────────────────────────────────────────────
// Warm, local, engaging — sprinkled throughout the site to make it feel
// like a real Indian craft store, not a corporate catalogue.
export const phrases = {
  // Hero / brand
  boutiquePride: "Har shade mein creativity, har thread mein story.",
  boutiqueSubtext: "Pune ki yarn store — ab poore India ke liye.",
  heroCallout: "Aapki next handmade creation ka start yahin se hota hai.",

  // Trust / social proof
  trustLine: "Trusted by boutiques, resellers aur craft lovers across India.",
  trustBadge1: "Har order ke saath — care, quality aur quick response.",
  trustBadge2: "Wholesale? Retail? Dono ke liye best rates, har baar.",

  // Product discovery
  discoveryHook: "Apne project ke liye perfect yarn dhundo — 12+ categories mein.",
  bestSellerHook: "Resellers ki pasand — ye products sabse zyada enquire hote hain.",
  newArrivalsHook: "Naya stock aaya hai — pehle dekho, pehle pucho.",
  bulkHook: "Bulk mein chahiye? Ek WhatsApp message aur best quote aapke paas.",
  galleryHook: "Ek Nazariya dekho — organized, clear aur inspiring.",

  // Enquiry / conversion
  enquiryHook: "Bina login, bina payment — bas WhatsApp pe message karo.",
  enquiryReassure: "Hum 4 ghante ke andar reply karte hain — promise.",
  shadeCardHook: "Shade confirm karne ke liye digital shade card maango — free.",
  quickEnquireHook: "Detail padhne ki zaroorat nahi — seedha WhatsApp pe poocho.",
  basketHook: "Ek saath multiple products enquire karo — basket mein add karo, ek hi message mein bhejo.",

  // About / brand story
  aboutHook: "Fakhri Mart — 2019 se yarn aur craft materials ki trusted store.",
  aboutStory: "Shuruwat ek choti dukaan se hui thi. Aaj poore India mein delivery karte hain.",
  aboutPromise: "Har customer ko wahi milta hai jo hum khud use karte hain — best quality.",

  // Contact / support
  contactHook: "Catalogue, shade card, bulk pricing — sab kuch ek message mein.",
  responsePromise: "Mon-Sat, 10am-8pm — turant response.",
  whatsappPreferred: "WhatsApp pe baat karna sabse easy hai — hum bhi yahi prefer karte hain.",

  // 404
  notFoundHook: "Ye thread ulajh gayi — wapas workshop mein aao.",
  notFoundReassure: "Page nahi mila, par yarn zaroor milega.",

  // Mobile / app feel
  scrollHint: "Scroll karo aur explore karo",
  tapToCall: "Tap karke call karein",
  tapToWhatsApp: "Tap karke WhatsApp karein",

  // Footer
  footerTagline: "Colourful threads, endless creation — har maker ke liye.",
  footerMadeIn: "Pune se, poore India ke liye — banaya gaya pyaar se.",

  // Empty states
  emptyWishlist: "Abhi tak koi favourite nahi — heart icon dabao aur save karo.",
  emptyBasket: "Basket khaali hai — products add karo aur ek saath enquire karo.",
  emptySearch: "Kuch nahi mila — spelling check karo ya popular searches try karo.",

  // Categories
  catBliss: "Soft cotton threads — har crochet project ke liye perfect.",
  catVardhaman: "Trusted Vardhaman yarns — boutiques aur resellers ki pasand.",
  catMacrame: "Macrame cords — wall decor se leke plant hangers tak.",
  catEmbroidery: "Embroidery threads — fine needlework ke liye best.",
  catBeads: "Beads collection — purse aur jewelry banane ke liye.",
  catHandles: "Purse handles — premium finishing ke liye zaroori.",

  // Testimonial intro
  testimonialIntro: "Hamare customers ke dil ki baat —",
};

// ─── Stock Status Helper ───────────────────────────────────────────────────
// Derives a stock status from product properties — no need to edit every
// product in siteData.js. Stable per-slug (hash-based).
export function getStockStatus(product) {
  if (product.stockStatus) return product.stockStatus; // explicit override
  // Derive stable pseudo-status from slug hash
  const hash = product.slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const mod = hash % 10;
  if (mod < 6) return "in-stock";      // 60% in stock
  if (mod < 9) return "limited";       // 30% limited
  return "on-request";                  // 10% on request
}

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
