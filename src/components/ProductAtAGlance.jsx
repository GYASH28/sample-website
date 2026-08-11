import { Camera, ChatCircleDots, CheckCircle, Package, Palette, Ruler, Sparkle, Storefront } from "@phosphor-icons/react";
import { createWhatsAppLink } from "../data/siteData.js";
import { getProductDiscoveryMeta } from "../data/discoveryData.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";
import GlossaryTerm from "./GlossaryTerm.jsx";

export default function ProductAtAGlance({ product, shade = null }) {
  const meta = getProductDiscoveryMeta(product);
  const selectedShade = shade?.name ? `, especially the *${shade.name}* shade` : "";
  const photoMessage = `Hello Fakhri Mart, I am considering *${product.name}*${selectedShade}. Please send me a current product/batch photo and the latest available shade photo/card before I decide. Thank you!`;

  const facts = [
    {
      icon: Sparkle,
      label: "Best for",
      value: meta.crafts.length ? meta.crafts.join(", ") : product.suitableFor,
    },
    {
      icon: Storefront,
      label: "Material / family",
      value: meta.material || "Confirm composition from current pack",
    },
    {
      icon: Ruler,
      label: "Thickness / option",
      value: meta.thicknesses.length ? meta.thicknesses.join(", ") : product.variants || "Confirm current option",
    },
    {
      icon: Palette,
      label: "Shade context",
      value: meta.shadeCount ? `${meta.shadeCount} representative shades listed` : "Current shades on request",
    },
    {
      icon: Package,
      label: "Listed as",
      value: meta.soldAs || "Confirm current pack format",
    },
    {
      icon: CheckCircle,
      label: "Enquiry support",
      value: [meta.retailSuitable ? "Retail" : null, meta.bulkSuitable ? "Bulk / wholesale" : null].filter(Boolean).join(" + ") || "Ask for quantity options",
    },
  ];

  return (
    <section className="product-at-glance" aria-labelledby="product-at-glance-title">
      <div className="product-at-glance__head">
        <div>
          <p className="eyebrow">Decision help</p>
          <h2 id="product-at-glance-title">At a glance</h2>
          <p>Use these catalogue facts to shortlist the material. Current composition, shade, pack and availability are confirmed before ordering.</p>
        </div>
        <a
          className="btn btn-outline product-photo-request"
          href={createWhatsAppLink(photoMessage)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEngagement("current_photo_request", {
            product: product.slug,
            category: product.category,
            shade: shade?.name || "none",
            source: "product-at-glance",
          })}
        >
          <Camera size={17} aria-hidden="true" />
          Request current photos
        </a>
      </div>

      <dl className="product-at-glance__grid">
        {facts.map(({ icon: Icon, label, value }) => (
          <div key={label} className="product-fact-card">
            <dt><Icon size={18} aria-hidden="true" /> {label}</dt>
            <dd>{label === "Thickness / option" && /ply/i.test(value) ? <GlossaryTerm term="Ply">{value}</GlossaryTerm> : value}</dd>
          </div>
        ))}
      </dl>

      <div className="product-at-glance__note">
        <ChatCircleDots size={18} aria-hidden="true" />
        <p><strong>Buying something colour-sensitive?</strong> Screen swatches are only navigation aids. Ask for a current batch/shade photo before final confirmation.</p>
      </div>
    </section>
  );
}
