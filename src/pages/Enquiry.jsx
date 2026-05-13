import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { createWhatsAppLink, productCategories } from "../data/siteData.js";

const businessTypes = ["Tailor", "Boutique", "Manufacturer", "Wholesaler", "Retail Customer", "Other"];

export default function Enquiry() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(false);
    setSubmitting(true);
    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  }

  return (
    <>
      <PageHero
        eyebrow="Enquiry"
        title="Send a thread requirement or catalogue request"
        text="Share basic requirement details for thread type, quantity, shade options, and business use. Faster responses can be handled through WhatsApp."
      >
        <ProductVisual palette={["#14213d", "#2a9d8f", "#e9c46a"]} />
      </PageHero>

      <section className="section">
        <div className="container enquiry-layout">
          <Reveal className="enquiry-card" variant="slide-left">
            <form className="enquiry-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <label>
                  Name
                  <input type="text" name="name" placeholder="Your name" required />
                </label>
                <label>
                  Phone Number
                  <input type="tel" name="phone" placeholder="+91 XXXXX XXXXX" required />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Business Type
                  <select name="businessType" defaultValue="" required>
                    <option value="" disabled>
                      Select business type
                    </option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Product Interested In
                  <select name="product" defaultValue="" required>
                    <option value="" disabled>
                      Select product
                    </option>
                    {productCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Quantity Required
                <input type="text" name="quantity" placeholder="Example: 50 cones, 10 bundles, retail pack" />
              </label>

              <label>
                Message
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Mention shade, usage, delivery location, or any specific thread requirement."
                />
              </label>

              <button className="btn btn-primary submit-button" type="submit" disabled={submitting}>
                {submitting ? <span className="button-spinner" aria-hidden="true" /> : <Send size={18} />}
                {submitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </Reveal>

          <Reveal className="enquiry-aside" delay={120} variant="slide-right">
            <p className="eyebrow">Fast Response</p>
            <h2>Share your requirement directly on WhatsApp.</h2>
            <p>
              For bulk or urgent thread requirements, WhatsApp is the quickest way to request shade
              cards, catalogue details, and availability.
            </p>
            <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} />
              WhatsApp Now
            </a>
          </Reveal>
        </div>

        {submitted ? (
          <div className="container">
            <div className="success-message" role="status">
              <strong>Thank you!</strong> Your enquiry has been noted. Please connect on WhatsApp
              for faster response.
              <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                Continue on WhatsApp
              </a>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
