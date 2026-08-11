import { ArrowLeft, ChatCircleDots, ShoppingBag, Trash } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { createWhatsAppLink, featuredProducts } from "../data/siteData.js";
import { getCompareFacts } from "../data/discoveryData.js";
import { useCompare } from "../hooks/useCompare.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const ROWS = [
  ["category", "Category"],
  ["brand", "Brand / family"],
  ["material", "Material"],
  ["thickness", "Thickness / size"],
  ["crafts", "Best for"],
  ["shades", "Shade range"],
  ["soldAs", "Pack format"],
  ["retail", "Retail"],
  ["bulk", "Bulk / wholesale"],
  ["variants", "Current catalogue options"],
];

export default function Compare() {
  useDocumentMeta({
    title: "Compare Materials | Fakhri Mart",
    description: "Compare up to three Fakhri Mart materials by craft use, listed shades, pack format and catalogue options before sending an enquiry.",
    canonical: "/compare",
  });

  const { compare, remove, clear } = useCompare();
  const { add } = useEnquiryBasket();
  const products = compare.map((slug) => featuredProducts.find((product) => product.slug === slug)).filter(Boolean);

  const addAll = () => {
    products.forEach((product) => add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shade: product.colors?.[0] || null,
      quantity: product.quantityOptions?.min || 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: null,
      note: "Added from comparison; please confirm current shade, pack details and availability.",
    }));
    trackEngagement("compare_add_all_enquiry", { count: products.length, source: "compare-page" });
  };

  const compareMessage = products.length
    ? `Hello Fakhri Mart, I am comparing these materials:\n${products.map((product, index) => `${index + 1}. ${product.name}`).join("\n")}\n\nPlease help me compare the current pack details, shades and quantity pricing for my project.`
    : "Hello Fakhri Mart, I need help comparing materials for my project.";

  return (
    <>
      <PageHero
        motif="focus"
        eyebrow="Material comparison"
        title="Compare what actually matters"
        text="Put up to three materials side by side without pretending price, stock or composition is fixed when it still needs current confirmation."
      />

      <section className="section compare-page">
        <div className="container">
          {products.length ? (
            <>
              <div className="compare-page__toolbar">
                <div>
                  <strong>{products.length} of 3 materials selected</strong>
                  <p>Compare catalogue facts first, then ask Fakhri Mart for the current commercial details.</p>
                </div>
                <div className="compare-page__toolbar-actions">
                  <button type="button" className="btn btn-outline" onClick={clear}>
                    <Trash size={16} aria-hidden="true" /> Clear comparison
                  </button>
                  <Link className="btn btn-outline" to="/products">
                    <ArrowLeft size={16} aria-hidden="true" /> Add another
                  </Link>
                </div>
              </div>

              <div className="compare-table-scroll" tabIndex="0" aria-label="Scrollable material comparison">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th scope="col">Compare</th>
                      {products.map((product) => (
                        <th key={product.slug} scope="col">
                          <div className="compare-product-head">
                            <img src={product.image} alt="" width="180" height="180" loading="lazy" decoding="async" />
                            <Link to={`/products/${product.slug}`}>{product.name}</Link>
                            <button type="button" onClick={() => remove(product.slug)} aria-label={`Remove ${product.name} from comparison`}>
                              <Trash size={15} /> Remove
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map(([key, label]) => (
                      <tr key={key}>
                        <th scope="row">{label}</th>
                        {products.map((product) => (
                          <td key={`${product.slug}-${key}`}>{getCompareFacts(product)[key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="compare-page__decision">
                <div>
                  <p className="eyebrow">Next step</p>
                  <h2>Turn the shortlist into one useful enquiry</h2>
                  <p>Add all compared products to your enquiry basket, or ask the team to help choose between them based on your exact project.</p>
                </div>
                <div className="compare-page__decision-actions">
                  <button type="button" className="btn btn-primary" onClick={addAll}>
                    <ShoppingBag size={17} aria-hidden="true" /> Add all to enquiry
                  </button>
                  <a
                    className="btn btn-whatsapp"
                    href={createWhatsAppLink(compareMessage)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackEngagement("compare_whatsapp_click", { count: products.length, source: "compare-page" })}
                  >
                    <ChatCircleDots size={17} aria-hidden="true" /> Ask which suits my project
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="compare-empty">
              <h2>Your comparison is empty</h2>
              <p>Choose up to three materials from the catalogue. Comparison works without an account and stays on this device.</p>
              <Link className="btn btn-primary" to="/products">Browse materials</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
