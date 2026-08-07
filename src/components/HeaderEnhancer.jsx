import { useEffect } from "react";

const MORPH_DISTANCE = 96;

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    const announcement = header?.querySelector(".announcement-bar");
    if (!header) return undefined;

    let frame = 0;
    let announcementHeight = 34;
    let lastProgress = -1;
    let lastShift = -1;

    const measure = () => {
      // Measure only on mount/resize, never in the scroll path.
      announcementHeight = announcement?.getBoundingClientRect().height || 34;
    };

    const render = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const progress = Math.min(1, y / MORPH_DISTANCE);
      const shift = progress * announcementHeight;

      if (Math.abs(progress - lastProgress) > 0.001) {
        const glassAlpha = 0.5 + progress * 0.1;
        const edgeAlpha = 0.48 + progress * 0.18;
        const shadowAlpha = 0.07 + progress * 0.045;

        header.style.setProperty("--header-morph", progress.toFixed(4));
        header.style.setProperty("--header-announcement-opacity", (1 - progress).toFixed(4));
        header.style.setProperty("--header-glass-alpha", glassAlpha.toFixed(3));
        header.style.setProperty("--header-edge-alpha", edgeAlpha.toFixed(3));
        header.style.setProperty("--header-shadow-alpha", shadowAlpha.toFixed(3));
        lastProgress = progress;
      }

      if (Math.abs(shift - lastShift) > 0.05) {
        // Store the final signed transform value so CSS does not depend on
        // multiplication syntax that is less reliable in older Safari builds.
        header.style.setProperty("--header-shift", `${(-shift).toFixed(2)}px`);
        lastShift = shift;
      }
    };

    const requestRender = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };

    const onResize = () => {
      measure();
      requestRender();
    };

    measure();
    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", onResize);
      if (frame) window.cancelAnimationFrame(frame);
      header.style.removeProperty("--header-morph");
      header.style.removeProperty("--header-announcement-opacity");
      header.style.removeProperty("--header-glass-alpha");
      header.style.removeProperty("--header-edge-alpha");
      header.style.removeProperty("--header-shadow-alpha");
      header.style.removeProperty("--header-shift");
      header.classList.remove("is-scrolled", "is-deep", "is-scrolling");
    };
  }, []);

  return null;
}
