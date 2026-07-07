import { smartWhatsAppLink } from "../i18n.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function FloatingWhatsApp() {
  const link = smartWhatsAppLink({ type: "floating" });
  return (
    <a className="floating-whatsapp" href={link} target="_blank" rel="noreferrer" aria-label="Chat for catalogue on WhatsApp">
      <WhatsAppIcon size={25} />
      <span>Chat for Catalogue</span>
    </a>
  );
}
