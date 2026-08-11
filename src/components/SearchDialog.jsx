import {
  ArrowRight,
  ClockCounterClockwise,
  MagnifyingGlass,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { featuredProducts, productCategories } from "../data/siteData.js";
import { PROJECTS, searchProducts } from "../data/discoveryData.js";
import { useLanguage } from "../context/LanguageContext.jsx";
import { trackEngagement } from "../lib/engagementAnalytics.js";

const RECENT_KEY = "fakhri-recent-searches";

function readRecent() {
  if (typeof localStorage === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]").slice(0, 5);
  } catch {
    return [];
  }
}

export default function SearchDialog({ open, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(readRecent);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return featuredProducts.slice(0, 6);
    return searchProducts(featuredProducts, query).slice(0, 8).map(({ product }) => product);
  }, [query]);

  const projectSuggestions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return PROJECTS.slice(0, 4);
    return PROJECTS.filter((project) => `${project.name} ${project.description}`.toLocaleLowerCase().includes(normalized)).slice(0, 4);
  }, [query]);

  useEffect(() => setActiveIndex(-1), [query, open]);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    document.body.classList.add("dialog-lock");
    window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") { onClose(); return; }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("dialog-lock");
      previousFocus?.focus?.();
    };
  }, [open, onClose]);

  const remember = (value) => {
    const clean = value.trim();
    if (!clean) return;
    const next = [clean, ...recent.filter((item) => item !== clean)].slice(0, 5);
    setRecent(next);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* optional */ }
  };

  const clearRecent = () => {
    setRecent([]);
    try { localStorage.removeItem(RECENT_KEY); } catch { /* optional */ }
  };

  const closeWithSearch = () => {
    remember(query);
    trackEngagement("search_used", { queryType: "global", source: "search-dialog" });
    onClose();
  };

  const submitSearch = () => {
    remember(query);
    const target = activeIndex >= 0 ? results[activeIndex] : null;
    trackEngagement("search_used", { queryType: target ? "global-product" : "global-free-text", source: "search-dialog" });
    onClose();
    if (target) { navigate(`/products/${target.slug}`); return; }
    navigate(query.trim() ? `/products?q=${encodeURIComponent(query.trim())}&sort=relevance` : "/products");
  };

  const onInputKeyDown = (event) => {
    if (event.key === "ArrowDown" && results.length) { event.preventDefault(); setActiveIndex((value) => (value + 1) % results.length); }
    else if (event.key === "ArrowUp" && results.length) { event.preventDefault(); setActiveIndex((value) => (value <= 0 ? results.length - 1 : value - 1)); }
    else if (event.key === "Enter") { event.preventDefault(); submitSearch(); }
  };

  return (
    <div className={`search-dialog-backdrop ${open ? "is-open" : ""}`} onMouseDown={onClose} aria-hidden={!open}>
      <section ref={panelRef} className="search-dialog" role="dialog" aria-modal={open ? "true" : undefined} aria-labelledby="catalogue-search-title" inert={!open} onMouseDown={(event) => event.stopPropagation()}>
        <div className="search-dialog-heading">
          <div><p className="eyebrow">Material finder</p><h2 id="catalogue-search-title">{t("search")}</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t("close")}><X size={22} /></button>
        </div>

        <label className="command-search">
          <span className="sr-only">{t("search")}</span>
          <MagnifyingGlass size={21} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            role="combobox"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Try “yarn for baby blanket” or “crochet bag”"
            autoComplete="off"
            aria-autocomplete="list"
            aria-controls="catalogue-search-results"
            aria-expanded={open && results.length > 0}
            aria-activedescendant={activeIndex >= 0 ? `search-result-${results[activeIndex]?.slug}` : undefined}
          />
          <kbd>Esc</kbd>
        </label>

        {!query && recent.length > 0 ? (
          <div className="recent-searches" aria-label="Recent searches">
            <span><ClockCounterClockwise size={16} /> Recent</span>
            {recent.map((item) => <button key={item} type="button" onClick={() => setQuery(item)}>{item}</button>)}
            <button className="recent-searches__clear" type="button" onClick={clearRecent}>Clear</button>
          </div>
        ) : null}

        {projectSuggestions.length ? (
          <div className="search-project-suggestions" aria-label="Project shortcuts">
            <span><Sparkle size={15} /> Shop by project</span>
            <div>
              {projectSuggestions.map((project) => (
                <Link key={project.slug} to={`/products?project=${encodeURIComponent(project.slug)}&sort=relevance`} onClick={() => { trackEngagement("project_selected", { project: project.slug, source: "search-dialog" }); onClose(); }}>
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="search-dialog-body">
          <div className="search-results-heading">
            <span>{query ? `${results.length} relevant matches` : "Suggested materials"}</span>
            <Link to={query ? `/products?q=${encodeURIComponent(query)}&sort=relevance` : "/products"} onClick={closeWithSearch}>Full catalogue <ArrowRight size={15} /></Link>
          </div>

          {results.length > 0 ? (
            <ul className="search-result-list" id="catalogue-search-results" role="listbox">
              {results.map((product, resultIndex) => (
                <li key={product.slug} id={`search-result-${product.slug}`} className={resultIndex === activeIndex ? "is-keyboard-active" : ""} role="option" aria-selected={resultIndex === activeIndex}>
                  <Link to={`/products/${product.slug}`} onClick={closeWithSearch} onMouseEnter={() => setActiveIndex(resultIndex)}>
                    <img src={product.image} alt="" width="72" height="72" loading="lazy" decoding="async" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.brand || product.category} · {product.masterCategory}</small>
                      <em>{product.colors?.length ? `${product.colors.length} representative shades` : "Ask for current shades"}</em>
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty" role="status"><span className="thread-knot" aria-hidden="true" /><h3>No confident material match for “{query}”</h3><p>Try what you are making—such as “baby blanket”, “bag” or “macrame decor”—or open the guided material finder.</p><Link className="btn btn-outline btn-small" to="/yarn-guide" onClick={onClose}>Open guided finder</Link></div>
          )}
        </div>

        <div className="search-category-strip" aria-label="Suggested categories">
          {productCategories.slice(0, 6).map((category) => <Link key={category.name} to={`/products?category=${encodeURIComponent(category.name)}`} onClick={onClose}>{category.shortName}</Link>)}
        </div>
      </section>
    </div>
  );
}
