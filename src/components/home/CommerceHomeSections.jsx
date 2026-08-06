import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Heart,
  Package,
  ShoppingBagOpen,
  Swatches,
  Truck,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard.jsx";
import Reveal from "../Reveal.jsx";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import {
  catalogueMessage,
  createWhatsAppLink,
} from "../../data/siteData.js";

export function CommerceCategoryNav({ categories }) {
  return (
    <nav className="commerce-category-nav" aria-label="Shop by category">
      <div className="container commerce-category-nav__scroller">
        <Link className="commerce-category-nav__all" to="/products">
          All products <ArrowRight size={15} />
        </Link>
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/products?category=${encodeURIComponent(category.name)}`}
          >
            {category.shortName || category.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function CommerceCategoryGrid({ categories }) {
  return (
    <section className="commerce-section" aria-labelledby="shop-category-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 id="shop-category-title">Start with the material you need</h2>
          </div>
          <Link to="/products">View full catalogue <ArrowRight size={17} /></Link>
        </Reveal>

        <div className="commerce-category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={(index % 4) * 45} variant="fade-up">
              <Link
                className="commerce-category-card"
                to={`/products?category=${encodeURIComponent(category.name)}`}
              >
                <img
                  src={category.image}
                  alt={`${category.name} products`}
                  width="520"
                  height="360"
                  loading="lazy"
                  decoding="async"
                />
                <span className="commerce-category-card__overlay" />
                <span className="commerce-category-card__copy">
                  <small>{category.count}</small>
                  <strong>{category.shortName || category.name}</strong>
                  <em>Browse category <ArrowRight size={15} /></em>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommerceProductRail({ eyebrow, title, text, products, href = "/products" }) {
  if (!products.length) return null;
  const titleId = `rail-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section className="commerce-section commerce-product-section" aria-labelledby={titleId}>
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={titleId}>{title}</h2>
            <p>{text}</p>
          </div>
          <Link to={href}>View collection <ArrowRight size={17} /></Link>
        </Reveal>
        <div className="commerce-product-rail" role="list">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 5) * 40} variant="fade-up">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommerceBenefits() {
  const benefits = [
    {
      icon: Swatches,
      title: "Live shade confirmation",
      text: "Ask for current shade photos before finalising your order.",
    },
    {
      icon: Package,
      title: "Retail and bulk quantities",
      text: "Build one list for a single project, boutique stock or resale order.",
    },
    {
      icon: Truck,
      title: "Delivery across India",
      text: "Delivery availability, charges and dispatch timing are confirmed by location.",
    },
    {
      icon: ChatCircleDots,
      title: "Human WhatsApp support",
      text: "Get current pricing, pack details and alternatives from the store team.",
    },
  ];

  return (
    <section className="commerce-benefits" aria-label="Why shop with Fakhri Mart">
      <div className="container commerce-benefits__grid">
        {benefits.map(({ icon: Icon, title, text }) => (
          <article key={title}>
            <Icon size={27} />
            <div>
              <strong>{title}</strong>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CommerceOrderFlow() {
  const steps = [
    {
      number: "01",
      icon: Heart,
      title: "Browse and save",
      text: "Use search, categories, filters and the wishlist to shortlist products.",
    },
    {
      number: "02",
      icon: ShoppingBagOpen,
      title: "Build one enquiry",
      text: "Add quantities, shades and variants to your enquiry basket.",
    },
    {
      number: "03",
      icon: WhatsAppIcon,
      title: "Confirm before ordering",
      text: "Fakhri Mart replies with live stock, final price and delivery details.",
    },
  ];

  return (
    <section className="commerce-section commerce-order-flow" aria-labelledby="order-flow-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow">How ordering works</p>
            <h2 id="order-flow-title">Clear ordering, confirmed before payment.</h2>
            <p>Because yarn shades, pack sizes and wholesale rates change, the website helps you prepare a complete enquiry and the store confirms the final order.</p>
          </div>
        </Reveal>
        <ol>
          {steps.map(({ number, icon: Icon, title, text }, index) => (
            <Reveal as="li" key={number} delay={index * 55} variant="fade-up">
              <span>{number}</span>
              <Icon size={28} />
              <strong>{title}</strong>
              <p>{text}</p>
              <CheckCircle size={20} />
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CommerceWholesaleCta() {
  return (
    <section className="commerce-wholesale" aria-labelledby="wholesale-title">
      <div className="container commerce-wholesale__grid">
        <div>
          <p className="eyebrow">Wholesale and resale support</p>
          <h2 id="wholesale-title">Need multiple colours, cartons or regular supply?</h2>
          <p>Send the product names, preferred shades, quantities and delivery city. The team will share current pack details, alternatives and quantity-based pricing.</p>
          <div className="commerce-wholesale__actions">
            <Link className="btn btn-light" to="/enquiry">
              Prepare enquiry <ArrowRight size={18} />
            </Link>
            <a className="btn btn-outline" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> WhatsApp catalogue
            </a>
          </div>
        </div>
        <picture>
          <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
          <img
            src="/assets/images/editorial/craft-stock-room.webp"
            alt="Organised shelves of yarn and craft materials"
            width="1536"
            height="1024"
            loading="lazy"
            decoding="async"
          />
        </picture>
      </div>
    </section>
  );
}
