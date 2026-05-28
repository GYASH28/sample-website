import { FileText, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { catalogueMessage, createWhatsAppLink } from "../data/siteData.js";
import Reveal from "./Reveal.jsx";

export default function CatalogueCta() {
  return (
    <Reveal as="section" className="catalogue-cta">
      <div className="cta-pattern" aria-hidden="true" />
      <div className="cta-content">
        <p className="eyebrow">Catalogue & Shade Support</p>
        <h2>Request Product Catalogue & Shade Details</h2>
        <p>
          Get product availability, colour options, sizes, packaging details and bulk order support
          directly on WhatsApp.
        </p>
        <div className="button-row">
          <Link className="btn btn-primary" to="/enquiry">
            <FileText size={18} />
            Request Catalogue
          </Link>
          <a className="btn btn-whatsapp" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            WhatsApp Now
          </a>
        </div>
      </div>
    </Reveal>
  );
}
