import { MessageCircle, Send, Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  businessTypes,
  createWhatsAppLink,
  productInterestOptions,
} from "../data/siteData.js";

export default function EnquiryForm({ compact = false, basket = [], onClearBasket }) {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState(() => createWhatsAppLink());
  const [compiledMessage, setCompiledMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const submitTimer = useRef(null);

  const hasBasket = basket && basket.length > 0;

  useEffect(() => {
    return () => {
      if (submitTimer.current) window.clearTimeout(submitTimer.current);
    };
  }, []);

  function buildMessage(formData) {
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const businessType = formData.get("businessType") || "";
    const city = formData.get("city") || "";
    const message = formData.get("message") || "";

    let text = `Hello Fakhri Mart, I submitted an enquiry on the website.\n\n`;
    text += `*Name:* ${name}\n`;
    text += `*Phone:* ${phone}\n`;
    if (businessType) text += `*Business Type:* ${businessType}\n`;
    if (city) text += `*Delivery City:* ${city}\n`;

    if (hasBasket) {
      text += `\n*Enquiry Items in Basket:*\n`;
      basket.forEach((item, index) => {
        const shadeText = item.shade ? ` - Shade: ${item.shade.name}` : "";
        const variantText = item.variant ? ` (${item.variant})` : "";
        text += `${index + 1}. *${item.name}*${variantText}${shadeText}\n`;
        text += `   Quantity: ${item.quantity} ${item.unit}\n`;
      });
    } else {
      const product = formData.get("product") || "";
      const quantity = formData.get("quantity") || "";
      const shade = formData.get("shade") || "";
      if (product) text += `*Product Interested In:* ${product}\n`;
      if (quantity) text += `*Quantity Required:* ${quantity}\n`;
      if (shade) text += `*Colour/Shade:* ${shade}\n`;
    }

    if (message) text += `\n*Message:* ${message}\n`;
    text += `\nPlease share availability, catalogue, and bulk pricing. Thank you!`;

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
    setCompiledMessage(message);

    submitTimer.current = window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      
      // Auto-open WhatsApp with the enquiry details
      window.open(link, "_blank");

      // Clear the basket if callback is present
      if (hasBasket && onClearBasket) {
        onClearBasket();
      }
      form.reset();
    }, 650);
  }

  const handleCopySummary = () => {
    if (compiledMessage) {
      navigator.clipboard.writeText(compiledMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`enquiry-card ${compact ? "enquiry-card--compact" : ""} ${hasBasket ? "enquiry-card--has-basket" : ""}`}>
      <form ref={formRef} className="enquiry-form" onSubmit={handleSubmit}>
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

          {!hasBasket ? (
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
          ) : (
            <label>
              Delivery City
              <input type="text" name="city" autoComplete="address-level2" required />
            </label>
          )}
        </div>

        {!hasBasket ? (
          <>
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
          </>
        ) : null}

        <label>
          Message / Notes
          <textarea
            name="message"
            placeholder="Any specific requests, delivery directions or custom shade codes..."
            rows={compact ? 4 : 5}
          />
        </label>

        <button className="btn btn-primary submit-button" type="submit" disabled={submitting}>
          {submitting ? <span className="button-spinner" aria-hidden="true" /> : <Send size={18} />}
          {submitting ? "Preparing WhatsApp..." : "Send Enquiry on WhatsApp"}
        </button>
      </form>

      {submitted ? (
        <div className="success-message" role="status" aria-live="polite">
          <span className="success-message-text">
            <strong>Your enquiry details are ready!</strong> If the WhatsApp window did not open automatically, use the buttons below.
          </span>
          <div className="success-actions-flex">
            <a className="btn btn-whatsapp" href={whatsappLink} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              Continue on WhatsApp
            </a>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCopySummary}
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
              {copied ? "Summary Copied!" : "Copy Summary Text"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
