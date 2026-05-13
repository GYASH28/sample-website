import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "../data/siteData.js";

export default function FloatingWhatsApp() {
  return (
    <a className="floating-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
      <MessageCircle size={25} />
      <span>Chat on WhatsApp</span>
    </a>
  );
}
