import { useEffect, useRef, useState } from "react";

// ─── Shared single IntersectionObserver ───
// All Reveal instances register with this one observer instead of each
// creating their own. Cuts dozens of observer instances down to one.
const callbacks = new Map();

let sharedObserver = null;

function getObserver() {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const cb = callbacks.get(entry.target);
          if (cb) cb();
          callbacks.delete(entry.target);
          sharedObserver.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px 160px 0px", threshold: 0.08 },
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = getObserver();
    callbacks.set(element, () => setVisible(true));
    observer.observe(element);

    return () => {
      callbacks.delete(element);
      observer.unobserve(element);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
