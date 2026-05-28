import { MessageCircle } from "lucide-react";
import EnquiryForm from "../components/EnquiryForm.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { catalogueMessage, createWhatsAppLink } from "../data/siteData.js";

export default function Enquiry() {
  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Request catalogue, shade card or bulk pricing"
        text="Share your requirement for yarns, crochet threads, macrame cords, embroidery threads, beads, bases, handles or purse accessories."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#c99b6b"]} />
      </PageHero>

      <section className="section">
        <div className="container enquiry-layout">
          <Reveal variant="slide-left">
            <p className="eyebrow">Fast Response</p>
            <h2>Send the details once, then continue on WhatsApp.</h2>
            <p>
              Mention product name, quantity, colour or shade, size, packaging needs and delivery
              city. The team can then guide you with catalogue, availability and bulk order support.
            </p>
            <a className="btn btn-whatsapp" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              WhatsApp Now
            </a>
          </Reveal>
          <Reveal delay={120} variant="slide-right">
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
