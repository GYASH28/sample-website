import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBagOpen,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

function getVariantOptions(product) {
  if (product.slug === "t-shirt-yarn") return ["250gm", "500gm"];
  if (product.slug.includes("macrame-cord")) return ["3MM", "4MM"];
  if (product.slug === "crochet-hook") return ["2.0mm", "3.0mm", "4.0mm", "5.0mm"];
  return [];
}

export default function ProductQuickView({ product, open, onClose }) {
  const closeRef = useRef(null);
  const addedTimerRef = useRef(null);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();
  const [color, setColor] = useState(product.colors?.[0] || null);
  const variants = useMemo(() => getVariantOptions(product), [product]);
  const gallery = useMemo(() => [product.image, ...(product.galleryImages || [])].filter(Boolean), [product]);
  const [variant, setVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(product.quantityOptions?.min || 1);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const isSaved = has(product.slug);

  useEffect(() => {
    setColor(product.colors?.[0] || null);
    setVariant(variants[0] || null);
    setQuantity(product.quantityOptions?.min || 1);
    setAdded(false);
    setImageIndex(0);
  }, [product, variants]);

  useEffect(() => () => window.clearTimeout(addedTimerRef.current), []);

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    document.body.classList.add("quick-view-open");
    window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("quick-view-open");
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [onClose, open]);

  if (!open) return null;

  const step = product.quantityOptions?.step || 1;
  const min = product.quantityOptions?.min || 1;
  const max = product.quantityOptions?.max || 500;
  const image = product.image;

  const addToEnquiry = () => {
    add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image,
      shade: color,
      quantity,
      unit: product.quantityOptions?.unit || "pcs",
      variant,
      note: "",
    });
    setAdded(true);
    window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => setAdded(false), 1_600);
  };

  const message = `Hello Fakhri Mart, I want to enquire about *${product.name}*${color ? ` in *${color.name}*` : ""}${variant ? ` (${variant})` : ""}, quantity *${quantity} ${product.quantityOptions?.unit || "pcs"}*. Please share current availability, shade photos and price.`;

  return (
    <div className="quick-view-layer" role="presentation">
      <button className="quick-view-backdrop" type="button" onClick={onClose} aria-label="Close quick view" />
      <section className="quick-view" role="dialog" aria-modal="true" aria-labelledby={`quick-view-${product.slug}`}>
        <button ref={closeRef} className="quick-view__close" type="button" onClick={onClose} aria-label="Close quick view">
          <X size={22} />
        </button>

        <div className="quick-view__media">
          <img key={gallery[imageIndex]} className="quick-view__main-image" src={gallery[imageIndex]} alt={product.name} width="720" height="720" decoding="async" />
          <span>{product.stock === "out" ? "Currently unavailable" : "Availability confirmed live"}</span>
          {gallery.length > 1 ? (
            <div className="quick-view__gallery" aria-label="Material views">
              {gallery.slice(0, 4).map((source, index) => (
                <button
                  key={source}
                  type="button"
                  className={index === imageIndex ? "is-active" : ""}
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show material view ${index + 1}`}
                  aria-pressed={index === imageIndex}
                >
                  <img src={source} alt="" width="58" height="58" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          ) : null}
          <small className="quick-view__photo-note">Representative material photos · ask for current shade photos before ordering.</small>
        </div>

        <div className="quick-view__content">
          <p className="eyebrow">{product.category}</p>
          <div className="quick-view__title-row">
            <h2 id={`quick-view-${product.slug}`}>{product.name}</h2>
            <button className={isSaved ? "is-saved" : ""} type="button" onClick={() => toggle(product.slug)} aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}>
              <Heart size={21} weight={isSaved ? "fill" : "regular"} />
            </button>
          </div>
          <p>{product.description}</p>

          {product.colors?.length ? (
            <fieldset className="quick-view__choices">
              <legend>Choose a listed shade</legend>
              <div className="quick-view__swatches">
                {product.colors.slice(0, 8).map((shade) => (
                  <button
                    key={shade.name}
                    type="button"
                    className={color?.name === shade.name ? "is-active" : ""}
                    onClick={() => setColor(shade)}
                    aria-label={`Select ${shade.name}`}
                    aria-pressed={color?.name === shade.name}
                  >
                    <i style={{ backgroundColor: shade.hex }} />
                    <span>{shade.name}</span>
                    {color?.name === shade.name ? <Check size={13} /> : null}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          {variants.length ? (
            <fieldset className="quick-view__choices">
              <legend>Choose size</legend>
              <div className="quick-view__variants">
                {variants.map((option) => (
                  <button key={option} type="button" className={variant === option ? "is-active" : ""} onClick={() => setVariant(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="quick-view__quantity-row">
            <span>Quantity</span>
            <div className="quick-view__stepper">
              <button type="button" onClick={() => setQuantity((value) => Math.max(min, value - step))} aria-label="Decrease quantity"><Minus size={16} /></button>
              <output>{quantity}</output>
              <button type="button" onClick={() => setQuantity((value) => Math.min(max, value + step))} aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
          </div>

          <div className="quick-view__actions">
            <button className="btn btn-primary" type="button" onClick={addToEnquiry} disabled={product.stock === "out"}>
              <ShoppingBagOpen size={18} /> {added ? "Added to enquiry" : "Add to enquiry"}
            </button>
            <a className="btn btn-outline" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> Ask on WhatsApp
            </a>
          </div>

          <Link className="quick-view__details" to={`/products/${product.slug}`} onClick={onClose}>
            View full product details <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
