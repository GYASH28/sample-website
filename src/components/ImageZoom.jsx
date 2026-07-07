import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

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
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onIndexChange((activeIndex - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onIndexChange((activeIndex + 1) % images.length);
    };
    window.addEventListener("keydown", handleKeyDown);
    // Lock body scroll while lightbox is open
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, images.length, onClose, onIndexChange]);

  if (!images.length) return null;

  return (
    <div
      className="lightbox-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Fullscreen Gallery"
    >
      <button
        type="button"
        className="lightbox-close-btn"
        onClick={onClose}
        aria-label="Close Lightbox"
      >
        <X size={28} />
      </button>

      <button
        type="button"
        className="lightbox-arrow-btn left"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((activeIndex - 1 + images.length) % images.length);
        }}
        aria-label="Previous Image"
      >
        <ChevronLeft size={36} />
      </button>

      <div className="lightbox-image-wrapper" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[activeIndex]?.src}
          alt={images[activeIndex]?.label}
          className="lightbox-active-img"
        />
        <span className="lightbox-index-label">
          {activeIndex + 1} / {images.length} — {images[activeIndex]?.label}
        </span>
      </div>

      <button
        type="button"
        className="lightbox-arrow-btn right"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((activeIndex + 1) % images.length);
        }}
        aria-label="Next Image"
      >
        <ChevronRight size={36} />
      </button>
    </div>
  );
}
