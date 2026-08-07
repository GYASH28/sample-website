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

const MEDIA_SELECTOR = [
  "#main-content figure",
  "#main-content .catalogue-hero-photo",
  "#main-content .product-card-media",
  "#main-content .store-location__map",
].join(",");

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function elementProgress(element, viewportHeight) {
  const rect = element.getBoundingClientRect();
  return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
}

function uniqueElements(selector) {
  return [...document.querySelectorAll(selector)].filter(
    (element, index, collection) =>
      element instanceof HTMLElement && collection.indexOf(element) === index,
  );
}

export default function ScrollDirector() {
  const { pathname } = useLocation();
  const frameRef = useRef(0);
  const pointerFrameRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reducedQuery.matches) {
      root.style.setProperty("--page-scroll", "1");
      root.style.setProperty("--thread-offset", "0");
      root.style.setProperty("--scroll-percent", "100%");
      return undefined;
    }

    const activeScenes = new Set();
    const activeMedia = new Set();
    const markedElements = new Set();
    const profile = root.dataset.motionProfile;
    const intensity = profile === "lite" ? 0 : profile === "compact" ? 0.42 : 0.78;
    const allowPointerLight = profile === "full" && finePointerQuery.matches;
    let collectionTimers = [];
    let lastPointerX = 0;
    let lastPointerY = 0;

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          element.classList.add("is-scroll-revealed");
          observer.unobserve(element);
        });
      },
      { rootMargin: "0px 0px -7% 0px", threshold: 0.08 },
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target;
          const scene = target.dataset.scrollScene === "true";
          const media = target.dataset.scrollMedia === "true";

          if (scene) {
            if (entry.isIntersecting) activeScenes.add(target);
            else activeScenes.delete(target);
          }
          if (media) {
            if (entry.isIntersecting) activeMedia.add(target);
            else activeMedia.delete(target);
          }
        });
      },
      { rootMargin: "18% 0px 18% 0px", threshold: 0 },
    );

    const prepareReveal = (element, index = 0) => {
      if (element.dataset.scrollPrepared === "true") return;
      element.dataset.scrollPrepared = "true";
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 42}ms`);
      markedElements.add(element);

      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86) {
        element.classList.add("is-scroll-revealed");
      } else {
        revealObserver.observe(element);
      }
    };

    const markElements = () => {
      const scenes = uniqueElements(SCENE_SELECTOR);
      const cards = uniqueElements(CARD_SELECTOR);
      const media = uniqueElements(MEDIA_SELECTOR).filter(
        (element) => !element.closest("[data-scroll-media='false']"),
      );

      scenes.forEach((element, index) => {
        if (element.dataset.scrollScene !== "true") {
          element.dataset.scrollScene = "true";
          markedElements.add(element);
          activeObserver.observe(element);
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

      media.forEach((element) => {
        if (element.dataset.scrollMedia !== "true") {
          element.dataset.scrollMedia = "true";
          markedElements.add(element);
          activeObserver.observe(element);
        }
      });
    };

    const update = () => {
      frameRef.current = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = clamp(window.scrollY / scrollable);

      root.style.setProperty("--page-scroll", pageProgress.toFixed(5));
      root.style.setProperty("--thread-offset", (1 - pageProgress).toFixed(5));
      root.style.setProperty("--scroll-percent", `${(pageProgress * 100).toFixed(3)}%`);

      if (intensity === 0) return;

      activeScenes.forEach((element) => {
        const progress = elementProgress(element, viewportHeight);
        const shift = (0.5 - progress) * 16 * intensity;
        element.style.setProperty("--scene-progress", progress.toFixed(4));
        element.style.setProperty("--scene-shift", `${shift.toFixed(2)}px`);
        element.style.setProperty("--scene-line", clamp(progress * 1.32).toFixed(4));
      });

      activeMedia.forEach((element) => {
        const progress = elementProgress(element, viewportHeight);
        const shift = (0.5 - progress) * 8 * intensity;
        const scale = 1 + Math.abs(0.5 - progress) * 0.018 * intensity;
        element.style.setProperty("--scroll-media-scale", scale.toFixed(4));
        element.style.setProperty("--scroll-media-shift", `${shift.toFixed(2)}px`);
      });
    };

    const scheduleUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    const collectAndUpdate = () => {
      markElements();
      scheduleUpdate();
    };

    const handlePointerMove = (event) => {
      if (!allowPointerLight) return;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      if (pointerFrameRef.current) return;
      pointerFrameRef.current = window.requestAnimationFrame(() => {
        pointerFrameRef.current = 0;
        root.style.setProperty("--pointer-x", `${lastPointerX}px`);
        root.style.setProperty("--pointer-y", `${lastPointerY}px`);
      });
    };

    collectAndUpdate();
    collectionTimers = [120, 520].map((delay) =>
      window.setTimeout(collectAndUpdate, delay),
    );

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", collectAndUpdate, { passive: true });
    if (allowPointerLight) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (pointerFrameRef.current) window.cancelAnimationFrame(pointerFrameRef.current);
      collectionTimers.forEach((timer) => window.clearTimeout(timer));
      revealObserver.disconnect();
      activeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", collectAndUpdate);
      if (allowPointerLight) window.removeEventListener("pointermove", handlePointerMove);

      markedElements.forEach((element) => {
        delete element.dataset.scrollScene;
        delete element.dataset.scrollCard;
        delete element.dataset.scrollMedia;
        delete element.dataset.scrollPrepared;
        element.classList.remove("is-scroll-revealed");
        element.style.removeProperty("--reveal-delay");
        element.style.removeProperty("--scene-progress");
        element.style.removeProperty("--scene-shift");
        element.style.removeProperty("--scene-line");
        element.style.removeProperty("--scroll-media-scale");
        element.style.removeProperty("--scroll-media-shift");
      });
    };
  }, [pathname]);

  return (
    <div className="scroll-director" aria-hidden="true">
      <span className="scroll-director__aurora" />
      <span className="scroll-director__rail">
        <i />
      </span>
      <svg
        className="scroll-director__thread"
        viewBox="0 0 72 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M38 0 C8 128 66 236 32 360 C4 470 69 585 35 710 C15 790 57 880 32 1000"
          pathLength="1"
        />
      </svg>
      <span className="scroll-director__needle" />
    </div>
  );
}
