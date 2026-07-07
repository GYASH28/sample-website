// src/pages/Catalogue.jsx
// Department-first browsing (Yarns/Threads/Accessories) layered with search/filter/sort.
// Fast, low-motion interaction chrome — this is a task page, not a mood page.

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X, Grid, List } from "lucide-react";
import { ProductCard } from "../components/ProductCard.jsx";
import { StaggerReveal, StaggerItem } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import {
  products,
  MASTER_CATEGORIES,
  businessInfo,
} from "../data/catalogue.js";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "name-asc", label: "Name A→Z" },
  { id: "name-desc", label: "Name Z→A" },
  { id: "rating", label: "Top rated" },
];

export default function Catalogue() {
  useDocumentMeta({
    title: "Shop — Yarns, Threads & Accessories",
    description: "Browse the Fakhri Mart catalogue. Filter by department, brand, or type. WhatsApp enquiry for pricing and availability.",
    canonical: `${businessInfo.url}/products`,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [activeDepartment, setActiveDepartment] = useState(searchParams.get("department") || "All");
  const [activeBrand, setActiveBrand] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");

  // Sync department to URL
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (activeDepartment !== "All") next.set("department", activeDepartment);
    else next.delete("department");
    setSearchParams(next, { replace: true });
  }, [activeDepartment, searchParams, setSearchParams]);

  const brands = useMemo(() => ["All", ...new Set(products.map((p) => p.brand))], []);
  const types = useMemo(() => ["All", ...new Set(products.map((p) => p.type))], []);

  const departmentCounts = useMemo(() => {
    const counts = { All: products.length };
    for (const mc of MASTER_CATEGORIES) {
      counts[mc] = products.filter((p) => p.masterCategory === mc).length;
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeDepartment !== "All") {
      list = list.filter((p) => p.masterCategory === activeDepartment);
    }
    if (activeBrand !== "All") list = list.filter((p) => p.brand === activeBrand);
    if (activeType !== "All") list = list.filter((p) => p.type === activeType);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": list.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "rating": list.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
      default: break; // featured = original order
    }
    return list;
  }, [activeDepartment, activeBrand, activeType, search, sort]);

  const hasFilters = activeDepartment !== "All" || activeBrand !== "All" || activeType !== "All" || search.trim();

  return (
    <div className="catalogue-page">
      <div className="container">
        <header className="page-header">
          <p className="eyebrow">Catalogue</p>
          <h1>Shop all products</h1>
          <p className="page-lede">
            Browse by department, then refine by brand, type, or search. Add items to your
            enquiry basket and send one WhatsApp message.
          </p>
        </header>

        {/* Department switcher — first-class, above all other filters */}
        <div className="department-switcher" role="tablist" aria-label="Department">
          <button
            type="button"
            className={`dept-tab ${activeDepartment === "All" ? "active" : ""}`}
            onClick={() => setActiveDepartment("All")}
            role="tab"
            aria-selected={activeDepartment === "All"}
          >
            All <span className="dept-count">({departmentCounts.All})</span>
          </button>
          {MASTER_CATEGORIES.map((mc) => (
            <button
              key={mc}
              type="button"
              className={`dept-tab ${activeDepartment === mc ? "active" : ""}`}
              onClick={() => setActiveDepartment(mc)}
              role="tab"
              aria-selected={activeDepartment === mc}
            >
              {mc} <span className="dept-count">({departmentCounts[mc]})</span>
            </button>
          ))}
        </div>

        {/* Filter bar — snappy, no slow-eased animation */}
        <div className="filter-bar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search yarns, threads, accessories…"
              aria-label="Search products"
              className="search-input"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} aria-label="Clear search" className="search-clear">
                <X size={14} />
              </button>
            )}
          </div>
          <select value={activeBrand} onChange={(e) => setActiveBrand(e.target.value)} className="filter-select" aria-label="Filter by brand">
            {brands.map((b) => <option key={b} value={b}>{b === "All" ? "All brands" : b}</option>)}
          </select>
          <select value={activeType} onChange={(e) => setActiveType(e.target.value)} className="filter-select" aria-label="Filter by type">
            {types.map((t) => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="filter-select" aria-label="Sort by">
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <div className="view-toggle" role="group" aria-label="View mode">
            <button type="button" className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-pressed={view === "grid"} aria-label="Grid view">
              <Grid size={15} />
            </button>
            <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-pressed={view === "list"} aria-label="List view">
              <List size={15} />
            </button>
          </div>
        </div>

        <p className="results-count">{filtered.length} products</p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>No products match your filters.</p>
            {hasFilters && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => { setActiveDepartment("All"); setActiveBrand("All"); setActiveType("All"); setSearch(""); }}
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className={view === "list" ? "list-view" : ""}>
            <StaggerReveal as="div" className="product-grid">
              {filtered.map((p) => (
                <StaggerItem key={p.slug}>
                  <ProductCard product={p} />
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        )}
      </div>
    </div>
  );
}
