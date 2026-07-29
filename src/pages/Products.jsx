import { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { featuredProducts, productCategories, newArrivals, MASTER_CATEGORIES } from "../data/siteData.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { useFlipList } from "../hooks/useFlipList.js";
import {
  ArrowsDownUp,
  ListBullets,
  MagnifyingGlass,
  Question,
  SlidersHorizontal,
  SquaresFour,
  XCircle,
} from "@phosphor-icons/react";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const PRODUCT_TYPES = [
  { label: "All Types", value: "All" },
  { label: "Yarn Balls", value: "yarn-ball" },
  { label: "Cotton Threads", value: "cotton-thread" },
  { label: "Crochet Threads", value: "crochet-thread" },
  { label: "Macrame Cords", value: "macrame-cord" },
  { label: "Embroidery Floss", value: "embroidery-floss" },
  { label: "Crochet Hooks", value: "hook" },
  { label: "Purse Handles", value: "purse-handle" }
];

const USE_CASES = [
  "All",
  "Crochet",
  "Knitting",
  "Embroidery",
  "Macrame",
  "Bag Making",
  "Beginner Friendly"
];

const POPULAR_SEARCHES = ["Yarn", "Macrame", "Hook", "Cotton", "Soft", "Embroidery"];

export default function Products() {
  useDocumentMeta({
    title: "Products | Fakhri Mart",
    description: "Browse our full range of yarns, crochet threads, macrame cords, and craft accessories.",
    canonical: "/products",
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [activeDepartment, setActiveDepartment] = useState(() => searchParams.get("department") || "All");
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get("category") || "All");
  const [activeType, setActiveType] = useState(() => searchParams.get("type") || "All");
  const [activeTag, setActiveTag] = useState(() => searchParams.get("tag") || "All");
  const [filterHasShades, setFilterHasShades] = useState(false);
  const [filterBulkOnly, setFilterBulkOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Load filter parameters from query search (Prompt 2 Part 2.4 — extends existing tag/category/type with department)
  useEffect(() => {
    const tag = searchParams.get("tag");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const department = searchParams.get("department");
    const query = searchParams.get("q");
    if (tag) setActiveTag(tag);
    if (category) setActiveCategory(category);
    if (type) setActiveType(type);
    if (department) setActiveDepartment(department);
    if (query !== null) setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set("q", searchQuery.trim());
    if (activeDepartment !== "All") next.set("department", activeDepartment);
    if (activeCategory !== "All") next.set("category", activeCategory);
    if (activeType !== "All") next.set("type", activeType);
    if (activeTag !== "All") next.set("tag", activeTag);
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
  }, [searchQuery, activeDepartment, activeCategory, activeType, activeTag, searchParams, setSearchParams]);

  // Search Auto-Suggestions State
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  // Generate suggestions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    const matches = [];

    // Match Category Names
    productCategories.forEach(c => {
      if (c.name.toLowerCase().includes(q)) {
        matches.push({ type: "category", value: c.name, display: `Browse Category: ${c.name}` });
      }
    });

    // Match Craft Tags
    USE_CASES.forEach(tag => {
      if (tag !== "All" && tag.toLowerCase().includes(q)) {
        matches.push({ type: "tag", value: tag, display: `Craft Tag: ${tag}` });
      }
    });

    // Match Product Names
    featuredProducts.forEach(p => {
      if (p.name.toLowerCase().includes(q)) {
        matches.push({ type: "product", value: p.name, display: p.name });
      }
    });

    setSuggestions(matches.slice(0, 6)); // Limit to 6 suggestions
  }, [searchQuery]);

  // Click outside search dismisses suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === "category") {
      setActiveCategory(suggestion.value);
      setSearchQuery("");
    } else if (suggestion.type === "tag") {
      setActiveTag(suggestion.value);
      setSearchQuery("");
    } else {
      setSearchQuery(suggestion.value);
    }
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSuggestionIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      if (suggestionIndex > -1 && suggestions[suggestionIndex]) {
        e.preventDefault();
        handleSuggestionClick(suggestions[suggestionIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
    }
  };

  // Multi-facet filtering logic
  const filteredProducts = useMemo(() => {
    let result = featuredProducts;

    // Prompt 2 Part 2.2 — Department is the FIRST filter pass (before existing category/type/tag/search)
    if (activeDepartment !== "All") {
      result = result.filter((product) => product.masterCategory === activeDepartment);
    }

    // Search input
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.brand?.toLowerCase().includes(q) ||
          product.type?.toLowerCase().includes(q) ||
          product.masterCategory?.toLowerCase().includes(q) ||
          product.suitableFor.toLowerCase().includes(q) ||
          product.colors?.some((shade) => shade.name.toLowerCase().includes(q)) ||
          product.filters?.some((filter) => filter.toLowerCase().includes(q)) ||
          product.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // Type
    if (activeType !== "All") {
      result = result.filter((product) => product.type === activeType);
    }

    // Tags
    if (activeTag !== "All") {
      result = result.filter((product) => product.tags?.includes(activeTag));
    }

    // Shade Availability
    if (filterHasShades) {
      result = result.filter((product) => product.colors && product.colors.length > 0);
    }

    // Bulk Ordering
    if (filterBulkOnly) {
      result = result.filter((product) => product.tags?.includes("Bulk Orders"));
    }

    return result;
  }, [searchQuery, activeDepartment, activeCategory, activeType, activeTag, filterHasShades, filterBulkOnly]);

  // Per-department counts for the tab labels
  const departmentCounts = useMemo(() => {
    const counts = { All: featuredProducts.length };
    for (const mc of MASTER_CATEGORIES) {
      counts[mc] = featuredProducts.filter((p) => p.masterCategory === mc).length;
    }
    return counts;
  }, []);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category-asc") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "newest") {
      const getNewArrivalIndex = (product) => {
        return newArrivals.findIndex((na) => na.name.toLowerCase().includes(product.name.toLowerCase()));
      };
      result.sort((a, b) => {
        const indexA = getNewArrivalIndex(a);
        const indexB = getNewArrivalIndex(b);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });
    }

    return result;
  }, [filteredProducts, sortBy]);
  const resultGridRef = useFlipList(
    sortedProducts.map((product) => product.slug),
  );

  const recentSlugs = useRecentlyViewed(null);
  const recentlyViewedProducts = useMemo(() => {
    return recentSlugs
      .map((recentSlug) => featuredProducts.find((p) => p.slug === recentSlug))
      .filter(Boolean);
  }, [recentSlugs]);

  const handleResetFilters = () => {
    setActiveCategory("All");
    setActiveType("All");
    setActiveTag("All");
    setFilterHasShades(false);
    setFilterBulkOnly(false);
    setSearchQuery("");
    setSortBy("featured");
  };

  const hasActiveFilters = activeCategory !== "All" || activeType !== "All" || activeTag !== "All" || filterHasShades || filterBulkOnly || searchQuery.trim() !== "";

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
          />
        </picture>
      </PageHero>

      {/* Prompt 2 Part 2.2 — Department switcher (All / Yarns / Threads / Accessories) */}
      {/* Placed ABOVE the existing filter bar — department first, then refine within it. */}
      <section className="section" style={{ paddingTop: "32px", paddingBottom: "0" }}>
        <div className="container">
          <div
            className="department-switcher"
            role="tablist"
            aria-label="Department"
            style={{
              display: "flex",
              gap: "8px",
              padding: "12px 0",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className={`department-tab ${activeDepartment === "All" ? "active" : ""}`}
              onClick={() => setActiveDepartment("All")}
              role="tab"
              aria-selected={activeDepartment === "All"}
              style={{
                padding: "8px 16px",
                background: activeDepartment === "All" ? "var(--pink-dark, #6B1F2A)" : "#fff",
                color: activeDepartment === "All" ? "#fff" : "var(--text, #3A2B24)",
                border: "1px solid var(--gold-soft, #B8893C)",
                borderRadius: "999px",
                fontSize: "0.86rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
                All <span style={{ fontSize: "0.7rem" }}>({departmentCounts.All})</span>
            </button>
            {MASTER_CATEGORIES.map((mc) => {
              const isActive = activeDepartment === mc;
              return (
                <button
                  key={mc}
                  type="button"
                  className={`department-tab ${isActive ? "active" : ""}`}
                  onClick={() => setActiveDepartment(mc)}
                  role="tab"
                  aria-selected={isActive}
                  style={{
                    padding: "8px 16px",
                    background: isActive ? "var(--pink-dark, #6B1F2A)" : "#fff",
                    color: isActive ? "#fff" : "var(--text, #3A2B24)",
                    border: "1px solid var(--gold-soft, #B8893C)",
                    borderRadius: "999px",
                    fontSize: "0.86rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {mc} <span style={{ fontSize: "0.7rem" }}>({departmentCounts[mc]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Browse & Advanced Filters Section */}
      <section className="section section-tinted" id="catalogue-browser">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Filter Catalogue</p>
            <h2>Explore our products catalogue</h2>
            <p>Use filters, search or sorting options to find the right yarn or craft tool for your handmade creations.</p>
          </Reveal>

          {/* Controls Bar: Search Suggestions, Sorting, Grid/List view */}
          <Reveal variant="fade-up" delay={80}>
            <div className="catalogue-controls-row catalogue-controls-sticky">
              {/* Premium Search Box with suggestions */}
              <div className="search-box-premium-wrapper" ref={searchContainerRef} style={{ position: "relative", flexGrow: 1 }}>
                <div className="search-box-premium">
                  <MagnifyingGlass size={18} className="search-icon-inside" />
                  <input
                    type="search"
                    placeholder="Search by product name, category or uses..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Search products"
                  />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="search-suggestions-dropdown" style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", listStyle: "none", padding: "4px 0", marginTop: "4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    {suggestions.map((s, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => handleSuggestionClick(s)}
                          className={`suggestion-item-btn ${suggestionIndex === idx ? 'highlighted' : ''}`}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "10px 16px",
                            border: "none",
                            background: suggestionIndex === idx ? "rgba(0,0,0,0.05)" : "transparent",
                            cursor: "pointer",
                            fontSize: "14px"
                          }}
                        >
                          {s.display}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
                {hasActiveFilters && <span aria-label="Active filters">•</span>}
              </button>

              {/* Sorting controls */}
              <div className="sorting-controls-wrapper">
                <SlidersHorizontal size={16} className="control-icon-grey" />
                <label htmlFor="product-sort-select" className="sr-only">Sort by</label>
                <select
                  id="product-sort-select"
                  className="product-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured Order</option>
                  <option value="name-asc">Alphabetical (A-Z)</option>
                  <option value="category-asc">Sort by Category</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ArrowsDownUp size={15} className="select-arrow-icon" />
              </div>

              {/* Grid / List view toggle */}
              <div className="view-mode-toggle-group" style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                  title="Grid View"
                  aria-label="Switch to Grid View"
                >
                  <SquaresFour size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
                  title="List View"
                  aria-label="Switch to List View"
                >
                  <ListBullets size={18} />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Filtering Sidebars / Columns Layout */}
          <div className="products-layout-flex" style={{ display: "flex", gap: "28px", marginTop: "24px", flexDirection: "column" }}>
            
            {/* Filter controls row */}
            <Reveal
              variant="fade-up"
              className={`filter-controls-flex-row ${mobileFiltersOpen ? "is-open" : ""}`}
            >
              <div className="mobile-filter-sheet-header" id="catalogue-filter-sheet">
                <div>
                  <span className="eyebrow">Refine catalogue</span>
                  <strong>{sortedProducts.length} materials</strong>
                </div>
                <button type="button" className="icon-button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <XCircle size={22} />
                </button>
              </div>
              {/* Category selector */}
              <div className="filter-select-box">
                <label htmlFor="catalogue-category" className="filter-label" style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</label>
                <select id="catalogue-category" value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="filter-inner-select" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)", background: "#fafafa" }}>
                  <option value="All">All Categories</option>
                  {productCategories.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Product Type selector */}
              <div className="filter-select-box">
                <label htmlFor="catalogue-product-type" className="filter-label" style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Product Type</label>
                <select id="catalogue-product-type" value={activeType} onChange={(e) => setActiveType(e.target.value)} className="filter-inner-select" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)", background: "#fafafa" }}>
                  {PRODUCT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* Tag / Use Case selector */}
              <div className="filter-select-box">
                <label htmlFor="catalogue-use-case" className="filter-label" style={{ display: "block", marginBottom: "6px", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase" }}>Craft Use Case</label>
                <select id="catalogue-use-case" value={activeTag} onChange={(e) => setActiveTag(e.target.value)} className="filter-inner-select" style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid rgba(0,0,0,0.1)", background: "#fafafa" }}>
                  {USE_CASES.map(tag => (
                    <option key={tag} value={tag}>{tag === "All" ? "All Use Cases" : tag}</option>
                  ))}
                </select>
              </div>

              {/* Checkbox filter options */}
              <div className="filter-select-box checkboxes" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                  <input type="checkbox" checked={filterHasShades} onChange={(e) => setFilterHasShades(e.target.checked)} />
                  <span>Has Color Shades</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                  <input type="checkbox" checked={filterBulkOnly} onChange={(e) => setFilterBulkOnly(e.target.checked)} />
                  <span>Wholesale/Bulk Only</span>
                </label>
              </div>
              <div className="mobile-filter-sheet-actions">
                <button type="button" className="btn btn-outline" onClick={handleResetFilters}>Clear all</button>
                <button type="button" className="btn btn-primary" onClick={() => setMobileFiltersOpen(false)}>
                  Show {sortedProducts.length} materials
                </button>
              </div>
            </Reveal>

            {/* Active Chips / Count row */}
            <div className="active-chips-summary-row" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
              <span className="result-count-text">
                Showing <strong>{sortedProducts.length}</strong> of <strong>{featuredProducts.length}</strong> products
              </span>

              {hasActiveFilters && (
                <div className="active-chips-flex" style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                  {activeCategory !== "All" && (
                    <span className="active-filter-chip">{activeCategory} <button type="button" onClick={() => setActiveCategory("All")}>&times;</button></span>
                  )}
                  {activeType !== "All" && (
                    <span className="active-filter-chip">{PRODUCT_TYPES.find(t => t.value === activeType)?.label} <button type="button" onClick={() => setActiveType("All")}>&times;</button></span>
                  )}
                  {activeTag !== "All" && (
                    <span className="active-filter-chip">Use: {activeTag} <button type="button" onClick={() => setActiveTag("All")}>&times;</button></span>
                  )}
                  {filterHasShades && (
                    <span className="active-filter-chip">Has Shades <button type="button" onClick={() => setFilterHasShades(false)}>&times;</button></span>
                  )}
                  {filterBulkOnly && (
                    <span className="active-filter-chip">Bulk/Wholesale <button type="button" onClick={() => setFilterBulkOnly(false)}>&times;</button></span>
                  )}
                  {searchQuery.trim() !== "" && (
                    <span className="active-filter-chip">Search: "{searchQuery}" <button type="button" onClick={() => setSearchQuery("")}>&times;</button></span>
                  )}
                  
                  <button
                    type="button"
                    className="clear-filters-btn font-semibold"
                    onClick={handleResetFilters}
                    style={{ fontSize: "13px", color: "var(--primary)", border: "none", background: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <XCircle size={14} />
                    Reset All
                  </button>
                </div>
              )}
            </div>

            {/* Product Cards Grid / List */}
            <div className={`product-gallery-view-wrapper view-mode-${viewMode}`}>
              <div 
                ref={resultGridRef}
                className={viewMode === "grid" ? "card-grid product-grid product-grid--filtered" : "list-layout product-list-layout--filtered"} 
                aria-live="polite"
                style={viewMode === "list" ? { display: "flex", flexDirection: "column", gap: "16px" } : {}}
              >
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => (
                    <div
                      key={product.slug}
                      className="motion-grid-item"
                      data-product-key={product.slug}
                    >
                      <ProductCard product={product} compact={viewMode === "list"} />
                    </div>
                  ))
                ) : (
                  /* Upgraded No Results Box with recommendations */
                  <div className="empty-results-box" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.05)" }}>
                    <Question size={52} className="empty-state-icon" style={{ marginInline: "auto", marginBottom: "18px", color: "var(--accent-rose, #e05c75)" }} />
                    <h3 style={{ fontSize: "20px", marginBottom: "8px" }}>No products match your filters</h3>
                    <p style={{ color: "var(--text-muted)", maxWidth: "460px", marginInline: "auto", fontSize: "15px" }}>
                      We couldn't find any yarns or craft tools matching your exact selections. Try clearing some filters or searching popular terms.
                    </p>
                    
                    <div className="no-results-suggestions-box" style={{ marginTop: "24px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "10px" }}>Popular Searches:</span>
                      <div className="popular-terms-flex" style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
                        {POPULAR_SEARCHES.map(term => (
                          <button
                            key={term}
                            type="button"
                            className="btn btn-outline btn-small"
                            onClick={() => {
                              setSearchQuery(term);
                              setShowSuggestions(false);
                            }}
                            style={{ fontSize: "12px" }}
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleResetFilters}
                      style={{ marginTop: "28px" }}
                    >
                      Clear all search and filters
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="section-head text-center" style={{ marginBottom: "32px" }}>
                <p className="eyebrow" style={{ display: "inline-block" }}>History</p>
                <h2>Recently Viewed</h2>
              </div>
              <div className="card-grid product-grid">
                {recentlyViewedProducts.map((recentProduct) => (
                  <ProductCard key={recentProduct.slug} product={recentProduct} compact />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <div className="container">
        <CatalogueCta />
      </div>
    </>
  );
}
