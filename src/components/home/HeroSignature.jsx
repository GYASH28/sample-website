import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import SmartLink from "../SmartLink.jsx";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import { catalogueMessage, createWhatsAppLink } from "../../data/siteData.js";
import styles from "./HeroSignature.module.css";

const shades = [
  { id: "teal", name: "Artisan teal", color: "#40AAA7" },
  { id: "rose", name: "Crochet rose", color: "#D889A1" },
  { id: "gold", name: "Wicker gold", color: "#C78D52" },
  { id: "cream", name: "Warm ivory", color: "#F4F1EC" },
];

export default function HeroSignature() {
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const swatchesRef = useRef(null);
  const threadsRef = useRef(null);
  const [activeShade, setActiveShade] = useState(shades[0]);

  useEffect(() => {
    const stage = stageRef.current;
    if (
      !stage ||
      document.documentElement.dataset.motionProfile !== "full" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    let frame = 0;
    let settleTimer = 0;

    const writeTransforms = (x, y) => {
      if (imageRef.current) {
        imageRef.current.style.transform = `translate(${x * 5}px, ${y * 4}px)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `translate(${x * -4}px, ${y * -3}px)`;
      }
      if (swatchesRef.current) {
        swatchesRef.current.style.transform = `translate(${x * 3}px, ${y * -4}px)`;
      }
      if (threadsRef.current) {
        threadsRef.current.style.transform = `translate(${x * 2}px, ${y * 2}px)`;
      }
    };

    const onPointerEnter = () => {
      clearTimeout(settleTimer);
      stage.dataset.interacting = "true";
    };

    const onPointerMove = (event) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        writeTransforms(x * 2, y * 2);
      });
    };

    const onPointerLeave = () => {
      if (frame) cancelAnimationFrame(frame);
      writeTransforms(0, 0);
      settleTimer = window.setTimeout(() => {
        delete stage.dataset.interacting;
      }, 480);
    };

    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerleave", onPointerLeave);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(settleTimer);
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <section className={styles.root} aria-labelledby="home-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>The living thread atelier</p>
          <h1 id="home-title" className={styles.title}>
            Every beautiful piece begins with one good thread.
          </h1>
          <p className={styles.intro}>
            Yarn, cord, thread and bag-making materials chosen for makers,
            boutiques and resale shelves across India.
          </p>

          <div className={styles.actions}>
            <SmartLink to="/products" className="btn btn-primary">
              <span>Explore catalogue</span>
              <span className={styles.actionIcon} aria-hidden="true">
                <ArrowRight size={17} />
              </span>
            </SmartLink>
            <a
              className={`btn btn-outline ${styles.secondaryAction}`}
              href={createWhatsAppLink(catalogueMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.actionIcon} aria-hidden="true">
                <WhatsAppIcon size={16} />
              </span>
              WhatsApp enquiry
            </a>
          </div>

          <ul className={styles.trust} aria-label="Store benefits">
            <li><CheckCircle size={16} aria-hidden="true" /> Live shade confirmation</li>
            <li><CheckCircle size={16} aria-hidden="true" /> India-wide delivery</li>
            <li><CheckCircle size={16} aria-hidden="true" /> Retail and bulk support</li>
          </ul>
        </div>

        <div
          ref={stageRef}
          className={styles.artwork}
          data-shade={activeShade.id}
        >
          <div className={styles.frameShell} data-home-hero-frame>
            <figure ref={imageRef} className={styles.photoFrame}>
              <picture>
                <source
                  srcSet="/assets/images/editorial/atelier-hero-640.avif 640w, /assets/images/editorial/atelier-hero-960.avif 960w, /assets/images/editorial/atelier-hero.avif 1280w"
                  sizes="(max-width: 48rem) calc(100vw - 2rem), 46vw"
                  type="image/avif"
                />
                <img
                  src="/assets/images/editorial/atelier-hero-960.webp"
                  srcSet="/assets/images/editorial/atelier-hero-640.webp 640w, /assets/images/editorial/atelier-hero-960.webp 960w, /assets/images/editorial/atelier-hero.webp 1280w"
                  sizes="(max-width: 48rem) calc(100vw - 2rem), 46vw"
                  alt="Yarn, crochet thread, cord, beads and wooden bag handles arranged on a craft worktable"
                  width="1280"
                  height="853"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
              <figcaption>
                <span>Material study 01</span>
                Yarn · cord · bag-making materials
              </figcaption>
            </figure>
          </div>

          <svg
            ref={threadsRef}
            className={styles.threads}
            viewBox="0 0 720 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={`${styles.thread} ${styles.threadGold} ${activeShade.id === "gold" ? styles.threadActive : ""}`}
              d="M-18 84 C138 34 194 194 337 162 S523 20 742 94"
              pathLength="1"
            />
            <path
              className={`${styles.thread} ${styles.threadTeal} ${activeShade.id === "teal" ? styles.threadActive : ""}`}
              d="M-18 456 C118 514 171 307 328 353 S566 538 742 442"
              pathLength="1"
            />
            <path
              className={`${styles.thread} ${styles.threadRose} ${activeShade.id === "rose" ? styles.threadActive : ""}`}
              d="M62 -18 C91 151 273 107 305 264 C340 430 176 515 258 620"
              pathLength="1"
            />
            <path
              className={`${styles.thread} ${styles.threadCream} ${activeShade.id === "cream" ? styles.threadActive : ""}`}
              d="M620 -18 C558 103 665 194 568 302 C466 416 548 506 492 620"
              pathLength="1"
            />
            <path
              className={`${styles.thread} ${styles.threadFine}`}
              d="M-12 548 C165 393 259 553 418 462 S594 236 734 248"
              pathLength="1"
            />
          </svg>

          <figure ref={logoRef} className={styles.brandSeal}>
            <img
              src="/assets/brand/fakhri-logo-256.webp"
              alt="Fakhri Mart Yarn Store"
              width="256"
              height="256"
            />
          </figure>

          <div ref={swatchesRef} className={styles.swatchPanel}>
            <span className={styles.swatchLabel}>Thread palette</span>
            <div className={styles.swatches} role="group" aria-label="Hero thread palette">
              {shades.map((shade) => (
                <button
                  key={shade.id}
                  type="button"
                  className={activeShade.id === shade.id ? styles.swatchActive : ""}
                  style={{ backgroundColor: shade.color }}
                  aria-label={`Highlight ${shade.name} thread`}
                  aria-pressed={activeShade.id === shade.id}
                  onMouseEnter={() => setActiveShade(shade)}
                  onFocus={() => setActiveShade(shade)}
                  onClick={() => setActiveShade(shade)}
                />
              ))}
            </div>
            <strong aria-live="polite">{activeShade.name}</strong>
          </div>

          <p className={styles.artNote}>
            One thread connects fibre, colour and the hands that make.
          </p>
        </div>
      </div>
    </section>
  );
}
