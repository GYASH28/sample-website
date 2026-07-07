// src/components/FloatingWhatsApp.jsx
// Fixed-position WhatsApp button — the primary conversion path. Always visible.
// Single element, no backdrop blur, no animation loop. Honors reduced motion.

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { businessInfo, createWhatsAppLink, DEFAULT_ENQUIRY_MESSAGE } from "../data/catalogue.js";
import { usePrefersReducedMotion } from "../lib/motion.js";

export function FloatingWhatsApp() {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);

  // Appear after a small scroll — one-shot transition, not a loop
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={createWhatsAppLink(DEFAULT_ENQUIRY_MESSAGE)}
      target="_blank"
      rel="noreferrer noopener"
      className={`floating-whatsapp ${visible ? "visible" : ""}`}
      aria-label="Enquire on WhatsApp"
      style={{
        transition: reduced ? "none" : "opacity 0.3s, transform 0.3s",
      }}
    >
      <MessageCircle size={22} />
    </a>
  );
}
