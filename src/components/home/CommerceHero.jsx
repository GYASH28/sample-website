import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  MagnifyingGlass,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData.js";
import { useEnquiryBasket } from "../../hooks/useEnquiryBasket.js";
import { useWishlist } from "../../hooks/useWishlist.js";

const spotlightProducts = featuredProducts.slice(0, 6);

export default function CommerceHero() {
  const [index, setIndex] = useState(0);
  const product = spotlightProducts[index] || featuredProducts[0];
  const [color, setColor] = useState(product?.colors?.[0] || null);
  const [added, setAdded] = useState(false);
  const visualRef = useRef(null);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setColor(product?.colors?.[0] || null);
    setAdded(false);
  }, [product]);

  if (!product) return null;

  const move = (direction) => {
    setIndex((value) => (value + direction + spotlightProducts.length) % spotlightProducts.length);
  };

  const addProduct = () => {
    add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shade: color,
      quantity: product.quantityOptions?.min || 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: null,
      note: "Added from homepage spotlight",
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1_500);
  };

  const onPointerMove = (event) => {
    if (!visualRef.current || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    visualRef.current.style.setProperty("--hero-rx", `${y * -3.5}deg`);
    visualRef.current.style.setProperty("--hero-ry", `${x * 4.5}deg`);
    visualRef.current.style.setProperty("--hero-x", `${x * 10}px`);
    visualRef.current.style.setProperty("--hero-y", `${y * 8}px`);
  };

  const resetPointer = () => {
    if (!visualRef.current) return;
    visualRef.current.style.setProperty("--hero-rx", "0deg");
    visualRef.current.style.setProperty("--hero-ry", "0deg");
    visualRef.current.style.setProperty("--hero-x", "0px");
    visualRef.current.style.setProperty("--hero-y", "0px");
  };

  const saved = has(product.slug);

  return (
    <section className="commerce-hero product-first-hero" aria-labelledby="home-title">
      <div className="container commerce-hero__grid">
        <div className="commerce-hero__copy">
          <p className="eyebrow">Shop yarn, thread and craft materials</p>
          <h1 id="home-title">Find the right material. Choose the shade. Build your enquiry.</h1>
          <p className="commerce-hero__intro">
            Explore real product families first—then compare shades, save favourites and send one organised retail or wholesale enquiry.
          </p>

          <Link className="commerce-hero__search" to="/products?q=">
            <MagnifyingGlass size={20} />
            <span>Search yarn, macrame, beads, hooks and bag materials</span>
            <ArrowRight size={17} />
          </Link>

          <div className="product-first-hero__spotlight-copy" aria-live="polite">
            <div>
              <span>{product.category}</span>
              <strong>{product.name}</strong>
              <small>{product.variants}</small>
            </div>

            {product.colors?.length ? (
              <div className="product-first-hero__swatches" aria-label="Choose spotlight shade">
                {product.colors.slice(0, 6).map((shade) => (
                  <button
                    key={shade.name}
                    type="button"
                    className={color?.name === shade.name ? "is-active" : ""}
                    style={{ backgroundColor: shade.hex }}
                    onClick={() => setColor(shade)}
                    aria-label={`Select ${shade.name}`}
                    aria-pressed={color?.name === shade.name}
                  />
                ))}
                <span>{color?.name || `${product.colors.length} shades`}</span>
              </div>
            ) : null}
          </div>

          <div className="commerce-hero__actions product-first-hero__actions">
            <button className="btn btn-primary" type="button" onClick={addProduct} disabled={product.stock === "out"}>
              <ShoppingBagOpen size={18} /> {added ? "Added to enquiry" : "Add to enquiry"}
            </button>
            <Link className="btn btn-outline" to={`/products/${product.slug}`}>
              View product <ArrowRight size={18} />
            </Link>
            <button className={`product-first-hero__save ${saved ? "is-saved" : ""}`} type="button" onClick={() => toggle(product.slug)} aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}>
              <Heart size={21} weight={saved ? "fill" : "regular"} />
            </button>
          </div>

          <ul className="commerce-hero__trust" aria-label="Store benefits">
            <li><CheckCircle size={17} /> Live shade confirmation</li>
            <li><CheckCircle size={17} /> Retail and wholesale quantities</li>
            <li><CheckCircle size={17} /> Delivery across India</li>
          </ul>
        </div>

        <div
          ref={visualRef}
          className="commerce-hero__visual product-first-hero__visual"
          onPointerMove={onPointerMove}
          onPointerLeave={resetPointer}
        >
          <div className="product-first-hero__frame">
            <img
              key={product.slug}
              src={product.image}
              alt={product.name}
              width="900"
              height="900"
              fetchPriority="high"
              decoding="async"
            />
            <span className="product-first-hero__shade-glow" style={{ backgroundColor: color?.hex || "#2a8c82" }} aria-hidden="true" />
            <div className="product-first-hero__image-label">
              <span>{String(index + 1).padStart(2, "0")} / {String(spotlightProducts.length).padStart(2, "0")}</span>
              <strong>{product.name}</strong>
            </div>
          </div>

          <div className="product-first-hero__controls">
            <button type="button" onClick={() => move(-1)} aria-label="Previous product"><ArrowLeft size={19} /></button>
            <div role="tablist" aria-label="Featured products">
              {spotlightProducts.map((item, itemIndex) => (
                <button
                  key={item.slug}
                  type="button"
                  className={itemIndex === index ? "is-active" : ""}
                  onClick={() => setIndex(itemIndex)}
                  role="tab"
                  aria-selected={itemIndex === index}
                  aria-label={`Show ${item.name}`}
                >
                  <img src={item.image} alt="" width="56" height="56" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
            <button type="button" onClick={() => move(1)} aria-label="Next product"><ArrowRight size={19} /></button>
          </div>

          <div className="commerce-hero__stock-note product-first-hero__stock-note">
            <strong>{product.stock === "out" ? "Ask when it returns" : "Need this exact shade?"}</strong>
            <span>Current stock photos and final quantity pricing are confirmed on WhatsApp.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
