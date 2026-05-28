import { MessageCircle, Send } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  businessTypes,
  createWhatsAppLink,
  productInterestOptions,
} from "../data/siteData.js";

export default function EnquiryForm({ compact = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitTimer = useRef(null);

  const whatsappLink = useMemo(
    () =>
      createWhatsAppLink(
        "Hello Fakhri Mart, I submitted an enquiry on the website. Please help me with catalogue, availability and bulk pricing details.",
      ),
    [],
  );

  useEffect(() => {
    return () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    };
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitted(false);
    setSubmitting(true);
    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      form.reset();
    }, 650);
  }

  return (
    <div className={`enquiry-card ${compact ? "enquiry-card--compact" : ""}`}>
      <form className="enquiry-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Name
            <input type="text" name="name" autoComplete="name" required />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="tel"
              required
            />
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
              {productInterestOptions.map((product) => (
                <option key={product} value={product}>
                  {product}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-grid">
          <label>
            Quantity Required
            <input type="text" name="quantity" />
          </label>
          <label>
            Delivery City
            <input type="text" name="city" autoComplete="address-level2" />
          </label>
        </div>

        <label>
          Colour/Shade Requirement
          <input type="text" name="shade" />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows={compact ? 4 : 5}
          />
        </label>

        <button className="btn btn-primary submit-button" type="submit" disabled={submitting}>
          {submitting ? <span className="button-spinner" aria-hidden="true" /> : <Send size={18} />}
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>

      {submitted ? (
        <div className="success-message" role="status" aria-live="polite">
          <span>
            <strong>Thank you!</strong> Your enquiry has been noted. For faster response, please
            connect on WhatsApp.
          </span>
          <a className="btn btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            Continue on WhatsApp
          </a>
        </div>
      ) : null}
    </div>
  );
}
