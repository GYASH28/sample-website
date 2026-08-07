import {
  ArrowLeft,
  ArrowRight,
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
const SWIPE_THRESHOLD = 42;

export default function CommerceHero() {
  const [index, setIndex] = useState(0);
  const product = spotlightProducts[index] || featuredProducts[0];
  const [color, setColor] = useState(product?.colors?.[0] || null);
  const [added, setAdded] = useState(false);
  const [autoPaused, setAutoPaused] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const visualRef = useRef(null);
  const pointerFrameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const visualRectRef = useRef(null);
  const pointerMotionEnabledRef = useRef(false);
  const touchStartRef = useRef(null);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setColor(product?.colors?.[0] || null);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    if (
      autoPaused ||
      interactionPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setIndex((value) => (value + 1) % spotlightProducts.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [index, autoPaused, interactionPaused]);

  useEffect(
    () => () => {
      if (pointerFrameRef.current) window.cancelAnimationFrame(pointerFrameRef.current);
    },
    [],
  );

  if (!product) return null;

  const move = (direction) => {
    setIndex(
      (value) =>
        (value + direction + spotlightProducts.length) % spotlightProducts.length,
    );
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

  const applyPointerMotion = () => {
    pointerFrameRef.current = 0;
    const visual = visualRef.current;
    const rect = visualRectRef.current;
    if (!visual || !rect || !pointerMotionEnabledRef.current) return;

    const px = Math.min(
      1,
      Math.max(0, (pointerRef.current.x - rect.left) / rect.width),
    );
    const py = Math.min(
      1,
      Math.max(0, (pointerRef.current.y - rect.top) / rect.height),
    );
    const x = px - 0.5;
    const y = py - 0.5;

    visual.style.setProperty("--hero-rx", `${y * -1.45}deg`);
    visual.style.setProperty("--hero-ry", `${x * 1.8}deg`);
    visual.style.setProperty("--hero-x", `${x * 4}px`);
    visual.style.setProperty("--hero-y", `${y * 3}px`);
    visual.style.setProperty("--hero-glow-x", `${px * 100}%`);
    visual.style.setProperty("--hero-glow-y", `${py * 100}%`);
  };

  const onPointerMove = (event) => {
    if (!pointerMotionEnabledRef.current) return;
    pointerRef.current = { x: event.clientX, y: event.clientY };
    if (!pointerFrameRef.current) {
      pointerFrameRef.current = window.requestAnimationFrame(applyPointerMotion);
    }
  };

  const onPointerEnter = () => {
    setInteractionPaused(true);
    const profile = document.documentElement.dataset.motionProfile;
    pointerMotionEnabledRef.current =
      profile === "full" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    visualRectRef.current = visualRef.current?.getBoundingClientRect() || null;
  };

  const resetPointer = () => {
    pointerMotionEnabledRef.current = false;
    visualRectRef.current = null;

    if (pointerFrameRef.current) {
      window.cancelAnimationFrame(pointerFrameRef.current);
      pointerFrameRef.current = 0;
    }

    if (!visualRef.current) return;
    visualRef.current.style.setProperty("--hero-rx", "0deg");
    visualRef.current.style.setProperty("--hero-ry", "0deg");
    visualRef.current.style.setProperty("--hero-x", "0px");
    visualRef.current.style.setProperty("--hero-y", "0px");
    visualRef.current.style.setProperty("--hero-glow-x", "50%");
    visualRef.current.style.setProperty("--hero-glow-y", "50%");
  };

  const onTouchStart = (event) => {
    const touch = event.touches?.[0];
    if (!touch) return;
    setInteractionPaused(true);
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (event) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches?.[0];
    touchStartRef.current = null;
    setInteractionPaused(false);
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) {
      return;
    }

    move(deltaX < 0 ? 1 : -1);
  };

  const saved = has(product.slug);
  const visibleColors = product.colors?.slice(0, 5) || [];
  const remainingColors = Math.max((product.colors?.length || 0) - visibleColors.length, 0);

  return (
    <section
      className="commerce-hero product-first-hero hero-v6"
      aria-labelledby="home-title"
    >
      <div className="container hero-v6__shell">
        <div className="hero-v6__copy">
          <div className="hero-v6__eyebrow">
            <span aria-hidden="true" />
            <p>Yarn & craft materials · Pune</p>
          </div>

          <h1 id="home-title">
            Craft starts with the <em>right material.</em>
          </h1>

          <p className="hero-v6__intro">
            Explore yarns, threads, macrame and craft essentials. Choose a shade,
            save what you like, and send one organised enquiry.
          </p>

          <Link className="hero-v6__search" to="/products?q=">
            <MagnifyingGlass size={19} />
            <span>Search materials</span>
            <small>Yarn, thread, beads, hooks…</small>
            <ArrowRight size={17} />
          </Link>

          <div className="hero-v6__featured" aria-live="polite">
            <div className="hero-v6__product-heading">
              <p>
                <span>{String(index + 1).padStart(2, "0")}</span>
                Featured material
              </p>
              <h2 key={`title-${product.slug}`}>{product.name}</h2>
              <small>{product.category} · {product.variants}</small>
            </div>

            {visibleColors.length ? (
              <div className="hero-v6__shade-picker" aria-label="Choose featured shade">
                <div className="hero-v6__swatches">
                  {visibleColors.map((shade) => (
                    <button
                      key={shade.name}
                      type="button"
                      className={color?.name === shade.name ? "is-active" : ""}
                      style={{ "--swatch": shade.hex }}
                      onClick={() => setColor(shade)}
                      aria-label={`Select ${shade.name}`}
                      aria-pressed={color?.name === shade.name}
                    />
                  ))}
                </div>
                <p>
                  <strong key={color?.name || "shade"}>{color?.name || "Available shades"}</strong>
                  {remainingColors ? <span>+{remainingColors} more</span> : null}
                </p>
              </div>
            ) : null}
          </div>

          <div className="hero-v6__actions">
            <button
              className="btn btn-primary hero-v6__primary"
              type="button"
              onClick={addProduct}
              disabled={product.stock === "out"}
            >
              <ShoppingBagOpen size={18} />
              {added ? "Added" : "Add to enquiry"}
            </button>

            <Link className="hero-v6__product-link" to={`/products/${product.slug}`}>
              View product <ArrowRight size={17} />
            </Link>
          </div>

          <div className="hero-v6__assurance" aria-label="Store benefits">
            <span>Live shade confirmation</span>
            <i aria-hidden="true" />
            <span>Retail + wholesale</span>
            <i aria-hidden="true" />
            <span>India-wide delivery</span>
          </div>
        </div>

        <div
          ref={visualRef}
          className="hero-v6__visual"
          onPointerMove={onPointerMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={() => {
            setInteractionPaused(false);
            resetPointer();
          }}
          onFocusCapture={() => setInteractionPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setInteractionPaused(false);
            }
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="hero-v6__stage">
            <div className="hero-v6__stage-top">
              <span>Featured collection</span>
              <button
                type="button"
                className={saved ? "is-saved" : ""}
                onClick={() => toggle(product.slug)}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart size={20} weight={saved ? "fill" : "regular"} />
              </button>
            </div>

            <div className="hero-v6__image-wrap">
              <img
                key={product.slug}
                src={product.image}
                alt={product.name}
                width="900"
                height="900"
                fetchPriority="high"
                decoding="async"
              />
              <span
                className="hero-v6__shade-light"
                style={{ "--shade": color?.hex || "#2a8c82" }}
                aria-hidden="true"
              />
              <span className="hero-v6__pointer-light" aria-hidden="true" />
            </div>

            <div className="hero-v6__stage-caption">
              <div>
                <span>{product.category}</span>
                <strong>{product.name}</strong>
              </div>
              <p>
                <span
                  className="hero-v6__active-swatch"
                  style={{ "--swatch": color?.hex || "#2a8c82" }}
                  aria-hidden="true"
                />
                {color?.name || "Choose shade"}
              </p>
            </div>

            {!autoPaused && !interactionPaused ? (
              <span key={`progress-${index}`} className="hero-v6__autoplay" aria-hidden="true">
                <i />
              </span>
            ) : null}
          </div>

          <div className="hero-v6__carousel" aria-label="Featured product carousel">
            <button type="button" onClick={() => move(-1)} aria-label="Previous product">
              <ArrowLeft size={18} />
            </button>

            <div className="hero-v6__thumbs" role="tablist" aria-label="Featured products">
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
                  <img
                    src={item.image}
                    alt=""
                    width="62"
                    height="62"
                    loading={itemIndex === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <span>{String(itemIndex + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>

            <button type="button" onClick={() => move(1)} aria-label="Next product">
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="hero-v6__pause"
              onClick={() => setAutoPaused((value) => !value)}
              aria-label={autoPaused ? "Play featured products" : "Pause featured products"}
              aria-pressed={autoPaused}
            >
              {autoPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>

          <div className="hero-v6__micro-note">
            <span>Swipe or use the arrows</span>
            <strong>{String(index + 1).padStart(2, "0")} / {String(spotlightProducts.length).padStart(2, "0")}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
