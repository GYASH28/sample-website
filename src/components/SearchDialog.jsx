import {
  ArrowRight,
  ClockCounterClockwise,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts, productCategories } from "../data/siteData.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const RECENT_KEY = "fakhri-recent-searches";

function searchableText(product) {
  return [
    product.name,
    product.category,
    product.brand,
    product.type,
    product.masterCategory,
    product.material,
    product.suitableFor,
    ...(product.tags || []),
    ...(product.filters || []),
    ...(product.colors || []).map((shade) => shade.name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

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
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(readRecent);
  const inputRef = useRef(null);
  const panelRef = useRef(null);

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return featuredProducts.slice(0, 6);
    return featuredProducts
      .filter((product) => searchableText(product).includes(normalized))
      .slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    document.body.classList.add("dialog-lock");
    window.requestAnimationFrame(() => inputRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const closeWithSearch = () => {
    remember(query);
    onClose();
  };

  return (
    <div
      className={`search-dialog-backdrop ${open ? "is-open" : ""}`}
      onMouseDown={onClose}
      aria-hidden={!open}
    >
      <section
        ref={panelRef}
        className="search-dialog"
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-labelledby="catalogue-search-title"
        inert={!open}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="search-dialog-heading">
          <div>
            <p className="eyebrow">Material finder</p>
            <h2 id="catalogue-search-title">{t("search")}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label={t("close")}>
            <X size={22} />
          </button>
        </div>

        <label className="command-search">
          <span className="sr-only">{t("search")}</span>
          <MagnifyingGlass size={21} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchHint")}
            autoComplete="off"
          />
          <kbd>Esc</kbd>
        </label>

        {!query && recent.length > 0 && (
          <div className="recent-searches" aria-label="Recent searches">
            <span><ClockCounterClockwise size={16} /> Recent</span>
            {recent.map((item) => (
              <button key={item} type="button" onClick={() => setQuery(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        <div className="search-dialog-body">
          <div className="search-results-heading">
            <span>{query ? `${results.length} matches` : "Suggested materials"}</span>
            <Link
              to={query ? `/products?q=${encodeURIComponent(query)}` : "/products"}
              onClick={closeWithSearch}
            >
              Full catalogue <ArrowRight size={15} />
            </Link>
          </div>

          {results.length > 0 ? (
            <ul className="search-result-list">
              {results.map((product) => (
                <li key={product.slug}>
                  <Link to={`/products/${product.slug}`} onClick={closeWithSearch}>
                    <img src={product.image} alt="" width="72" height="72" />
                    <span>
                      <strong>{product.name}</strong>
                      <small>{product.brand || product.category} · {product.masterCategory}</small>
                      <em>{product.colors?.length || 0} shade options</em>
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-empty" role="status">
              <span className="thread-knot" aria-hidden="true" />
              <h3>No material found for “{query}”</h3>
              <p>Try a craft such as crochet, macrame or embroidery, or ask us on WhatsApp.</p>
            </div>
          )}
        </div>

        <div className="search-category-strip" aria-label="Suggested categories">
          {productCategories.slice(0, 6).map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              onClick={onClose}
            >
              {category.shortName}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
