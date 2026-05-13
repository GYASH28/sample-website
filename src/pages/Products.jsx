import { useMemo, useState } from "react";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { featuredProducts, productCategories, productFilters } from "../data/siteData.js";

export default function Products() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return featuredProducts;
    return featuredProducts.filter((product) => product.filters.includes(activeFilter));
  }, [activeFilter]);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Catalogue of Sewing, Embroidery & Industrial Threads"
        text="Browse key categories and featured thread options. Prices are shared on enquiry because quantity, shade, and supply type can change the final rate."
      >
        <ProductVisual palette={["#1d3557", "#ffbe0b", "#e76f51"]} />
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Categories</p>
            <h2>Thread categories available for enquiry</h2>
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
            <h2>Featured Thread Products</h2>
            <p>Select a category to quickly view relevant thread options.</p>
          </Reveal>

          <Reveal className="filter-bar" variant="fade-up">
            {productFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "filter-chip active" : "filter-chip"}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </Reveal>

          <div key={activeFilter} className="card-grid product-grid product-grid--filtered" aria-live="polite">
            {visibleProducts.map((product, index) => (
              <Reveal key={`${activeFilter}-${product.name}`} delay={index * 60} variant="scale-in">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <CatalogueCta />
      </div>
    </>
  );
}
