import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  businessTypes,
  createWhatsAppLink,
  productInterestOptions,
} from "../data/siteData.js";

export default function EnquiryForm({ compact = false }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(() => createWhatsAppLink());
  const submitTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    };
  }, []);

  function buildMessage(formData) {
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const businessType = formData.get("businessType") || "";
    const product = formData.get("product") || "";
    const quantity = formData.get("quantity") || "";
    const city = formData.get("city") || "";
    const shade = formData.get("shade") || "";
    const message = formData.get("message") || "";

    let text = `Hello Fakhri Mart, I submitted an enquiry on the website.\n\n`;
    text += `*Name:* ${name}\n`;
    text += `*Phone:* ${phone}\n`;
    if (businessType) text += `*Business Type:* ${businessType}\n`;
    if (product) text += `*Product Interested In:* ${product}\n`;
    if (quantity) text += `*Quantity Required:* ${quantity}\n`;
    if (city) text += `*Delivery City:* ${city}\n`;
    if (shade) text += `*Colour/Shade:* ${shade}\n`;
    if (message) text += `*Message:* ${message}\n`;
    text += `\nPlease share catalogue, availability and bulk pricing details. Thank you!`;

    return text;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = buildMessage(formData);
    const link = createWhatsAppLink(message);

    setSubmitted(false);
    setSubmitting(true);
    setWhatsappLink(link);

    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      form.reset();

      // Auto-open WhatsApp with the enquiry details
      window.open(link, "_blank");
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
            <strong>Your enquiry details are ready</strong> — continue on WhatsApp to send them to
            Fakhri Mart. If the window didn't open automatically, click the button below.
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
