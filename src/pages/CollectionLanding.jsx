import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { Link, Navigate, useParams } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { businessInfo, featuredProducts } from "../data/siteData.js";
import { getCollectionBySlug, productMatchesCollection } from "../data/discoveryData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { breadcrumbJsonLd, useJsonLd } from "../hooks/useJsonLd.js";

export default function CollectionLanding() {
  const { slug } = useParams();
  const collection = getCollectionBySlug(slug);
  const canonical = collection ? `/collections/${collection.slug}` : "/products";

  useDocumentMeta({
    title: collection ? `${collection.title} | Fakhri Mart` : "Material collections | Fakhri Mart",
    description: collection?.description || "Browse Fakhri Mart materials by project, craft and catalogue family.",
    canonical,
    robots: collection ? undefined : "noindex, follow",
  });

  useJsonLd(collection ? breadcrumbJsonLd([
    { name: "Home", url: businessInfo.url },
    { name: "Products", url: `${businessInfo.url}/products` },
    { name: collection.title, url: `${businessInfo.url}${canonical}` },
  ]) : null);

  if (!collection) return <Navigate to="/404" replace />;

  const products = featuredProducts.filter((product) => productMatchesCollection(product, collection));

  return (
    <>
      <PageHero motif="weave" eyebrow={collection.eyebrow} title={collection.title} text={collection.description} />

      <section className="section collection-intro">
        <div className="container collection-intro__grid">
          <div>
            <p className="eyebrow">How to use this collection</p>
            <h2>Shortlist first. Confirm current details second.</h2>
            <p>{collection.intro}</p>
          </div>
          <ul className="collection-guidance">
            {collection.guidance.map((item) => <li key={item}><CheckCircle size={17} weight="fill" aria-hidden="true" /> {item}</li>)}
          </ul>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <div className="section-heading collection-results-heading">
            <div>
              <p className="eyebrow">Relevant catalogue</p>
              <h2>{products.length ? `${products.length} material${products.length === 1 ? "" : "s"} to explore` : "No direct catalogue matches yet"}</h2>
              <p>These results are generated from existing category, tag, product-name and catalogue-description data.</p>
            </div>
            <Link className="btn btn-outline" to={collection.project ? `/products?project=${encodeURIComponent(collection.project)}` : collection.query ? `/products?q=${encodeURIComponent(collection.query)}` : "/products"}>
              Open full catalogue <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {products.length ? (
            <div className="card-grid product-grid">{products.map((product) => <ProductCard key={product.slug} product={product} />)}</div>
          ) : (
            <div className="collection-empty">
              <p>Use the full catalogue or WhatsApp enquiry if you are looking for something outside the current public catalogue.</p>
              <Link className="btn btn-primary" to="/products">Browse all materials</Link>
            </div>
          )}
        </div>
      </section>

      <section className="section collection-links">
        <div className="container">
          <p className="eyebrow">Continue discovering</p>
          <h2>Browse by project instead of product name</h2>
          <p>For beginners, starting with the thing you want to make is often faster than guessing technical catalogue terms.</p>
          <Link className="btn btn-primary" to="/projects">Shop by project <ArrowRight size={16} /></Link>
        </div>
      </section>
    </>
  );
}
