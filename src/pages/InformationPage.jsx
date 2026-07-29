import { Link, useLocation } from "react-router-dom";
import { businessInfo } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const content = {
  "/privacy": {
    eyebrow: "Privacy",
    title: "Your enquiry details stay in your control.",
    intro: "This catalogue does not create customer accounts or process payments.",
    sections: [
      ["What we store", "Wishlist and enquiry-list items are stored locally in your browser. Fakhri Mart does not receive them until you choose to send an enquiry."],
      ["What WhatsApp receives", "When you continue to WhatsApp, the message you reviewed is passed to WhatsApp. Their service and privacy terms then apply."],
      ["Contact forms", "The form prepares a WhatsApp message. It is not submitted to a separate website database."],
    ],
  },
  "/terms": {
    eyebrow: "Terms",
    title: "Catalogue information is confirmed before an order.",
    intro: "This website supports product discovery and enquiries; it is not an online checkout.",
    sections: [
      ["Prices", "Prices vary by quantity, shade, size, packaging and availability. A price is final only when Fakhri Mart confirms it directly."],
      ["Images and shades", "Material-family images help discovery. Ask for live product and shade photos before confirming an order because screens and batches can differ."],
      ["Availability and delivery", "Stock and delivery timing are confirmed during the enquiry. No product is reserved merely by adding it to an enquiry list."],
    ],
  },
  "/delivery-enquiries": {
    eyebrow: "Delivery & enquiries",
    title: "How a catalogue enquiry becomes an order.",
    intro: "Fakhri Mart supports retail and wholesale enquiries from Pune to customers across India.",
    sections: [
      ["1. Build your list", "Add products, preferred shades, variants and quantities. Include your city or state and any packing requirement."],
      ["2. Send on WhatsApp", "Review the prepared message and send it to Fakhri Mart. No prices or totals are invented by the website."],
      ["3. Confirm the details", "The team shares current availability, live shade photos where needed, quantity-based pricing and delivery timing."],
    ],
  },
};

export default function InformationPage() {
  const { pathname } = useLocation();
  const page = content[pathname] || content["/delivery-enquiries"];
  useDocumentMeta({
    title: `${page.eyebrow} — Fakhri Mart`,
    description: page.intro,
    canonical: pathname,
  });

  return (
    <section className="information-page">
      <div className="container information-page-grid">
        <header>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p className="large-copy">{page.intro}</p>
          <Link className="btn btn-primary" to="/contact">Contact {businessInfo.shortName}</Link>
        </header>
        <div className="information-sections">
          {page.sections.map(([title, body]) => (
            <section key={title}><h2>{title}</h2><p>{body}</p></section>
          ))}
        </div>
      </div>
    </section>
  );
}
