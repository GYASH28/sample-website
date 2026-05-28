import { createWhatsAppLink } from "../data/siteData.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function FloatingWhatsApp() {
  return (
    <a className="floating-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer" aria-label="Chat for catalogue on WhatsApp">
      <WhatsAppIcon size={25} />
      <span>Chat for Catalogue</span>
    </a>
  );
}
