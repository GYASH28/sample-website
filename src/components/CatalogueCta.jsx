import { FileText, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../data/siteData.js";
import Reveal from "./Reveal.jsx";

export default function CatalogueCta() {
  const shadeMessage = "Hello, please share your latest thread catalogue, shade card, and bulk order details.";

  return (
    <Reveal as="section" className="catalogue-cta">
      <div className="cta-pattern" aria-hidden="true" />
      <div className="cta-content">
        <p className="eyebrow">Catalogue Support</p>
        <h2>Need a Catalogue or Shade Card?</h2>
        <p>
          Contact us to receive our latest product catalogue, thread shade options, and bulk order
          details.
        </p>
        <div className="button-row">
          <Link className="btn btn-dark" to="/enquiry">
            <FileText size={18} />
            Request Catalogue
          </Link>
          <a className="btn btn-whatsapp" href={createWhatsAppLink(shadeMessage)} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            WhatsApp for Shade Card
          </a>
        </div>
      </div>
    </Reveal>
  );
}
