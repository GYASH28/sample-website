import { useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CaretLeft, CaretRight, X } from "@phosphor-icons/react";
import styles from "./ImageZoom.module.css";

/**
 * Lightbox — fullscreen image gallery modal with prev/next navigation and keyboard support.
 *
 * Phase 2 item 11: the default ImageZoom magnifier export was removed (unused, over-engineered).
 * Only the Lightbox named export remains — it's actively used by ProductDetail.jsx.
 *
 * Props:
 *  - images: [{ src, label }] array
 *  - activeIndex: number (which image is currently shown)
 *  - onIndexChange: (newIndex) => void
 *  - onClose: () => void
 */
export function Lightbox({ images = [], activeIndex = 0, onIndexChange, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const previousFocusRef = useRef(null);

  useLayoutEffect(() => {
    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.classList.add("dialog-lock");
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.classList.remove("dialog-lock");
      document.body.style.overflow = previousOverflow;
      const previousFocus = previousFocusRef.current;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onIndexChange((activeIndex - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onIndexChange((activeIndex + 1) % images.length);
      }
      if (e.key === "Tab") {
        const controls = [
          ...dialogRef.current.querySelectorAll(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        ];
        if (!controls.length) return;
        const first = controls[0];
        const last = controls.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onClose, onIndexChange]);

  if (!images.length) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen gallery"
    >
      <button
        ref={closeRef}
        type="button"
        className={styles.close}
        onClick={onClose}
        aria-label="Close Lightbox"
      >
        <X size={28} />
      </button>

      <button
        type="button"
        className={`${styles.arrow} ${styles.left}`}
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((activeIndex - 1 + images.length) % images.length);
        }}
        aria-label="Previous Image"
      >
        <CaretLeft size={36} />
      </button>

      <div className={styles.imageWrapper} onClick={(e) => e.stopPropagation()}>
        <img
          src={images[activeIndex]?.src}
          alt={images[activeIndex]?.label}
          className={styles.image}
        />
        <span className={styles.index}>
          {activeIndex + 1} / {images.length}: {images[activeIndex]?.label}
        </span>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.right}`}
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((activeIndex + 1) % images.length);
        }}
        aria-label="Next Image"
      >
        <CaretRight size={36} />
      </button>
    </div>,
    document.body,
  );
}
