import { useMemo, useState } from "react";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { featuredProducts, productCategories, productFilters } from "../data/siteData.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleProducts = useMemo(() => {
    let filtered = featuredProducts;

    if (activeFilter !== "All") {
      filtered = filtered.filter((product) => product.filters.includes(activeFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(q) || product.category.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const recentSlugs = useRecentlyViewed(null); // null currentSlug because this is a list page
  const recentlyViewedProducts = useMemo(() => {
    return recentSlugs
      .map((recentSlug) => featuredProducts.find((p) => p.slug === recentSlug))
      .filter(Boolean);
  }, [recentSlugs]);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Yarns, Crochet Threads & Craft Essentials"
        text="Browse the Fakhri Mart catalogue by category. Ask for prices, availability, shade details and bulk options directly through WhatsApp."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
      </PageHero>

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

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Filter Catalogue</p>
            <h2>Featured products for enquiry</h2>
            <p>Select a group to quickly view yarns, macrame cords, embroidery threads, accessories and purse materials.</p>
          </Reveal>

          <Reveal className="filter-bar" variant="fade-up">
            {productFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "filter-chip active" : "filter-chip"}
                onClick={() => {
                  setActiveFilter(filter);
                  setSearchQuery(""); // clear search when clicking category
                }}
              >
                {filter}
              </button>
            ))}
          </Reveal>

          <Reveal variant="fade-up" delay={100} style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <div className="search-wrapper" style={{ maxWidth: "400px", width: "100%", position: "relative" }}>
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: "16px", borderRadius: "999px" }}
                aria-label="Search products"
              />
            </div>
          </Reveal>

          <div key={`${activeFilter}-${searchQuery}`} className="card-grid product-grid product-grid--filtered" aria-live="polite">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 6) * 45} variant="scale-in">
                  <ProductCard product={product} />
                </Reveal>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                No products found matching your search.
              </div>
            )}
          </div>
        </div>
      </section>

      {recentlyViewedProducts.length > 0 && (
        <section className="section">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="section-head text-center" style={{ marginBottom: "32px" }}>
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
