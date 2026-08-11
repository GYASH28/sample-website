import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import CompareButton from "./CompareButton.jsx";
import MadeWithFakhri from "./MadeWithFakhri.jsx";
import ProductAtAGlance from "./ProductAtAGlance.jsx";
import { featuredProducts } from "../data/siteData.js";

export default function ProductRouteEnhancements() {
  const { pathname } = useLocation();
  const slug = pathname.startsWith("/products/") ? decodeURIComponent(pathname.slice("/products/".length)) : null;
  const product = useMemo(() => featuredProducts.find((item) => item.slug === slug), [slug]);
  if (!product) return null;

  return (
    <div className="product-route-enhancements">
      <section className="section product-decision-layer">
        <div className="container">
          <div className="product-decision-layer__compare">
            <div>
              <p className="eyebrow">Still deciding?</p>
              <h2>Compare this material before you enquire</h2>
              <p>Keep up to three materials side by side by project use, listed shades, pack format and catalogue options.</p>
            </div>
            <CompareButton product={product} />
          </div>
          <ProductAtAGlance product={product} />
        </div>
      </section>

      <section className="section section-tinted product-maker-layer">
        <div className="container">
          <MadeWithFakhri compact />
        </div>
      </section>
    </div>
  );
}
