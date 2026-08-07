import { useEffect } from "react";

const SCROLLED_THRESHOLD = 28;
const DEEP_SCROLL = 180;
const IDLE_DELAY = 140;

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return undefined;

    let frame = 0;
    let idleTimer = 0;
    let scrolled = null;
    let deep = null;

    const render = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const nextScrolled = y > SCROLLED_THRESHOLD;
      const nextDeep = y > DEEP_SCROLL;

      if (nextScrolled !== scrolled) {
        header.classList.toggle("is-scrolled", nextScrolled);
        scrolled = nextScrolled;
      }

      if (nextDeep !== deep) {
        header.classList.toggle("is-deep", nextDeep);
        deep = nextDeep;
      }
    };

    const onScroll = () => {
      if (!header.classList.contains("is-scrolling")) header.classList.add("is-scrolling");
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        header.classList.remove("is-scrolling");
        idleTimer = 0;
      }, IDLE_DELAY);

      if (!frame) frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
      if (idleTimer) window.clearTimeout(idleTimer);
      header.classList.remove("is-scrolled", "is-deep", "is-scrolling");
    };
  }, []);

  return null;
}
