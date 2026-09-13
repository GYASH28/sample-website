import { useEffect, useRef, useState } from "react";

// Browser lazy-loading sees a horizontal rail as one visible row and can fetch
// every card in it. This tiny observer is two-dimensional: a native-resolution
// photo begins downloading only when its own card is close to the viewport.
export default function NativeProductImage({ src, alt, width, height, className = "", onError }) {
  const hostRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
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
  }, [src]);

  return (
    <span ref={hostRef} className="native-product-image-shell" style={{ "--native-image-ratio": `${width} / ${height}` }}>
      {shouldLoad ? (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className={className}
          onError={onError}
        />
      ) : <span className="native-product-image-shell__placeholder" aria-hidden="true" />}
    </span>
  );
}
