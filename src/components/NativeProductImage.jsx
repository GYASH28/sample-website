import { useEffect, useRef, useState } from "react";
import { getCardOptimizedImage } from "../lib/productImage.js";

// Browser lazy-loading sees a horizontal rail as one visible row and can fetch
// every card in it. This tiny observer is two-dimensional: a native-resolution
// photo begins downloading only when its own card is close to the viewport.
export default function NativeProductImage({ src, alt, width, height, className = "", onError, priority = false }) {
  const hostRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(priority);

  useEffect(() => {
    if (priority) {
      setShouldLoad(Boolean(src));
      return undefined;
    }
    setShouldLoad(false);
    const host = hostRef.current;
    if (!host || !src || typeof IntersectionObserver === "undefined") {
      setShouldLoad(Boolean(src));
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: "180px" },
    );
    observer.observe(host);
    return () => observer.disconnect();
  }, [priority, src]);

  return (
    <span ref={hostRef} className="native-product-image-shell" style={{ "--native-image-ratio": `${width} / ${height}` }}>
      {shouldLoad ? (
        <img
          src={getCardOptimizedImage(src)}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "low"}
          className={className}
          onError={onError}
        />
      ) : <span className="native-product-image-shell__placeholder" aria-hidden="true" />}
    </span>
  );
}
