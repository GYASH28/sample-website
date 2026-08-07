import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowsDownUp,
  ListBullets,
  MagnifyingGlass,
  Question,
  SlidersHorizontal,
  SquaresFour,
  X,
  XCircle,
} from "@phosphor-icons/react";
import CatalogueCta from "../components/CatalogueCta.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  featuredProducts,
  MASTER_CATEGORIES,
  newArrivals,
  productCategories,
} from "../data/siteData.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { useFlipList } from "../hooks/useFlipList.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const PRODUCT_TYPES = [
  { label: "All types", value: "All" },
  { label: "Yarn balls", value: "yarn-ball" },
  { label: "Cotton threads", value: "cotton-thread" },
  { label: "Crochet threads", value: "crochet-thread" },
  { label: "Macrame cords", value: "macrame-cord" },
  { label: "Embroidery floss", value: "embroidery-floss" },
  { label: "Crochet hooks", value: "hook" },
  { label: "Purse handles", value: "purse-handle" },
];

const USE_CASES = [
  "All",
  "Crochet",
  "Knitting",
  "Embroidery",
  "Macrame",
  "Bag Making",
  "Beginner Friendly",
];

const SORT_OPTIONS = new Set(["featured", "name-asc", "category-asc", "newest"]);
const VIEW_OPTIONS = new Set(["grid", "list"]);
const POPULAR_SEARCHES = ["Yarn", "Macrame", "Hook", "Cotton", "Soft", "Embroidery"];

function readViewPreference(searchParams) {
  const fromUrl = searchParams.get("view");
  if (VIEW_OPTIONS.has(fromUrl)) return fromUrl;
  try {
    const stored = localStorage.getItem("fakhri_catalogue_view");
    return VIEW_OPTIONS.has(stored) ? stored : "grid";
  } catch {
    return "grid";
  }
}

function getParamOrAll(searchParams, key, allowedValues) {
  const value = searchParams.get(key);
  return value && allowedValues.has(value) ? value : "All";
}

function searchableProductText(product) {
  return [
    product.name,
    product.category,
    product.brand,
    product.type,
    product.masterCategory,
    product.suitableFor,
    ...(product.colors || []).map((shade) => shade.name),
    ...(product.filters || []),
    ...(product.tags || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase();
}

export default function Products() {
  useDocumentMeta({
    title: "Products | Fakhri Mart",
    description: "Browse yarns, crochet threads, macrame cords, embroidery supplies and craft accessories from Fakhri Mart.",
    canonical: "/products",
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryNames = useMemo(() => new Set(productCategories.map((category) => category.name)), []);
  const productTypeValues = useMemo(() => new Set(PRODUCT_TYPES.map((type) => type.value)), []);
  const useCaseValues = useMemo(() => new Set(USE_CASES), []);
  const departmentValues = useMemo(() => new Set(["All", ...MASTER_CATEGORIES]), []);

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [activeDepartment, setActiveDepartment] = useState(() => getParamOrAll(searchParams, "department", departmentValues));
  const [activeCategory, setActiveCategory] = useState(() => getParamOrAll(searchParams, "category", new Set(["All", ...categoryNames])));
  const [activeType, setActiveType] = useState(() => getParamOrAll(searchParams, "type", productTypeValues));
  const [activeTag, setActiveTag] = useState(() => getParamOrAll(searchParams, "tag", useCaseValues));
  const [filterHasShades, setFilterHasShades] = useState(() => searchParams.get("shades") === "1");
  const [filterBulkOnly, setFilterBulkOnly] = useState(() => searchParams.get("bulk") === "1");
  const [sortBy, setSortBy] = useState(() => SORT_OPTIONS.has(searchParams.get("sort")) ? searchParams.get("sort") : "featured");
  const [viewMode, setViewMode] = useState(() => readViewPreference(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const filterCloseRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveDepartment(getParamOrAll(searchParams, "department", departmentValues));
    setActiveCategory(getParamOrAll(searchParams, "category", new Set(["All", ...categoryNames])));
    setActiveType(getParamOrAll(searchParams, "type", productTypeValues));
    setActiveTag(getParamOrAll(searchParams, "tag", useCaseValues));
    setFilterHasShades(searchParams.get("shades") === "1");
    setFilterBulkOnly(searchParams.get("bulk") === "1");
    setSortBy(SORT_OPTIONS.has(searchParams.get("sort")) ? searchParams.get("sort") : "featured");
    const requestedView = searchParams.get("view");
    if (VIEW_OPTIONS.has(requestedView)) setViewMode(requestedView);
  }, [searchParams, departmentValues, categoryNames, productTypeValues, useCaseValues]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set("q", searchQuery.trim());
    if (activeDepartment !== "All") next.set("department", activeDepartment);
    if (activeCategory !== "All") next.set("category", activeCategory);
    if (activeType !== "All") next.set("type", activeType);
    if (activeTag !== "All") next.set("tag", activeTag);
    if (filterHasShades) next.set("shades", "1");
    if (filterBulkOnly) next.set("bulk", "1");
    if (sortBy !== "featured") next.set("sort", sortBy);
    if (viewMode !== "grid") next.set("view", viewMode);

    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [
    searchQuery,
    activeDepartment,
    activeCategory,
    activeType,
    activeTag,
    filterHasShades,
    filterBulkOnly,
    sortBy,
    viewMode,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem("fakhri_catalogue_view", viewMode);
    } catch {
      // Preference persistence is optional.
    }
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setSuggestionIndex(-1);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mobileFiltersOpen) return undefined;
    const previousFocus = document.activeElement;
    document.body.classList.add("catalogue-filter-lock");
    window.requestAnimationFrame(() => filterCloseRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileFiltersOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.classList.remove("catalogue-filter-lock");
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [mobileFiltersOpen]);

  const suggestions = useMemo(() => {
    const normalized = searchQuery.trim().toLocaleLowerCase();
    if (!normalized) return [];

    const matches = [];
    productCategories.forEach((category) => {
      if (category.name.toLocaleLowerCase().includes(normalized)) {
        matches.push({ type: "category", value: category.name, display: `Category · ${category.name}` });
      }
    });
    USE_CASES.forEach((tag) => {
      if (tag !== "All" && tag.toLocaleLowerCase().includes(normalized)) {
        matches.push({ type: "tag", value: tag, display: `Craft · ${tag}` });
      }
    });
    featuredProducts.forEach((product) => {
      if (searchableProductText(product).includes(normalized)) {
        matches.push({ type: "product", value: product.slug, display: product.name, meta: product.category });
      }
    });

    return matches.slice(0, 7);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "product") {
      setShowSuggestions(false);
      navigate(`/products/${suggestion.value}`);
      return;
    }

    if (suggestion.type === "category") {
      const matchingProduct = featuredProducts.find((product) => product.category === suggestion.value);
      setActiveDepartment(matchingProduct?.masterCategory || "All");
      setActiveCategory(suggestion.value);
      setActiveType("All");
      setSearchQuery("");
    } else if (suggestion.type === "tag") {
      setActiveTag(suggestion.value);
      setSearchQuery("");
    }

    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
      return;
    }
    if (!showSuggestions || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setSuggestionIndex((value) => (value + 1) % suggestions.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setSuggestionIndex((value) => (value <= 0 ? suggestions.length - 1 : value - 1));
    } else if (event.key === "Enter" && suggestionIndex > -1) {
      event.preventDefault();
      handleSuggestionClick(suggestions[suggestionIndex]);
    }
  };

  const selectDepartment = (department) => {
    setActiveDepartment(department);
    setActiveCategory("All");
    setActiveType("All");
  };

  const filteredProducts = useMemo(() => {
    let result = featuredProducts;

    if (activeDepartment !== "All") {
      result = result.filter((product) => product.masterCategory === activeDepartment);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLocaleLowerCase();
      result = result.filter((product) => searchableProductText(product).includes(query));
    }

    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (activeType !== "All") {
      result = result.filter((product) => product.type === activeType);
    }

    if (activeTag !== "All") {
      result = result.filter((product) => product.tags?.includes(activeTag));
    }

    if (filterHasShades) {
      result = result.filter((product) => product.colors?.length > 0);
    }

    if (filterBulkOnly) {
      result = result.filter((product) => product.tags?.includes("Bulk Orders"));
    }

    return result;
  }, [searchQuery, activeDepartment, activeCategory, activeType, activeTag, filterHasShades, filterBulkOnly]);

  const departmentCounts = useMemo(() => {
    const counts = { All: featuredProducts.length };
    MASTER_CATEGORIES.forEach((department) => {
      counts[department] = featuredProducts.filter((product) => product.masterCategory === department).length;
    });
    return counts;
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category-asc") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "newest") {
      const arrivalIndex = (product) => newArrivals.findIndex((arrival) =>
        arrival.name.toLocaleLowerCase().includes(product.name.toLocaleLowerCase()),
      );
      result.sort((a, b) => {
        const indexA = arrivalIndex(a);
        const indexB = arrivalIndex(b);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }

    return result;
  }, [filteredProducts, sortBy]);

  const resultGridRef = useFlipList(sortedProducts.map((product) => product.slug));
  const recentSlugs = useRecentlyViewed(null);
  const recentlyViewedProducts = useMemo(
    () => recentSlugs
      .map((slug) => featuredProducts.find((product) => product.slug === slug))
      .filter(Boolean)
      .slice(0, 6),
    [recentSlugs],
  );

  const handleResetFilters = () => {
    setActiveDepartment("All");
    setActiveCategory("All");
    setActiveType("All");
    setActiveTag("All");
    setFilterHasShades(false);
    setFilterBulkOnly(false);
    setSearchQuery("");
    setSortBy("featured");
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const hasActiveFilters =
    activeDepartment !== "All" ||
    activeCategory !== "All" ||
    activeType !== "All" ||
    activeTag !== "All" ||
    filterHasShades ||
    filterBulkOnly ||
    Boolean(searchQuery.trim());

  return (
    <>
      <PageHero
        className="catalogue-page-hero"
        motif="weave"
        eyebrow="Products"
        title="Find a material by craft, fibre or finish"
        text="Search the catalogue, refine the results, then ask for current shades and quantity-based price."
      >
        <picture className="catalogue-hero-photo">
          <source srcSet="/assets/images/editorial/shade-library.avif" type="image/avif" />
          <img
            src="/assets/images/editorial/shade-library.webp"
            alt="A curated library of yarn shades and material textures"
            width="1536"
            height="1024"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </PageHero>

      <section className="catalogue-departments" aria-label="Browse departments">
        <div className="container">
          <div className="department-switcher" role="tablist" aria-label="Department">
            {["All", ...MASTER_CATEGORIES].map((department) => {
              const isActive = activeDepartment === department;
              return (
                <button
                  key={department}
                  type="button"
                  className={`department-tab ${isActive ? "active" : ""}`}
                  onClick={() => selectDepartment(department)}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span>{department === "All" ? "All products" : department}</span>
                  <small>{departmentCounts[department] || 0}</small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-tinted catalogue-browser" id="catalogue-browser">
        <div className="container">
          <Reveal className="section-heading catalogue-heading" variant="scale-in">
            <div>
              <p className="eyebrow">Filter catalogue</p>
              <h2>Explore materials without the clutter</h2>
              <p>Search by product, shade, craft or finish, then narrow the list only when you need to.</p>
            </div>
            <span className="catalogue-result-pill" aria-live="polite">
              {sortedProducts.length} {sortedProducts.length === 1 ? "material" : "materials"}
            </span>
          </Reveal>

          <Reveal variant="fade-up" delay={60}>
            <div className="catalogue-controls-row catalogue-controls-sticky">
              <div className="search-box-premium-wrapper" ref={searchContainerRef}>
                <div className="search-box-premium">
                  <MagnifyingGlass size={19} className="search-icon-inside" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Search product, shade, craft or material…"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setShowSuggestions(true);
                      setSuggestionIndex(-1);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Search products"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions && suggestions.length > 0}
                    aria-controls="catalogue-search-suggestions"
                    aria-activedescendant={suggestionIndex > -1 ? `catalogue-suggestion-${suggestionIndex}` : undefined}
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      className="catalogue-search-clear"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      aria-label="Clear catalogue search"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>

                {showSuggestions && suggestions.length > 0 ? (
                  <ul id="catalogue-search-suggestions" className="search-suggestions-dropdown" role="listbox">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={`${suggestion.type}-${suggestion.value}`}
                        id={`catalogue-suggestion-${index}`}
                        role="option"
                        aria-selected={suggestionIndex === index}
                      >
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSuggestionIndex(index)}
                          className={`suggestion-item-btn ${suggestionIndex === index ? "highlighted" : ""}`}
                        >
                          <span>{suggestion.display}</span>
                          {suggestion.meta ? <small>{suggestion.meta}</small> : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <button
                className="mobile-filter-trigger"
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                aria-expanded={mobileFiltersOpen}
                aria-controls="catalogue-filter-sheet"
              >
                <SlidersHorizontal size={18} />
                Filters
                {hasActiveFilters ? <span className="filter-active-dot" aria-label="Active filters" /> : null}
              </button>

              <div className="sorting-controls-wrapper">
                <ArrowsDownUp size={17} className="control-icon-grey" aria-hidden="true" />
                <label htmlFor="product-sort-select" className="sr-only">Sort products</label>
                <select
                  id="product-sort-select"
                  className="product-sort-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="category-asc">Category</option>
                  <option value="newest">Newest arrivals</option>
                </select>
              </div>

              <div className="view-mode-toggle-group" role="group" aria-label="Product layout">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                >
                  <SquaresFour size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                >
                  <ListBullets size={18} />
                </button>
              </div>
            </div>
          </Reveal>

          <button
            type="button"
            className={`catalogue-filter-backdrop ${mobileFiltersOpen ? "is-open" : ""}`}
            onClick={() => setMobileFiltersOpen(false)}
            aria-label="Close filters"
            tabIndex={mobileFiltersOpen ? 0 : -1}
            aria-hidden={!mobileFiltersOpen}
          />

          <div className="products-layout-flex">
            <Reveal
              variant="fade-up"
              className={`filter-controls-flex-row ${mobileFiltersOpen ? "is-open" : ""}`}
            >
              <div className="mobile-filter-sheet-header" id="catalogue-filter-sheet">
                <div>
                  <span className="eyebrow">Refine catalogue</span>
                  <strong>{sortedProducts.length} materials</strong>
                </div>
                <button
                  ref={filterCloseRef}
                  type="button"
                  className="icon-button"
                  onClick={() => setMobileFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="filter-select-box">
                <label htmlFor="catalogue-category" className="filter-label">Category</label>
                <select
                  id="catalogue-category"
                  value={activeCategory}
                  onChange={(event) => setActiveCategory(event.target.value)}
                  className="filter-inner-select"
                >
                  <option value="All">All categories</option>
                  {productCategories.map((category) => (
                    <option key={category.name} value={category.name}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-select-box">
                <label htmlFor="catalogue-product-type" className="filter-label">Product type</label>
                <select
                  id="catalogue-product-type"
                  value={activeType}
                  onChange={(event) => setActiveType(event.target.value)}
                  className="filter-inner-select"
                >
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div className="filter-select-box">
                <label htmlFor="catalogue-use-case" className="filter-label">Craft use</label>
                <select
                  id="catalogue-use-case"
                  value={activeTag}
                  onChange={(event) => setActiveTag(event.target.value)}
                  className="filter-inner-select"
                >
                  {USE_CASES.map((tag) => (
                    <option key={tag} value={tag}>{tag === "All" ? "All craft uses" : tag}</option>
                  ))}
                </select>
              </div>

              <fieldset className="filter-select-box catalogue-checks">
                <legend className="filter-label">Availability</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={filterHasShades}
                    onChange={(event) => setFilterHasShades(event.target.checked)}
                  />
                  <span>Has listed shades</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={filterBulkOnly}
                    onChange={(event) => setFilterBulkOnly(event.target.checked)}
                  />
                  <span>Wholesale / bulk</span>
                </label>
              </fieldset>

              <div className="mobile-filter-sheet-actions">
                <button type="button" className="btn btn-outline" onClick={handleResetFilters}>Clear all</button>
                <button type="button" className="btn btn-primary" onClick={() => setMobileFiltersOpen(false)}>
                  Show {sortedProducts.length}
                </button>
              </div>
            </Reveal>

            <div className="active-chips-summary-row">
              <span className="result-count-text">
                Showing <strong>{sortedProducts.length}</strong> of <strong>{featuredProducts.length}</strong> products
              </span>

              {hasActiveFilters ? (
                <div className="active-chips-flex" aria-label="Active catalogue filters">
                  {activeDepartment !== "All" ? (
                    <FilterChip label={activeDepartment} onClear={() => selectDepartment("All")} />
                  ) : null}
                  {activeCategory !== "All" ? (
                    <FilterChip label={activeCategory} onClear={() => setActiveCategory("All")} />
                  ) : null}
                  {activeType !== "All" ? (
                    <FilterChip
                      label={PRODUCT_TYPES.find((type) => type.value === activeType)?.label || activeType}
                      onClear={() => setActiveType("All")}
                    />
                  ) : null}
                  {activeTag !== "All" ? (
                    <FilterChip label={`Use · ${activeTag}`} onClear={() => setActiveTag("All")} />
                  ) : null}
                  {filterHasShades ? (
                    <FilterChip label="Has shades" onClear={() => setFilterHasShades(false)} />
                  ) : null}
                  {filterBulkOnly ? (
                    <FilterChip label="Bulk / wholesale" onClear={() => setFilterBulkOnly(false)} />
                  ) : null}
                  {searchQuery.trim() ? (
                    <FilterChip label={`“${searchQuery.trim()}”`} onClear={() => setSearchQuery("")} />
                  ) : null}

                  <button type="button" className="clear-filters-btn" onClick={handleResetFilters}>
                    <XCircle size={15} /> Reset all
                  </button>
                </div>
              ) : null}
            </div>

            <div className={`product-gallery-view-wrapper view-mode-${viewMode}`}>
              <div
                ref={resultGridRef}
                className={viewMode === "grid" ? "card-grid product-grid product-grid--filtered" : "product-list-layout--filtered"}
                aria-live="polite"
                aria-busy="false"
              >
                {sortedProducts.length ? (
                  sortedProducts.map((product) => (
                    <div key={product.slug} className="motion-grid-item" data-product-key={product.slug}>
                      <ProductCard product={product} compact={viewMode === "list"} />
                    </div>
                  ))
                ) : (
                  <div className="empty-results-box">
                    <Question size={48} className="empty-state-icon" />
                    <h3>No products match those filters</h3>
                    <p>Try a broader material, shade or craft, or reset the filters and start again.</p>
                    <div className="no-results-suggestions-box">
                      <span>Popular searches</span>
                      <div className="popular-terms-flex">
                        {POPULAR_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            className="btn btn-outline btn-small"
                            onClick={() => {
                              handleResetFilters();
                              setSearchQuery(term);
                            }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button type="button" className="btn btn-primary" onClick={handleResetFilters}>
                      Clear search and filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {recentlyViewedProducts.length ? (
        <section className="section catalogue-recent">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="section-head text-center">
                <p className="eyebrow">Continue browsing</p>
                <h2>Recently viewed</h2>
                <p>Pick up where you left off without searching again.</p>
              </div>
              <div className="card-grid product-grid">
                {recentlyViewedProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} compact />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <div className="container catalogue-cta-wrap">
        <CatalogueCta />
      </div>
    </>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <span className="active-filter-chip">
      {label}
      <button type="button" onClick={onClear} aria-label={`Remove ${label} filter`}>
        <X size={13} />
      </button>
    </span>
  );
}
