import { useEffect } from "react";

const FADE_DISTANCE = 96;
const DEEP_SCROLL = 180;
const DIRECTION_THRESHOLD = 6;

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return undefined;

    let frame = 0;
    let lastY = Math.max(0, window.scrollY);

    const render = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const progress = Math.min(1, y / FADE_DISTANCE);
      const delta = y - lastY;

      header.style.setProperty("--header-fade-progress", progress.toFixed(3));
      header.classList.toggle("is-scrolled", y > 28);
      header.classList.toggle("is-deep", y > DEEP_SCROLL);

      if (Math.abs(delta) >= DIRECTION_THRESHOLD) {
        header.dataset.scrollDirection = delta > 0 ? "down" : "up";
      }

      if (y < 12) header.dataset.scrollDirection = "top";
      lastY = y;
    };

    const update = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (frame) window.cancelAnimationFrame(frame);
      header.classList.remove("is-scrolled", "is-deep");
      header.removeAttribute("data-scroll-direction");
      header.style.removeProperty("--header-fade-progress");
    };
  }, []);

  return null;
}
