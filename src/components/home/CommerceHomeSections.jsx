import {
  ArrowLeft,
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Heart,
  Package,
  ShoppingBagOpen,
  Swatches,
  Truck,
} from "@phosphor-icons/react";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ProductShowcaseCard from "../ProductShowcaseCard.jsx";
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
    <section className="commerce-section commerce-category-section" aria-labelledby="shop-category-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow">Shop by category</p>
            <h2 id="shop-category-title">Start with the material you need</h2>
            <p>Jump directly into the product family instead of reading through a long brand story first.</p>
          </div>
          <Link to="/products">View full catalogue <ArrowRight size={17} /></Link>
        </Reveal>

        <div className="commerce-category-grid">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={(index % 4) * 38} variant="fade-up">
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
  const railRef = useRef(null);
  if (!products.length) return null;
  const titleId = `rail-${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;

  const move = (direction) => {
    railRef.current?.scrollBy({
      left: direction * Math.min(760, railRef.current.clientWidth * 0.78),
      behavior: "smooth",
    });
  };

  return (
    <section className="commerce-section commerce-product-section" aria-labelledby={titleId}>
      <div className="container">
        <Reveal className="commerce-heading commerce-heading--rail" variant="fade-up">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={titleId}>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="commerce-rail-actions">
            <button type="button" onClick={() => move(-1)} aria-label={`Scroll ${title} left`}><ArrowLeft size={18} /></button>
            <button type="button" onClick={() => move(1)} aria-label={`Scroll ${title} right`}><ArrowRight size={18} /></button>
            <Link to={href}>View collection <ArrowRight size={17} /></Link>
          </div>
        </Reveal>
        <div ref={railRef} className="commerce-product-rail" role="list" tabIndex="0" aria-label={title}>
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 5) * 34} variant="fade-up">
              <ProductShowcaseCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const crafts = [
  { name: "Crochet", test: /crochet|amigurumi|hook/i },
  { name: "Knitting", test: /knit|wearable|scarf|baby/i },
  { name: "Macrame", test: /macrame|cord|plant hanger/i },
  { name: "Bag Making", test: /bag|purse|handle|base|lock|charm/i },
  { name: "Embroidery", test: /embroidery|lacchi|stitch/i },
];

export function CommerceCraftFinder({ products }) {
  const [activeCraft, setActiveCraft] = useState(crafts[0]);
  const matches = useMemo(() => {
    const filtered = products.filter((product) => {
      const searchable = [product.name, product.category, product.suitableFor, ...(product.tags || []), ...(product.filters || [])].join(" ");
      return activeCraft.test.test(searchable);
    });
    return (filtered.length ? filtered : products).slice(0, 4);
  }, [activeCraft, products]);

  return (
    <section className="commerce-section commerce-craft-finder" aria-labelledby="craft-finder-title">
      <div className="container commerce-craft-finder__grid">
        <Reveal className="commerce-craft-finder__intro" variant="slide-left">
          <p className="eyebrow">Shop by what you make</p>
          <h2 id="craft-finder-title">Not sure which category name to choose?</h2>
          <p>Pick the project. The catalogue narrows itself to useful materials and tools.</p>
          <div className="commerce-craft-finder__tabs" role="tablist" aria-label="Choose a craft">
            {crafts.map((craft) => (
              <button
                key={craft.name}
                type="button"
                className={activeCraft.name === craft.name ? "is-active" : ""}
                onClick={() => setActiveCraft(craft)}
                role="tab"
                aria-selected={activeCraft.name === craft.name}
              >
                {craft.name}
              </button>
            ))}
          </div>
          <Link className="commerce-craft-finder__link" to={`/products?q=${encodeURIComponent(activeCraft.name)}`}>
            Explore all {activeCraft.name.toLowerCase()} products <ArrowRight size={17} />
          </Link>
        </Reveal>

        <div className="commerce-craft-finder__results" aria-live="polite">
          {matches.map((product, index) => (
            <Reveal key={`${activeCraft.name}-${product.slug}`} delay={index * 45} variant="fade-up">
              <Link to={`/products/${product.slug}`} className="commerce-craft-product">
                <img src={product.image} alt={product.name} width="420" height="420" loading="lazy" decoding="async" />
                <span>
                  <small>{product.category}</small>
                  <strong>{product.name}</strong>
                  <em>{product.colors?.length || 0} listed shades <ArrowRight size={14} /></em>
                </span>
              </Link>
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
      text: "Use search, quick view, categories, filters and the wishlist to shortlist products.",
    },
    {
      number: "02",
      icon: ShoppingBagOpen,
      title: "Build one enquiry",
      text: "Add quantities, shades and variants without leaving the collection page.",
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
            <h2 id="order-flow-title">Fast to browse. Clear before payment.</h2>
            <p>Pricing still depends on shade, pack and quantity, but the shopping experience should feel immediate.</p>
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
          <p>Send product names, preferred shades, quantities and delivery city. The team will share current pack details, alternatives and quantity-based pricing.</p>
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
