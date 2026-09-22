import { useEffect, useRef, useState } from "react";

const formatValue = (value) => new Intl.NumberFormat("en-IN").format(value);

export default function AnimatedNumber({ value, duration = 760, className = "" }) {
  const numericValue = typeof value === "number" ? value : Number(value);
  const isNumeric = Number.isFinite(numericValue);
  const hostRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric) {
      setDisplayValue(value);
      return undefined;
    }

    const host = hostRef.current;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!host || reducedMotion || typeof IntersectionObserver === "undefined") {
      setDisplayValue(numericValue);
      return undefined;
    }

    let animationFrame = 0;
    let startedAt = 0;
    const animate = (timestamp) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(numericValue * eased));
      if (progress < 1) animationFrame = window.requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animationFrame = window.requestAnimationFrame(animate);
      observer.disconnect();
    }, { rootMargin: "80px", threshold: 0.2 });

    observer.observe(host);
    return () => {
      observer.disconnect();
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [duration, isNumeric, numericValue, value]);

  if (!isNumeric) return <span className={className}>{value}</span>;

  return (
    <span ref={hostRef} className={`animated-number ${className}`.trim()}>
      <span aria-hidden="true">{formatValue(displayValue)}</span>
      <span className="sr-only">{formatValue(numericValue)}</span>
    </span>
  );
}
