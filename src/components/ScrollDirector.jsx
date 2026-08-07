import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SCENE_SELECTOR = [
  "#main-content section",
  "#main-content article",
  "#main-content .page-hero",
].join(",");

const CARD_SELECTOR = [
  "#main-content .product-card",
  "#main-content .category-card",
  "#main-content .blog-story-card",
  "#main-content .contact-card",
  "#main-content .gallery-editorial-grid figure",
  "#main-content .store-location",
  "#main-content .yarn-guide-project",
].join(",");

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function uniqueElements(selector) {
  return [...document.querySelectorAll(selector)].filter(
    (element, index, collection) =>
      element instanceof HTMLElement && collection.indexOf(element) === index,
  );
}

export default function ScrollDirector() {
  const { pathname } = useLocation();
  const frameRef = useRef(0);
  const progressRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const markedElements = new Set();
    let collectionTimers = [];

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-scroll-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );

    const prepareReveal = (element, index = 0) => {
      if (element.dataset.scrollPrepared === "true") return;
      element.dataset.scrollPrepared = "true";
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 42}ms`);
      markedElements.add(element);

      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86 || reducedQuery.matches) {
        element.classList.add("is-scroll-revealed");
      } else {
        revealObserver.observe(element);
      }
    };

    const markElements = () => {
      const scenes = uniqueElements(SCENE_SELECTOR);
      const cards = uniqueElements(CARD_SELECTOR);

      scenes.forEach((element, index) => {
        if (element.dataset.scrollScene !== "true") {
          element.dataset.scrollScene = "true";
          markedElements.add(element);
        }
        if (index > 0) prepareReveal(element, index);
        else element.classList.add("is-scroll-revealed");
      });

      cards.forEach((element, index) => {
        if (element.dataset.scrollCard !== "true") {
          element.dataset.scrollCard = "true";
          markedElements.add(element);
        }
        prepareReveal(element, index);
      });
    };

    const updateProgress = () => {
      frameRef.current = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(root.scrollHeight - viewportHeight, 1);
      const progress = clamp(window.scrollY / scrollable);

      root.style.setProperty("--page-scroll", progress.toFixed(5));
      root.style.setProperty("--scroll-liquid-y", `${(progress * 142).toFixed(2)}px`);
      progressRef.current?.classList.toggle("is-active", window.scrollY > 18 && scrollable > 80);
    };

    const scheduleProgress = () => {
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(updateProgress);
    };

    markElements();
    updateProgress();
    collectionTimers = [120, 520].map((delay) => window.setTimeout(markElements, delay));

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      collectionTimers.forEach((timer) => window.clearTimeout(timer));
      revealObserver.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", scheduleProgress);

      markedElements.forEach((element) => {
        delete element.dataset.scrollScene;
        delete element.dataset.scrollCard;
        delete element.dataset.scrollPrepared;
        element.classList.remove("is-scroll-revealed");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [pathname]);

  return (
    <div className="scroll-director" aria-hidden="true">
      <div ref={progressRef} className="scroll-liquid-progress">
        <span className="scroll-liquid-progress__glass" />
        <span className="scroll-liquid-progress__track">
          <i className="scroll-liquid-progress__fill" />
          <b className="scroll-liquid-progress__bead" />
        </span>
        <span className="scroll-liquid-progress__ticks">
          <i />
          <i />
          <i />
        </span>
      </div>
    </div>
  );
}
