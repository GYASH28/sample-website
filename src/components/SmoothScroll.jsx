import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "../motion-tokens.js";

/**
 * SmoothScroll — wraps the app in a Lenis smooth-scroll context.
 * Disabled when prefers-reduced-motion is set.
 *
 * Place this once near the root of the app (e.g. in Layout).
 */
export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // touch uses native scroll
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return children;
}
