import { useEffect, useRef, useState } from "react";

// Keeps the full catalogue experience available, while avoiding a page-long DOM,
// image decode queue and observer list before a customer is anywhere near it.
export default function DeferredSection({ children, label = "More from Fakhri Mart", minHeight = 520 }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setReady(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setReady(true);
        observer.disconnect();
      },
      // A short runway feels instant when scrolling, without hydrating every
      // rail in one fling on slower CPUs.
      { rootMargin: "360px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`deferred-section ${ready ? "is-ready" : ""}`} style={{ "--deferred-height": `${minHeight}px` }}>
      {ready ? children : <div className="deferred-section__placeholder" aria-label={label} role="status"><span /><span /><span /></div>}
    </div>
  );
}
