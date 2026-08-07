import { useEffect, useRef } from "react";

const callbacks = new Map();
let sharedObserver = null;

function getObserver() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const callback = callbacks.get(entry.target);
        callback?.();
        callbacks.delete(entry.target);
        sharedObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px 70px 0px", threshold: 0.07 },
  );
  return sharedObserver;
}

export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  variant = "fade-up",
  children,
}) {
  const ref = useRef(null);
  const cappedDelay = Math.min(Math.max(Number(delay) || 0, 0), 220);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const reveal = () => element.classList.add("is-visible");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      reveal();
      return undefined;
    }

    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      reveal();
      return undefined;
    }

    const observer = getObserver();
    callbacks.set(element, reveal);
    observer.observe(element);

    return () => {
      callbacks.delete(element);
      observer.unobserve(element);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${className}`}
      data-reveal={variant}
      style={{ "--reveal-delay": `${cappedDelay}ms` }}
    >
      {children}
    </Tag>
  );
}
