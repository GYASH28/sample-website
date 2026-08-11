import { ArrowsLeftRight, ClockCounterClockwise, Heart, SquaresFour, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../data/siteData.js";
import { useCompare } from "../hooks/useCompare.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

const TABS = [
  { id: "recent", label: "Recent", icon: ClockCounterClockwise },
  { id: "saved", label: "Saved", icon: Heart },
  { id: "compare", label: "Compare", icon: ArrowsLeftRight },
];

export default function ShoppingWorkspace() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("recent");
  const closeRef = useRef(null);
  const recent = useRecentlyViewed(null);
  const { wishlist } = useWishlist();
  const { compare, remove: removeCompare } = useCompare();

  const productsBySlug = useMemo(() => new Map(featuredProducts.map((product) => [product.slug, product])), []);
  const recentProducts = recent.map((slug) => productsBySlug.get(slug)).filter(Boolean).slice(0, 6);
  const savedProducts = wishlist.map((slug) => productsBySlug.get(slug)).filter(Boolean).slice(0, 8);
  const compareProducts = compare.map((slug) => productsBySlug.get(slug)).filter(Boolean);
  const collections = { recent: recentProducts, saved: savedProducts, compare: compareProducts };
  const activeProducts = collections[tab] || [];

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open]);

  const openWorkspace = () => {
    setOpen(true);
    trackEngagement("workspace_open", { source: "global", count: recentProducts.length + savedProducts.length + compareProducts.length });
  };

  return (
    <>
      <button
        type="button"
        className="shopping-workspace-launcher"
        onClick={openWorkspace}
        aria-label="Open My shortlist workspace"
        aria-expanded={open}
        aria-controls="shopping-workspace"
      >
        <SquaresFour size={19} aria-hidden="true" />
        <span>My shortlist</span>
        {(wishlist.length + compare.length) > 0 ? <b>{wishlist.length + compare.length}</b> : null}
      </button>

      <button
        type="button"
        className={`shopping-workspace-backdrop ${open ? "is-open" : ""}`}
        onClick={() => setOpen(false)}
        aria-label="Close shortlist workspace"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        disabled={!open}
      />

      <aside
        id="shopping-workspace"
        className={`shopping-workspace ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="shopping-workspace__head">
          <div>
            <span className="eyebrow">Your local workspace</span>
            <h2>Pick up where you left off</h2>
          </div>
          <button ref={closeRef} type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close shortlist">
            <X size={21} />
          </button>
        </div>

        <div className="shopping-workspace__tabs" role="tablist" aria-label="Shortlist views">
          {TABS.map(({ id, label, icon: Icon }) => {
            const count = collections[id]?.length || 0;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                className={tab === id ? "is-active" : ""}
                onClick={() => setTab(id)}
              >
                <Icon size={16} aria-hidden="true" /> {label} <small>{count}</small>
              </button>
            );
          })}
        </div>

        <div className="shopping-workspace__body" role="tabpanel">
          {activeProducts.length ? (
            <div className="workspace-product-list">
              {activeProducts.map((product) => (
                <article key={product.slug} className="workspace-product-row">
                  <Link to={`/products/${product.slug}`} onClick={() => setOpen(false)}>
                    <img src={product.image} alt="" width="64" height="64" loading="lazy" decoding="async" />
                    <span><strong>{product.name}</strong><small>{product.category}</small></span>
                  </Link>
                  {tab === "compare" ? (
                    <button type="button" onClick={() => removeCompare(product.slug)} aria-label={`Remove ${product.name} from comparison`}>
                      <X size={15} />
                    </button>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="workspace-empty">
              <p>{tab === "recent" ? "Products you open will appear here." : tab === "saved" ? "Use the heart button to save materials without creating an account." : "Use Compare on product cards to put up to three materials side by side."}</p>
              <Link className="btn btn-outline btn-small" to="/products" onClick={() => setOpen(false)}>Browse catalogue</Link>
            </div>
          )}
        </div>

        <div className="shopping-workspace__footer">
          {compareProducts.length ? <Link className="btn btn-primary" to="/compare" onClick={() => setOpen(false)}>Compare {compareProducts.length} materials</Link> : null}
          <Link className="btn btn-outline" to="/enquiry" onClick={() => setOpen(false)}>Open enquiry basket</Link>
        </div>
      </aside>
    </>
  );
}
