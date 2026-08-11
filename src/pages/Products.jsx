import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowsDownUp,
  ListBullets,
  MagnifyingGlass,
  Question,
  SlidersHorizontal,
  Sparkle,
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
import {
  DISCOVERY_FILTER_OPTIONS,
  PROJECTS,
  getProductDiscoveryMeta,
  productsForProject,
  searchProducts,
} from "../data/discoveryData.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { useFlipList } from "../hooks/useFlipList.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

const PRODUCT_TYPES = [
  { label: "All types", value: "All" },
  { label: "Yarn balls", value: "yarn-ball" },
  { label: "Cotton threads", value: "cotton-thread" },
  { label: "Crochet threads", value: "crochet-thread" },
  { label: "Macramé cords", value: "macrame-cord" },
  { label: "Embroidery floss", value: "embroidery-floss" },
  { label: "Crochet hooks", value: "hook" },
  { label: "Purse handles", value: "purse-handle" },
];

const USE_CASES = ["All", ...DISCOVERY_FILTER_OPTIONS.crafts];
const SORT_OPTIONS = new Set(["featured", "relevance", "name-asc", "category-asc", "newest", "most-shades"]);
const VIEW_OPTIONS = new Set(["grid", "list"]);
const POPULAR_SEARCHES = ["yarn for baby blanket", "crochet bag", "soft yarn", "pink macrame", "embroidery thread", "cotton"];
const BUYING_MODES = ["All", "Retail", "Bulk"];

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

function allowedOrAll(searchParams, key, values) {
  const value = searchParams.get(key);
  return value && values.has(value) ? value : "All";
}

function buildSuggestions(query) {
  const normalized = query.trim();
  if (!normalized) return [];
  const q = normalized.toLocaleLowerCase();
  const rows = [];

  const projectMatches = PROJECTS.filter((item) => `${item.name} ${item.description}`.toLocaleLowerCase().includes(q)).slice(0, 3);
  projectMatches.forEach((item) => rows.push({ group: "Projects", type: "project", value: item.slug, label: item.name, meta: "Shop by project" }));

  productCategories
    .filter((category) => category.name.toLocaleLowerCase().includes(q))
    .slice(0, 3)
    .forEach((category) => rows.push({ group: "Categories", type: "category", value: category.name, label: category.name }));

  DISCOVERY_FILTER_OPTIONS.crafts
    .filter((craft) => craft.toLocaleLowerCase().includes(q))
    .slice(0, 3)
    .forEach((craft) => rows.push({ group: "Crafts", type: "craft", value: craft, label: craft }));

  DISCOVERY_FILTER_OPTIONS.materials
    .filter((material) => material.toLocaleLowerCase().includes(q) || q.includes(material.toLocaleLowerCase().split(" ")[0]))
    .slice(0, 3)
    .forEach((material) => rows.push({ group: "Materials", type: "material", value: material, label: material }));

  searchProducts(featuredProducts, normalized)
    .slice(0, 5)
    .forEach(({ product }) => rows.push({ group: "Products", type: "product", value: product.slug, label: product.name, meta: product.category }));

  return rows.slice(0, 12);
}

export default function Products() {
  useDocumentMeta({
    title: "Products | Fakhri Mart",
    description: "Search Fakhri Mart yarns and craft materials by project, craft, material, shade family, thickness and retail or wholesale enquiry use.",
    canonical: "/products",
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryNames = useMemo(() => new Set(productCategories.map((category) => category.name)), []);
  const productTypeValues = useMemo(() => new Set(PRODUCT_TYPES.map((type) => type.value)), []);
  const useCaseValues = useMemo(() => new Set(USE_CASES), []);
  const departmentValues = useMemo(() => new Set(["All", ...MASTER_CATEGORIES]), []);
  const materialValues = useMemo(() => new Set(["All", ...DISCOVERY_FILTER_OPTIONS.materials]), []);
  const colorValues = useMemo(() => new Set(["All", ...DISCOVERY_FILTER_OPTIONS.colors]), []);
  const projectValues = useMemo(() => new Set(["All", ...PROJECTS.map((project) => project.slug)]), []);
  const thicknessOptions = useMemo(() => [...new Set(featuredProducts.flatMap((product) => getProductDiscoveryMeta(product).thicknesses))].sort(), []);
  const thicknessValues = useMemo(() => new Set(["All", ...thicknessOptions]), [thicknessOptions]);

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [activeDepartment, setActiveDepartment] = useState(() => allowedOrAll(searchParams, "department", departmentValues));
  const [activeCategory, setActiveCategory] = useState(() => allowedOrAll(searchParams, "category", new Set(["All", ...categoryNames])));
  const [activeType, setActiveType] = useState(() => allowedOrAll(searchParams, "type", productTypeValues));
  const [activeTag, setActiveTag] = useState(() => allowedOrAll(searchParams, "tag", useCaseValues));
  const [activeMaterial, setActiveMaterial] = useState(() => allowedOrAll(searchParams, "material", materialValues));
  const [activeColor, setActiveColor] = useState(() => allowedOrAll(searchParams, "color", colorValues));
  const [activeThickness, setActiveThickness] = useState(() => allowedOrAll(searchParams, "thickness", thicknessValues));
  const [activeProject, setActiveProject] = useState(() => allowedOrAll(searchParams, "project", projectValues));
  const [buyingMode, setBuyingMode] = useState(() => {
    if (searchParams.get("bulk") === "1") return "Bulk";
    return allowedOrAll(searchParams, "mode", new Set(BUYING_MODES));
  });
  const [filterHasShades, setFilterHasShades] = useState(() => searchParams.get("shades") === "1");
  const [sortBy, setSortBy] = useState(() => SORT_OPTIONS.has(searchParams.get("sort")) ? searchParams.get("sort") : "featured");
  const [viewMode, setViewMode] = useState(() => readViewPreference(searchParams));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const filterCloseRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get("q") || "");
    setActiveDepartment(allowedOrAll(searchParams, "department", departmentValues));
    setActiveCategory(allowedOrAll(searchParams, "category", new Set(["All", ...categoryNames])));
    setActiveType(allowedOrAll(searchParams, "type", productTypeValues));
    setActiveTag(allowedOrAll(searchParams, "tag", useCaseValues));
    setActiveMaterial(allowedOrAll(searchParams, "material", materialValues));
    setActiveColor(allowedOrAll(searchParams, "color", colorValues));
    setActiveThickness(allowedOrAll(searchParams, "thickness", thicknessValues));
    setActiveProject(allowedOrAll(searchParams, "project", projectValues));
    setBuyingMode(searchParams.get("bulk") === "1" ? "Bulk" : allowedOrAll(searchParams, "mode", new Set(BUYING_MODES)));
    setFilterHasShades(searchParams.get("shades") === "1");
    setSortBy(SORT_OPTIONS.has(searchParams.get("sort")) ? searchParams.get("sort") : "featured");
    const requestedView = searchParams.get("view");
    if (VIEW_OPTIONS.has(requestedView)) setViewMode(requestedView);
  }, [searchParams, departmentValues, categoryNames, productTypeValues, useCaseValues, materialValues, colorValues, thicknessValues, projectValues]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (searchQuery.trim()) next.set("q", searchQuery.trim());
    if (activeDepartment !== "All") next.set("department", activeDepartment);
    if (activeCategory !== "All") next.set("category", activeCategory);
    if (activeType !== "All") next.set("type", activeType);
    if (activeTag !== "All") next.set("tag", activeTag);
    if (activeMaterial !== "All") next.set("material", activeMaterial);
    if (activeColor !== "All") next.set("color", activeColor);
    if (activeThickness !== "All") next.set("thickness", activeThickness);
    if (activeProject !== "All") next.set("project", activeProject);
    if (buyingMode !== "All") next.set("mode", buyingMode);
    if (filterHasShades) next.set("shades", "1");
    if (sortBy !== "featured") next.set("sort", sortBy);
    if (viewMode !== "grid") next.set("view", viewMode);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [searchQuery, activeDepartment, activeCategory, activeType, activeTag, activeMaterial, activeColor, activeThickness, activeProject, buyingMode, filterHasShades, sortBy, viewMode, searchParams, setSearchParams]);

  useEffect(() => {
    try { localStorage.setItem("fakhri_catalogue_view", viewMode); } catch { /* optional */ }
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
    const onKeyDown = (event) => { if (event.key === "Escape") setMobileFiltersOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("catalogue-filter-lock");
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus?.();
    };
  }, [mobileFiltersOpen]);

  const suggestions = useMemo(() => buildSuggestions(searchQuery), [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    trackEngagement("search_suggestion_select", { queryType: suggestion.type, source: "catalogue" });
    if (suggestion.type === "product") {
      setShowSuggestions(false);
      navigate(`/products/${suggestion.value}`);
      return;
    }
    if (suggestion.type === "category") setActiveCategory(suggestion.value);
    if (suggestion.type === "craft") setActiveTag(suggestion.value);
    if (suggestion.type === "material") setActiveMaterial(suggestion.value);
    if (suggestion.type === "project") setActiveProject(suggestion.value);
    setSearchQuery("");
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Escape") {
      setShowSuggestions(false);
      setSuggestionIndex(-1);
      return;
    }
    if (event.key === "Enter" && suggestionIndex === -1 && searchQuery.trim()) {
      trackEngagement("search_used", { queryType: "free-text", source: "catalogue" });
      setShowSuggestions(false);
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
    trackEngagement("filter_used", { filter: `department:${department}`, source: "catalogue" });
  };

  const projectScoreMap = useMemo(() => {
    if (activeProject === "All") return new Map();
    return new Map(productsForProject(featuredProducts, activeProject).map(({ product, score }) => [product.slug, score]));
  }, [activeProject]);

  const searchScoreMap = useMemo(() => {
    if (!searchQuery.trim()) return new Map();
    return new Map(searchProducts(featuredProducts, searchQuery).map(({ product, score }) => [product.slug, score]));
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = featuredProducts.filter((product) => {
      const meta = getProductDiscoveryMeta(product);
      if (activeDepartment !== "All" && product.masterCategory !== activeDepartment) return false;
      if (searchQuery.trim() && !searchScoreMap.has(product.slug)) return false;
      if (activeCategory !== "All" && product.category !== activeCategory) return false;
      if (activeType !== "All" && product.type !== activeType) return false;
      if (activeTag !== "All" && !meta.crafts.includes(activeTag) && !(product.tags || []).includes(activeTag)) return false;
      if (activeMaterial !== "All" && meta.material !== activeMaterial) return false;
      if (activeColor !== "All" && !meta.colorFamilies.includes(activeColor)) return false;
      if (activeThickness !== "All" && !meta.thicknesses.includes(activeThickness)) return false;
      if (activeProject !== "All" && !projectScoreMap.has(product.slug)) return false;
      if (buyingMode === "Retail" && !meta.retailSuitable) return false;
      if (buyingMode === "Bulk" && !meta.bulkSuitable) return false;
      if (filterHasShades && meta.shadeCount === 0) return false;
      return true;
    });
    return result;
  }, [activeDepartment, searchQuery, searchScoreMap, activeCategory, activeType, activeTag, activeMaterial, activeColor, activeThickness, activeProject, projectScoreMap, buyingMode, filterHasShades]);

  const departmentCounts = useMemo(() => {
    const counts = { All: featuredProducts.length };
    MASTER_CATEGORIES.forEach((department) => {
      counts[department] = featuredProducts.filter((product) => product.masterCategory === department).length;
    });
    return counts;
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    if (sortBy === "relevance" || ((searchQuery.trim() || activeProject !== "All") && sortBy === "featured")) {
      result.sort((a, b) => ((searchScoreMap.get(b.slug) || 0) + (projectScoreMap.get(b.slug) || 0)) - ((searchScoreMap.get(a.slug) || 0) + (projectScoreMap.get(a.slug) || 0)) || a.name.localeCompare(b.name));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category-asc") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "most-shades") {
      result.sort((a, b) => (b.colors?.length || 0) - (a.colors?.length || 0) || a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      const arrivalIndex = (product) => newArrivals.findIndex((arrival) => arrival.name.toLocaleLowerCase().includes(product.name.toLocaleLowerCase()));
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
  }, [filteredProducts, sortBy, searchQuery, activeProject, searchScoreMap, projectScoreMap]);

  const resultGridRef = useFlipList(sortedProducts.map((product) => product.slug));
  const recentSlugs = useRecentlyViewed(null);
  const recentlyViewedProducts = useMemo(() => recentSlugs.map((slug) => featuredProducts.find((product) => product.slug === slug)).filter(Boolean).slice(0, 6), [recentSlugs]);

  const handleResetFilters = () => {
    setActiveDepartment("All");
    setActiveCategory("All");
    setActiveType("All");
    setActiveTag("All");
    setActiveMaterial("All");
    setActiveColor("All");
    setActiveThickness("All");
    setActiveProject("All");
    setBuyingMode("All");
    setFilterHasShades(false);
    setSearchQuery("");
    setSortBy("featured");
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const hasActiveFilters = activeDepartment !== "All" || activeCategory !== "All" || activeType !== "All" || activeTag !== "All" || activeMaterial !== "All" || activeColor !== "All" || activeThickness !== "All" || activeProject !== "All" || buyingMode !== "All" || filterHasShades || Boolean(searchQuery.trim());
  const project = PROJECTS.find((item) => item.slug === activeProject);

  return (
    <>
      <PageHero
        className="catalogue-page-hero"
        motif="weave"
        eyebrow="Products"
        title="Find a material by project, craft or finish"
        text="Search naturally, refine only when useful, compare options, then ask for current shades and quantity-based pricing."
      >
        <picture className="catalogue-hero-photo">
          <source srcSet="/assets/images/editorial/shade-library.avif" type="image/avif" />
          <img src="/assets/images/editorial/shade-library.webp" alt="A curated library of yarn shades and material textures" width="1536" height="1024" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
      </PageHero>

      <section className="project-discovery-strip" aria-label="Shop by project shortcuts">
        <div className="container">
          <div className="project-discovery-strip__head">
            <div><Sparkle size={18} /><span><strong>Not sure what the product is called?</strong> Start with what you want to make.</span></div>
            <Link to="/projects">See all projects</Link>
          </div>
          <div className="project-discovery-scroll">
            {PROJECTS.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={activeProject === item.slug ? "is-active" : ""}
                onClick={() => {
                  const next = activeProject === item.slug ? "All" : item.slug;
                  setActiveProject(next);
                  setSortBy(next === "All" ? "featured" : "relevance");
                  trackEngagement("project_selected", { project: item.slug, source: "catalogue" });
                }}
                aria-pressed={activeProject === item.slug}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="catalogue-departments" aria-label="Browse departments">
        <div className="container">
          <div className="department-switcher" role="tablist" aria-label="Department">
            {["All", ...MASTER_CATEGORIES].map((department) => {
              const isActive = activeDepartment === department;
              return (
                <button key={department} type="button" className={`department-tab ${isActive ? "active" : ""}`} onClick={() => selectDepartment(department)} role="tab" aria-selected={isActive}>
                  <span>{department === "All" ? "All products" : department}</span><small>{departmentCounts[department] || 0}</small>
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
              <p className="eyebrow">Smart catalogue</p>
              <h2>{project ? `Materials for ${project.name.toLowerCase()}` : "Explore materials without the clutter"}</h2>
              <p>{project ? project.description : "Try natural phrases like “yarn for baby blanket”, “pink macrame cord” or “crochet bag”, then refine the results only if needed."}</p>
            </div>
            <span className="catalogue-result-pill" aria-live="polite">{sortedProducts.length} {sortedProducts.length === 1 ? "material" : "materials"}</span>
          </Reveal>

          <Reveal variant="fade-up" delay={60}>
            <div className="catalogue-controls-row catalogue-controls-sticky">
              <div className="search-box-premium-wrapper" ref={searchContainerRef}>
                <div className="search-box-premium search-box-intent">
                  <MagnifyingGlass size={19} className="search-icon-inside" aria-hidden="true" />
                  <input
                    type="search"
                    placeholder="Try “yarn for baby blanket” or “pink macrame”…"
                    value={searchQuery}
                    onChange={(event) => { setSearchQuery(event.target.value); setShowSuggestions(true); setSuggestionIndex(-1); if (event.target.value) setSortBy("relevance"); }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyDown={handleSearchKeyDown}
                    aria-label="Search products by name, project, shade, craft or material"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showSuggestions && suggestions.length > 0}
                    aria-controls="catalogue-search-suggestions"
                    aria-activedescendant={suggestionIndex > -1 ? `catalogue-suggestion-${suggestionIndex}` : undefined}
                  />
                  {searchQuery ? <button type="button" className="catalogue-search-clear" onClick={() => { setSearchQuery(""); setShowSuggestions(false); }} aria-label="Clear catalogue search"><X size={16} /></button> : null}
                </div>

                {showSuggestions && suggestions.length > 0 ? (
                  <div id="catalogue-search-suggestions" className="search-suggestions-dropdown intent-suggestions" role="listbox">
                    {suggestions.map((suggestion, index) => {
                      const previousGroup = suggestions[index - 1]?.group;
                      return (
                        <div key={`${suggestion.type}-${suggestion.value}-${index}`}>
                          {suggestion.group !== previousGroup ? <span className="suggestion-group-label">{suggestion.group}</span> : null}
                          <button
                            id={`catalogue-suggestion-${index}`}
                            type="button"
                            role="option"
                            aria-selected={suggestionIndex === index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            onMouseEnter={() => setSuggestionIndex(index)}
                            className={`suggestion-item-btn ${suggestionIndex === index ? "highlighted" : ""}`}
                          >
                            <span>{suggestion.label}</span>{suggestion.meta ? <small>{suggestion.meta}</small> : null}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <button className="mobile-filter-trigger" type="button" onClick={() => setMobileFiltersOpen(true)} aria-expanded={mobileFiltersOpen} aria-controls="catalogue-filter-sheet">
                <SlidersHorizontal size={18} /> Filters {hasActiveFilters ? <span className="filter-active-dot" aria-label="Active filters" /> : null}
              </button>

              <div className="sorting-controls-wrapper">
                <ArrowsDownUp size={17} className="control-icon-grey" aria-hidden="true" />
                <label htmlFor="product-sort-select" className="sr-only">Sort products</label>
                <select id="product-sort-select" className="product-sort-select" value={sortBy} onChange={(event) => { setSortBy(event.target.value); trackEngagement("sort_changed", { sort: event.target.value, source: "catalogue" }); }}>
                  <option value="featured">Featured</option>
                  <option value="relevance">Craft / search relevance</option>
                  <option value="most-shades">Most listed shades</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="category-asc">Category</option>
                  <option value="newest">Recently added</option>
                </select>
              </div>

              <div className="view-mode-toggle-group" role="group" aria-label="Product layout">
                <button type="button" onClick={() => setViewMode("grid")} className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`} aria-label="Grid view" aria-pressed={viewMode === "grid"}><SquaresFour size={18} /></button>
                <button type="button" onClick={() => setViewMode("list")} className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`} aria-label="List view" aria-pressed={viewMode === "list"}><ListBullets size={18} /></button>
              </div>
            </div>
          </Reveal>

          <button type="button" className={`catalogue-filter-backdrop ${mobileFiltersOpen ? "is-open" : ""}`} onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters" tabIndex={mobileFiltersOpen ? 0 : -1} aria-hidden={!mobileFiltersOpen} />

          <div className="products-layout-flex">
            <Reveal variant="fade-up" className={`filter-controls-flex-row smart-filter-panel ${mobileFiltersOpen ? "is-open" : ""}`}>
              <div className="mobile-filter-sheet-header" id="catalogue-filter-sheet">
                <div><span className="eyebrow">Refine catalogue</span><strong>{sortedProducts.length} materials</strong></div>
                <button ref={filterCloseRef} type="button" className="icon-button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={22} /></button>
              </div>

              <FilterSelect label="Category" id="catalogue-category" value={activeCategory} onChange={setActiveCategory} options={["All", ...productCategories.map((category) => category.name)]} allLabel="All categories" />
              <FilterSelect label="Product type" id="catalogue-product-type" value={activeType} onChange={setActiveType} options={PRODUCT_TYPES.map((type) => type.value)} labels={Object.fromEntries(PRODUCT_TYPES.map((type) => [type.value, type.label]))} />
              <FilterSelect label="Craft use" id="catalogue-use-case" value={activeTag} onChange={setActiveTag} options={USE_CASES} allLabel="All craft uses" />
              <FilterSelect label="Material / fibre" id="catalogue-material" value={activeMaterial} onChange={setActiveMaterial} options={["All", ...DISCOVERY_FILTER_OPTIONS.materials]} allLabel="All known materials" />
              <FilterSelect label="Thickness / size" id="catalogue-thickness" value={activeThickness} onChange={setActiveThickness} options={["All", ...thicknessOptions]} allLabel="All listed sizes" />
              <FilterSelect label="Colour family" id="catalogue-color" value={activeColor} onChange={setActiveColor} options={["All", ...DISCOVERY_FILTER_OPTIONS.colors]} allLabel="All colour families" />
              <FilterSelect label="Buying mode" id="catalogue-mode" value={buyingMode} onChange={setBuyingMode} options={BUYING_MODES} allLabel="Retail + bulk" labels={{ Retail: "Retail enquiries", Bulk: "Bulk / wholesale" }} />

              <fieldset className="filter-select-box catalogue-checks">
                <legend className="filter-label">Shade information</legend>
                <label><input type="checkbox" checked={filterHasShades} onChange={(event) => setFilterHasShades(event.target.checked)} /><span>Has representative shades listed</span></label>
              </fieldset>

              <div className="mobile-filter-sheet-actions">
                <button type="button" className="btn btn-outline" onClick={handleResetFilters}>Clear all</button>
                <button type="button" className="btn btn-primary" onClick={() => setMobileFiltersOpen(false)}>Show {sortedProducts.length}</button>
              </div>
            </Reveal>

            <div className="active-chips-summary-row">
              <span className="result-count-text">Showing <strong>{sortedProducts.length}</strong> of <strong>{featuredProducts.length}</strong> products</span>
              {hasActiveFilters ? (
                <div className="active-chips-flex" aria-label="Active catalogue filters">
                  {activeProject !== "All" ? <FilterChip label={`Project · ${project?.name || activeProject}`} onClear={() => setActiveProject("All")} /> : null}
                  {activeDepartment !== "All" ? <FilterChip label={activeDepartment} onClear={() => selectDepartment("All")} /> : null}
                  {activeCategory !== "All" ? <FilterChip label={activeCategory} onClear={() => setActiveCategory("All")} /> : null}
                  {activeType !== "All" ? <FilterChip label={PRODUCT_TYPES.find((type) => type.value === activeType)?.label || activeType} onClear={() => setActiveType("All")} /> : null}
                  {activeTag !== "All" ? <FilterChip label={`Craft · ${activeTag}`} onClear={() => setActiveTag("All")} /> : null}
                  {activeMaterial !== "All" ? <FilterChip label={`Material · ${activeMaterial}`} onClear={() => setActiveMaterial("All")} /> : null}
                  {activeThickness !== "All" ? <FilterChip label={`Size · ${activeThickness}`} onClear={() => setActiveThickness("All")} /> : null}
                  {activeColor !== "All" ? <FilterChip label={`Colour · ${activeColor}`} onClear={() => setActiveColor("All")} /> : null}
                  {buyingMode !== "All" ? <FilterChip label={buyingMode} onClear={() => setBuyingMode("All")} /> : null}
                  {filterHasShades ? <FilterChip label="Has listed shades" onClear={() => setFilterHasShades(false)} /> : null}
                  {searchQuery.trim() ? <FilterChip label={`“${searchQuery.trim()}”`} onClear={() => setSearchQuery("")} /> : null}
                  <button type="button" className="clear-filters-btn" onClick={handleResetFilters}><XCircle size={15} /> Reset all</button>
                </div>
              ) : null}
            </div>

            <div className={`product-gallery-view-wrapper view-mode-${viewMode}`}>
              <div ref={resultGridRef} className={viewMode === "grid" ? "card-grid product-grid product-grid--filtered" : "product-list-layout--filtered"} aria-live="polite" aria-busy="false">
                {sortedProducts.length ? sortedProducts.map((product) => (
                  <div key={product.slug} className="motion-grid-item" data-product-key={product.slug}><ProductCard product={product} compact={viewMode === "list"} /></div>
                )) : (
                  <div className="empty-results-box">
                    <Question size={48} className="empty-state-icon" />
                    <h3>No products match that combination</h3>
                    <p>Try a broader project, material, colour family or search phrase. The finder only matches information already present in the catalogue.</p>
                    <div className="no-results-suggestions-box"><span>Try a natural search</span><div className="popular-terms-flex">{POPULAR_SEARCHES.map((term) => <button key={term} type="button" className="btn btn-outline btn-small" onClick={() => { handleResetFilters(); setSearchQuery(term); setSortBy("relevance"); }}>{term}</button>)}</div></div>
                    <button type="button" className="btn btn-primary" onClick={handleResetFilters}>Clear search and filters</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {recentlyViewedProducts.length ? (
        <section className="section catalogue-recent"><div className="container"><Reveal variant="fade-up"><div className="section-head text-center"><p className="eyebrow">Continue browsing</p><h2>Recently viewed</h2><p>Pick up where you left off without searching again.</p></div><div className="card-grid product-grid">{recentlyViewedProducts.map((product) => <ProductCard key={product.slug} product={product} compact />)}</div></Reveal></div></section>
      ) : null}

      <div className="container catalogue-cta-wrap"><CatalogueCta /></div>
    </>
  );
}

function FilterSelect({ label, id, value, onChange, options, labels = {}, allLabel = "All" }) {
  return (
    <div className="filter-select-box">
      <label htmlFor={id} className="filter-label">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          trackEngagement("filter_used", { filter: `${id}:${event.target.value}`, source: "catalogue" });
        }}
        className="filter-inner-select"
      >
        {options.map((option) => <option key={option} value={option}>{option === "All" ? allLabel : labels[option] || option}</option>)}
      </select>
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return <span className="active-filter-chip">{label}<button type="button" onClick={onClear} aria-label={`Remove ${label} filter`}><X size={13} /></button></span>;
}
