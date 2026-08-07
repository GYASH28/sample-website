import { useEffect } from "react";

export default function HeaderEnhancer() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    if (!header) return undefined;

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        header.classList.toggle("is-scrolled", window.scrollY > 36);
        frame = 0;
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) cancelAnimationFrame(frame);
      header.classList.remove("is-scrolled");
    };
  }, []);

  return null;
}
