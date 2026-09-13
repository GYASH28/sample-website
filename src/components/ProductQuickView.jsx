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
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import ShadePreviewStudio, { ShadePreviewTint } from "./ShadePreviewStudio.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

function getVariantOptions(product) {
  return Array.isArray(product.variantOptions) ? product.variantOptions : [];
}

export default function ProductQuickView({ product, open, onClose }) {
  const closeRef = useRef(null);
  const panelRef = useRef(null);
  const addedTimerRef = useRef(null);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();
  const [color, setColor] = useState(product.colors?.[0] || null);
  const [previewHex, setPreviewHex] = useState(null);
  const variants = useMemo(() => getVariantOptions(product), [product]);
  const gallery = useMemo(() => [product.image, ...(product.galleryImages || [])].filter(Boolean), [product]);
  const [variant, setVariant] = useState(variants[0] || null);
  const [quantity, setQuantity] = useState(product.quantityOptions?.min || 1);
  const [added, setAdded] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const isSaved = has(product.slug);

  useEffect(() => {
    setColor(product.colors?.[0] || null);
    setPreviewHex(null);
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
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("quick-view-open");
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [onClose, open]);

  if (!open || typeof document === "undefined") return null;

  const step = product.quantityOptions?.step || 1;
  const min = product.quantityOptions?.min || 1;
  const max = product.quantityOptions?.max || 500;
  const image = product.image;
  const unit = product.quantityOptions?.unit || "units";
  const previewNote = previewHex
    ? `Digital colour preview reference ${previewHex.toUpperCase()} only; please match it to the nearest currently available supplier shade.`
    : "";

  const addToEnquiry = () => {
    add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image,
      shade: color,
      quantity,
      unit,
      variant,
      note: previewNote,
    });
    setAdded(true);
    window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => setAdded(false), 1_600);
  };

  const message = `Hello Fakhri Mart, I want to enquire about *${product.name}*${color ? ` in *${color.name}*` : ""}${variant ? ` (${variant})` : ""}, quantity *${quantity} ${unit}*.${previewHex ? ` I used the website's digital colour preview at *${previewHex.toUpperCase()}* as a visual reference only; please show me the nearest currently available supplier shade.` : ""} Please share current availability, shade photos, pack details and price.`;

  return createPortal(
    <div className="quick-view-layer" role="presentation">
      <button className="quick-view-backdrop" type="button" onClick={onClose} aria-label="Close quick view" />
      <section ref={panelRef} className="quick-view" role="dialog" aria-modal="true" aria-labelledby={`quick-view-${product.slug}`}>
        <button ref={closeRef} className="quick-view__close" type="button" onClick={onClose} aria-label="Close quick view">
          <X size={22} />
        </button>

        <div className="quick-view__media shade-preview-surface">
          <img key={gallery[imageIndex]} className="quick-view__main-image" src={gallery[imageIndex]} alt={product.name} width="720" height="720" decoding="async" />
          <ShadePreviewTint value={imageIndex === 0 ? previewHex : null} />
          <span>Availability confirmed on enquiry</span>
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
          <small className="quick-view__photo-note">Representative material photos · use colour preview for visual exploration, then confirm the current supplier shade.</small>
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
              <legend>Choose a supplier-listed shade</legend>
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

          <ShadePreviewStudio value={previewHex} onChange={(hex) => { setPreviewHex(hex); setImageIndex(0); }} compact />

          {variants.length ? (
            <fieldset className="quick-view__choices">
              <legend>Choose option</legend>
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
            <span>Requested quantity</span>
            <div className="quick-view__stepper">
              <button type="button" onClick={() => setQuantity((value) => Math.max(min, value - step))} aria-label="Decrease quantity"><Minus size={16} /></button>
              <output>{quantity}</output>
              <button type="button" onClick={() => setQuantity((value) => Math.min(max, value + step))} aria-label="Increase quantity"><Plus size={16} /></button>
            </div>
          </div>

          <div className="quick-view__actions">
            <button className="btn btn-primary" type="button" onClick={addToEnquiry}>
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
    </div>,
    document.body,
  );
}
