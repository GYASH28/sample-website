import { useLayoutEffect, useMemo, useRef } from "react";

const FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function useFlipList(itemKeys) {
  const containerRef = useRef(null);
  const previousRectsRef = useRef(new Map());
  const signature = useMemo(() => itemKeys.join("|"), [itemKeys]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const elements = [
      ...container.querySelectorAll("[data-product-key]"),
    ];
    const currentRects = new Map();

    // Read every final position before starting any animation.
    for (const element of elements) {
      currentRects.set(element.dataset.productKey, element.getBoundingClientRect());
    }

    const previousRects = previousRectsRef.current;
    const motionProfile = document.documentElement.dataset.motionProfile;
    const focusIsInside = container.contains(document.activeElement);
    const animations = [];

    if (
      previousRects.size &&
      motionProfile !== "reduced" &&
      motionProfile !== "lite" &&
      !focusIsInside
    ) {
      // All layout reads are complete; only compositor writes happen below.
      for (const element of elements) {
        const key = element.dataset.productKey;
        const previous = previousRects.get(key);
        const current = currentRects.get(key);

        if (!previous) {
          animations.push(
            element.animate(
              [
                { opacity: 0, transform: "translateY(6px)" },
                { opacity: 1, transform: "none" },
              ],
              { duration: 220, easing: FLIP_EASING },
            ),
          );
          continue;
        }

        const deltaX = previous.left - current.left;
        const deltaY = previous.top - current.top;
        if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) continue;

        animations.push(
          element.animate(
            [
              { transform: `translate(${deltaX}px, ${deltaY}px)` },
              { transform: "none" },
            ],
            { duration: 300, easing: FLIP_EASING },
          ),
        );
      }
    }

    previousRectsRef.current = currentRects;
    return () => animations.forEach((animation) => animation.cancel());
  }, [signature]);

  return containerRef;
}
