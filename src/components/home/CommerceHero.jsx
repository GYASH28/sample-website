import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  MagnifyingGlass,
  Pause,
  Play,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData.js";
import { useEnquiryBasket } from "../../hooks/useEnquiryBasket.js";
import { useWishlist } from "../../hooks/useWishlist.js";

const spotlightProducts = featuredProducts.slice(0, 6);
const AUTO_ADVANCE_MS = 6500;

export default function CommerceHero() {
  const [index, setIndex] = useState(0);
  const product = spotlightProducts[index] || featuredProducts[0];
  const [color, setColor] = useState(product?.colors?.[0] || null);
  const [added, setAdded] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const visualRef = useRef(null);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setColor(product?.colors?.[0] || null);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (autoPaused || interactionPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % spotlightProducts.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [index, autoPaused, interactionPaused]);

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
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const x = px - 0.5;
    const y = py - 0.5;
    visualRef.current.style.setProperty("--hero-rx", `${y * -3.5}deg`);
    visualRef.current.style.setProperty("--hero-ry", `${x * 4.5}deg`);
    visualRef.current.style.setProperty("--hero-x", `${x * 10}px`);
    visualRef.current.style.setProperty("--hero-y", `${y * 8}px`);
    visualRef.current.style.setProperty("--hero-glow-x", `${px * 100}%`);
    visualRef.current.style.setProperty("--hero-glow-y", `${py * 100}%`);
  };

  const resetPointer = () => {
    if (!visualRef.current) return;
    visualRef.current.style.setProperty("--hero-rx", "0deg");
    visualRef.current.style.setProperty("--hero-ry", "0deg");
    visualRef.current.style.setProperty("--hero-x", "0px");
    visualRef.current.style.setProperty("--hero-y", "0px");
    visualRef.current.style.setProperty("--hero-glow-x", "50%");
    visualRef.current.style.setProperty("--hero-glow-y", "50%");
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

          <div className="product-first-hero__spotlight-copy" aria-live="off">
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
                <span key={color?.name || "shade-count"} className="hero-shade-name">{color?.name || `${product.colors.length} shades`}</span>
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
          onPointerEnter={() => setInteractionPaused(true)}
          onPointerLeave={() => {
            setInteractionPaused(false);
            resetPointer();
          }}
          onFocusCapture={() => setInteractionPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setInteractionPaused(false);
          }}
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
            <span className="product-first-hero__pointer-light" aria-hidden="true" />
            <div className="product-first-hero__image-label">
              <span>{String(index + 1).padStart(2, "0")} / {String(spotlightProducts.length).padStart(2, "0")}</span>
              <strong>{product.name}</strong>
            </div>
            {!autoPaused && !interactionPaused ? <span key={`progress-${index}`} className="product-first-hero__autoplay-track" aria-hidden="true"><i /></span> : null}
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
            <button
              type="button"
              className="product-first-hero__autoplay-toggle"
              onClick={() => setAutoPaused((value) => !value)}
              aria-label={autoPaused ? "Play featured products" : "Pause featured products"}
              aria-pressed={autoPaused}
            >
              {autoPaused ? <Play size={17} /> : <Pause size={17} />}
            </button>
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
