import { useMemo, useState } from "react";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { featuredProducts, productCategories, productFilters, newArrivals } from "../data/siteData.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { Search, SlidersHorizontal, ArrowUpDown, XCircle } from "lucide-react";

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let filtered = featuredProducts;

    if (activeFilter !== "All") {
      filtered = filtered.filter((product) => product.filters.includes(activeFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.suitableFor.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  // Sorting logic
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];

    if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "category-asc") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortBy === "newest") {
      const getNewArrivalIndex = (product) => {
        // Matches product names like "Baby Soft" in siteData.js newArrivals
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

  const recentSlugs = useRecentlyViewed(null); // null currentSlug because this is a list page
  const recentlyViewedProducts = useMemo(() => {
    return recentSlugs
      .map((recentSlug) => featuredProducts.find((p) => p.slug === recentSlug))
      .filter(Boolean);
  }, [recentSlugs]);

  const handleResetFilters = () => {
    setActiveFilter("All");
    setSearchQuery("");
    setSortBy("featured");
  };

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Yarns, Crochet Threads & Craft Essentials"
        text="Browse the Fakhri Mart catalogue by category. Ask for prices, availability, shade details and bulk options directly through WhatsApp."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
      </PageHero>

      {/* Category Section */}
      <section className="section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Categories</p>
            <h2>Product categories available for enquiry</h2>
            <p>Each category is ready for catalogue, shade card, availability and bulk order enquiries.</p>
          </Reveal>
          <div className="card-grid category-grid">
            {productCategories.map((category, index) => (
              <Reveal key={category.name} delay={(index % 4) * 65} variant="fade-up">
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Filters, Search & Products Section */}
      <section className="section section-tinted" id="catalogue-browser">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Filter Catalogue</p>
            <h2>Explore our products catalogue</h2>
            <p>Use filters, search or sorting options to find the perfect yarn or craft tool for your handmade creations.</p>
          </Reveal>

          {/* Filtering chips row */}
          <Reveal className="filter-bar" variant="fade-up">
            {productFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "filter-chip active" : "filter-chip"}
                onClick={() => {
                  setActiveFilter(filter);
                }}
              >
                {filter}
              </button>
            ))}
          </Reveal>

          {/* Search, Sort and Summary Control row */}
          <Reveal variant="fade-up" delay={80}>
            <div className="catalogue-controls-row">
              {/* Premium Search Box */}
              <div className="search-box-premium">
                <Search size={18} className="search-icon-inside" />
                <input
                  type="search"
                  placeholder="Search by product, category or uses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
              </div>

              {/* Sorting & Filter controls */}
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
                  <option value="name-asc">Alphabetical (A–Z)</option>
                  <option value="category-asc">Sort by Category</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ArrowUpDown size={15} className="select-arrow-icon" />
              </div>
            </div>
          </Reveal>

          {/* Results Info and Clear All filters button */}
          <Reveal variant="fade-up" delay={120}>
            <div className="catalogue-result-summary">
              <span className="result-count-text">
                Showing <strong>{sortedProducts.length}</strong> of <strong>{featuredProducts.length}</strong> products
              </span>
              {(activeFilter !== "All" || searchQuery.trim() !== "" || sortBy !== "featured") && (
                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={handleResetFilters}
                >
                  <XCircle size={14} />
                  Reset Filters
                </button>
              )}
            </div>
          </Reveal>

          {/* Product Cards Grid */}
          <div key={`${activeFilter}-${searchQuery}-${sortBy}`} className="card-grid product-grid product-grid--filtered" aria-live="polite">
            {sortedProducts.length > 0 ? (
              sortedProducts.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 6) * 45} variant="scale-in">
                  <ProductCard product={product} />
                </Reveal>
              ))
            ) : (
              <div className="empty-results-box" style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
                <XCircle size={48} className="empty-state-icon" style={{ marginInline: "auto", marginBottom: "16px", color: "var(--muted)" }} />
                <h3>No products found</h3>
                <p>We couldn't find any yarns or accessories matching your selection.</p>
                <button
                  type="button"
                  className="btn btn-outline btn-small"
                  onClick={handleResetFilters}
                  style={{ marginTop: "16px" }}
                >
                  Clear all search and filters
                </button>
              </div>
            )}
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
