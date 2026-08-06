import {
  ArrowRight,
  CheckCircle,
  MagnifyingGlass,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import {
  catalogueMessage,
  createWhatsAppLink,
  productCategories,
} from "../../data/siteData.js";

export default function CommerceHero() {
  return (
    <section className="commerce-hero" aria-labelledby="home-title">
      <div className="container commerce-hero__grid">
        <div className="commerce-hero__copy">
          <p className="eyebrow">Yarn and craft supplier · Pune</p>
          <h1 id="home-title">Yarns, threads and craft supplies for every kind of making.</h1>
          <p className="commerce-hero__intro">
            Browse product families, compare listed shades, save favourites and send one clear retail or bulk enquiry to Fakhri Mart.
          </p>

          <div className="commerce-hero__actions">
            <Link className="btn btn-primary" to="/products">
              Shop the catalogue <ArrowRight size={18} />
            </Link>
            <a
              className="btn btn-outline"
              href={createWhatsAppLink(catalogueMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} /> Get latest catalogue
            </a>
          </div>

          <Link className="commerce-hero__search" to="/products?q=">
            <MagnifyingGlass size={20} />
            <span>Search yarn, macrame, beads, hooks and bag materials</span>
            <ArrowRight size={17} />
          </Link>

          <ul className="commerce-hero__trust" aria-label="Store benefits">
            <li><CheckCircle size={17} /> Live shade confirmation</li>
            <li><CheckCircle size={17} /> Retail and wholesale support</li>
            <li><CheckCircle size={17} /> Delivery across India</li>
          </ul>
        </div>

        <div className="commerce-hero__visual">
          <picture>
            <source
              srcSet="/assets/images/editorial/atelier-hero-640.avif 640w, /assets/images/editorial/atelier-hero-960.avif 960w, /assets/images/editorial/atelier-hero.avif 1280w"
              sizes="(max-width: 48rem) calc(100vw - 24px), 48vw"
              type="image/avif"
            />
            <img
              src="/assets/images/editorial/atelier-hero-960.webp"
              srcSet="/assets/images/editorial/atelier-hero-640.webp 640w, /assets/images/editorial/atelier-hero-960.webp 960w, /assets/images/editorial/atelier-hero.webp 1280w"
              sizes="(max-width: 48rem) calc(100vw - 24px), 48vw"
              alt="Yarn, threads, cord and bag-making materials arranged on a worktable"
              width="1280"
              height="853"
              fetchPriority="high"
              decoding="async"
            />
          </picture>

          <div className="commerce-hero__floating-card">
            <span>Popular categories</span>
            <div>
              {productCategories.slice(0, 4).map((category) => (
                <Link
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  {category.shortName || category.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="commerce-hero__stock-note">
            <strong>Need an exact shade?</strong>
            <span>Send the product name and quantity for current stock photos.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
