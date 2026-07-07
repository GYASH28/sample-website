import { useState, useRef, useEffect } from "react";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * ImageZoom — hover-to-zoom magnifier on desktop, tap-to-fullscreen on mobile.
 * Pure CSS + one event handler. No library.
 *
 * Props:
 *  - src: image URL
 *  - alt: alt text
 *  - zoom: zoom factor (default 2.5x)
 */
export default function ImageZoom({ src, alt, zoom = 2.5 }) {
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);

  function handleMove(e) {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x, y });
  }

  function handleEnter() {
    // Only enable zoom on devices with fine pointer (desktop)
    if (window.matchMedia("(pointer: fine)").matches) {
      setIsZooming(true);
    }
  }

  function handleLeave() {
    setIsZooming(false);
  }

  return (
    <div
      className="image-zoom-container"
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: isZooming ? "zoom-in" : "default",
        borderRadius: "var(--radius-lg, 14px)",
        background: "var(--bg-warm)",
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transform: isZooming ? `scale(${zoom})` : "scale(1)",
          transformOrigin: `${lensPos.x}% ${lensPos.y}%`,
          transition: "transform var(--duration-quick) var(--ease-soft)",
        }}
      />

      {/* Zoom hint badge — shows on hover */}
      {!isZooming && (
        <div
          className="zoom-hint"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            padding: "4px 10px",
            background: "rgba(31, 27, 22, 0.7)",
            color: "#fff",
            borderRadius: "var(--radius-pill, 999px)",
            fontSize: "0.72rem",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            pointerEvents: "none",
            opacity: 0,
            transition: "opacity var(--duration-quick) var(--ease-soft)",
          }}
        >
          <ZoomIn size={12} aria-hidden="true" />
          Hover to zoom
        </div>
      )}

      {/* Show zoom hint on initial hover */}
      <div
        className="zoom-hint-show"
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          padding: "4px 10px",
          background: "rgba(31, 27, 22, 0.7)",
          color: "#fff",
          borderRadius: "var(--radius-pill, 999px)",
          fontSize: "0.72rem",
          fontWeight: 500,
          display: isZooming ? "none" : "inline-flex",
          alignItems: "center",
          gap: "4px",
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        <ZoomIn size={12} aria-hidden="true" />
        Hover to zoom
      </div>
    </div>
  );
}

/**
 * Lightbox — fullscreen image gallery modal with prev/next navigation and keyboard support.
 * Extracted from ProductDetail.jsx (A1 fix — was inline 50-line implementation).
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
