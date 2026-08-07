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
  const [direction, setDirection] = useState("next");
  const [heroReady, setHeroReady] = useState(false);
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const pointerFrameRef = useRef(0);
  const scrollFrameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const visualRectRef = useRef(null);
  const pointerMotionEnabledRef = useRef(false);
  const touchStartRef = useRef(null);
  const addedTimerRef = useRef(0);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();

  useEffect(() => {
    setColor(product?.colors?.[0] || null);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    const body = document.body;
    const revealHero = () => {
      if (!body.classList.contains("commerce-intro-open")) setHeroReady(true);
    };

    revealHero();
    const observer = new MutationObserver(revealHero);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (
      autoPaused ||
      interactionPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setDirection("next");
      setIndex((value) => (value + 1) % spotlightProducts.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearTimeout(timer);
  }, [index, autoPaused, interactionPaused]);

  useEffect(() => {
    const updateScroll = () => {
      scrollFrameRef.current = 0;
      const section = sectionRef.current;
      if (!section) return;
      const progress = Math.min(1, Math.max(0, window.scrollY / 780));
      section.style.setProperty("--hero-scroll-progress", progress.toFixed(3));
    };

    const onScroll = () => {
      if (window.scrollY > 900 && !scrollFrameRef.current) {
        sectionRef.current?.style.setProperty("--hero-scroll-progress", "1");
        return;
      }
      if (!scrollFrameRef.current) {
        scrollFrameRef.current = window.requestAnimationFrame(updateScroll);
      }
    };

    updateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (pointerFrameRef.current) window.cancelAnimationFrame(pointerFrameRef.current);
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
      if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
    },
    [],
  );

  if (!product) return null;

  const move = (movement) => {
    setDirection(movement > 0 ? "next" : "prev");
    setIndex(
      (value) =>
        (value + movement + spotlightProducts.length) % spotlightProducts.length,
    );
  };

  const selectProduct = (nextIndex) => {
    if (nextIndex === index) return;
    const forwardDistance = (nextIndex - index + spotlightProducts.length) % spotlightProducts.length;
    const backwardDistance = (index - nextIndex + spotlightProducts.length) % spotlightProducts.length;
    setDirection(forwardDistance <= backwardDistance ? "next" : "prev");
    setIndex(nextIndex);
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
    if (addedTimerRef.current) window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => setAdded(false), 1_500);
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

    visual.style.setProperty("--hero-rx", `${y * -2.1}deg`);
    visual.style.setProperty("--hero-ry", `${x * 2.7}deg`);
    visual.style.setProperty("--hero-x", `${x * 7}px`);
    visual.style.setProperty("--hero-y", `${y * 5}px`);
    visual.style.setProperty("--hero-glow-x", `${px * 100}%`);
    visual.style.setProperty("--hero-glow-y", `${py * 100}%`);
    visual.style.setProperty("--hero-orbit-x", `${x * 12}px`);
    visual.style.setProperty("--hero-orbit-y", `${y * 10}px`);
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
    visualRef.current.style.setProperty("--hero-orbit-x", "0px");
    visualRef.current.style.setProperty("--hero-orbit-y", "0px");
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
      ref={sectionRef}
      className="commerce-hero product-first-hero hero-v6 hero-v7"
      data-ready={heroReady ? "true" : "false"}
      data-direction={direction}
      aria-labelledby="home-title"
    >
      <div className="hero-v7__ambient" aria-hidden="true">
        <span>THREAD</span>
        <span>TEXTURE</span>
        <span>MAKE</span>
      </div>

      <svg className="hero-v7__thread-line" viewBox="0 0 1440 820" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 655 C170 590 250 710 445 575 C610 462 652 315 820 336 C1010 360 1080 185 1510 120" pathLength="1" />
      </svg>

      <div className="container hero-v6__shell hero-v7__shell">
        <div className="hero-v6__copy hero-v7__copy">
          <div className="hero-v6__eyebrow hero-v7__eyebrow">
            <span aria-hidden="true" />
            <p>Yarn & craft materials · Pune</p>
          </div>

          <h1 id="home-title" className="hero-v7__headline">
            <span className="hero-v7__headline-line"><span>Craft starts</span></span>
            <span className="hero-v7__headline-line"><span>with the</span></span>
            <em className="hero-v7__headline-line"><span>right material.</span></em>
          </h1>

          <p className="hero-v6__intro hero-v7__intro">
            Explore yarns, threads, macrame and craft essentials. Choose a shade,
            save what you like, and send one organised enquiry.
          </p>

          <div className="hero-v7__discover-row">
            <Link className="hero-v6__search hero-v7__search" to="/products?q=">
              <MagnifyingGlass size={19} />
              <span>Search materials</span>
              <small>Yarn, thread, beads, hooks…</small>
              <ArrowRight size={17} />
            </Link>
            <span className="hero-v7__scroll-cue" aria-hidden="true">
              <i /> Explore
            </span>
          </div>

          <div className="hero-v6__featured hero-v7__featured" aria-live="polite">
            <div className="hero-v6__product-heading hero-v7__product-heading" key={`product-${product.slug}`}>
              <p>
                <span>{String(index + 1).padStart(2, "0")}</span>
                Featured material
              </p>
              <h2>{product.name}</h2>
              <small>{product.category} · {product.variants}</small>
            </div>

            {visibleColors.length ? (
              <div className="hero-v6__shade-picker hero-v7__shade-picker" aria-label="Choose featured shade">
                <div className="hero-v6__swatches hero-v7__swatches">
                  {visibleColors.map((shade, shadeIndex) => (
                    <button
                      key={shade.name}
                      type="button"
                      className={color?.name === shade.name ? "is-active" : ""}
                      style={{ "--swatch": shade.hex, "--swatch-index": shadeIndex }}
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

          <div className="hero-v6__actions hero-v7__actions">
            <button
              className="btn btn-primary hero-v6__primary hero-v7__primary"
              type="button"
              onClick={addProduct}
              disabled={product.stock === "out"}
            >
              <span className="hero-v7__button-sheen" aria-hidden="true" />
              <ShoppingBagOpen size={18} />
              {added ? "Added" : "Add to enquiry"}
            </button>

            <Link className="hero-v6__product-link hero-v7__product-link" to={`/products/${product.slug}`}>
              View product <ArrowRight size={17} />
            </Link>
          </div>

          <div className="hero-v6__assurance hero-v7__assurance" aria-label="Store benefits">
            <span>Live shade confirmation</span>
            <i aria-hidden="true" />
            <span>Retail + wholesale</span>
            <i aria-hidden="true" />
            <span>India-wide delivery</span>
          </div>
        </div>

        <div
          ref={visualRef}
          className="hero-v6__visual hero-v7__visual"
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
          <div className="hero-v7__orbit-label hero-v7__orbit-label--one" aria-hidden="true">
            <span>01</span> Pick a material
          </div>
          <div className="hero-v7__orbit-label hero-v7__orbit-label--two" aria-hidden="true">
            <span>02</span> Choose a shade
          </div>

          <div className="hero-v7__stage-float">
            <span className="hero-v7__back-card hero-v7__back-card--one" aria-hidden="true" />
            <span className="hero-v7__back-card hero-v7__back-card--two" aria-hidden="true" />

            <div className="hero-v6__stage hero-v7__stage">
              <div className="hero-v7__stage-grid" aria-hidden="true" />
              <div className="hero-v6__stage-top hero-v7__stage-top">
                <span><i aria-hidden="true" /> Featured collection</span>
                <button
                  type="button"
                  className={saved ? "is-saved" : ""}
                  onClick={() => toggle(product.slug)}
                  aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                >
                  <Heart size={20} weight={saved ? "fill" : "regular"} />
                </button>
              </div>

              <div className="hero-v6__image-wrap hero-v7__image-wrap">
                <img
                  key={`${product.slug}-${direction}`}
                  src={product.image}
                  alt={product.name}
                  width="900"
                  height="900"
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="hero-v7__image-curtain" aria-hidden="true" />
                <span
                  className="hero-v6__shade-light hero-v7__shade-light"
                  style={{ "--shade": color?.hex || "#2a8c82" }}
                  aria-hidden="true"
                />
                <span className="hero-v6__pointer-light hero-v7__pointer-light" aria-hidden="true" />
                <span className="hero-v7__lens-ring" aria-hidden="true" />
              </div>

              <div className="hero-v6__stage-caption hero-v7__stage-caption" key={`caption-${product.slug}`}>
                <div>
                  <span>{product.category}</span>
                  <strong>{product.name}</strong>
                </div>
                <p>
                  <span
                    className="hero-v6__active-swatch hero-v7__active-swatch"
                    style={{ "--swatch": color?.hex || "#2a8c82" }}
                    aria-hidden="true"
                  />
                  {color?.name || "Choose shade"}
                </p>
              </div>

              <div className="hero-v7__edge-index" aria-hidden="true">
                <strong key={`edge-${index}`}>{String(index + 1).padStart(2, "0")}</strong>
                <span>/ {String(spotlightProducts.length).padStart(2, "0")}</span>
              </div>

              {!autoPaused && !interactionPaused ? (
                <span key={`progress-${index}`} className="hero-v6__autoplay hero-v7__autoplay" aria-hidden="true">
                  <i />
                </span>
              ) : null}
            </div>
          </div>

          <div className="hero-v6__carousel hero-v7__carousel" aria-label="Featured product carousel">
            <button type="button" onClick={() => move(-1)} aria-label="Previous product">
              <ArrowLeft size={18} />
            </button>

            <div className="hero-v6__thumbs hero-v7__thumbs" role="tablist" aria-label="Featured products">
              {spotlightProducts.map((item, itemIndex) => (
                <button
                  key={item.slug}
                  type="button"
                  className={itemIndex === index ? "is-active" : ""}
                  onClick={() => selectProduct(itemIndex)}
                  role="tab"
                  aria-selected={itemIndex === index}
                  aria-label={`Show ${item.name}`}
                  style={{ "--thumb-index": itemIndex }}
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
              className="hero-v6__pause hero-v7__pause"
              onClick={() => setAutoPaused((value) => !value)}
              aria-label={autoPaused ? "Play featured products" : "Pause featured products"}
              aria-pressed={autoPaused}
            >
              {autoPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>

          <div className="hero-v6__micro-note hero-v7__micro-note">
            <span>Swipe or use the arrows</span>
            <strong key={`count-${index}`}>{String(index + 1).padStart(2, "0")} / {String(spotlightProducts.length).padStart(2, "0")}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
