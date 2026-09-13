import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Package,
  ShieldCheck,
  ShoppingBagOpen,
  Storefront,
  Truck,
  Users,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import { businessInfo, featuredProducts } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const brandCount = new Set(featuredProducts.map((product) => product.brand).filter(Boolean)).size;
const departmentCount = new Set(featuredProducts.map((product) => product.masterCategory).filter(Boolean)).size;

const trustStats = [
  { value: featuredProducts.length, label: "verified catalogue lines" },
  { value: brandCount, label: "brands represented" },
  { value: departmentCount, label: "core material departments" },
  { value: "India-wide", label: "delivery enquiries" },
];

const audiences = [
  {
    icon: Users,
    title: "Makers & hobby crafters",
    text: "Browse by material or project, compare options and ask for the current shade before buying for one project.",
  },
  {
    icon: Storefront,
    title: "Boutiques, labels & resellers",
    text: "Shortlist repeat-use material lines, organise shade/quantity requirements and request current pack or pricing details together.",
  },
  {
    icon: Package,
    title: "Bulk & repeat buyers",
    text: "Build one structured requirement with product lines, shades, quantities and delivery location so the store can quote the real order.",
  },
];

const process = [
  {
    number: "01",
    title: "Discover the right material family",
    text: "Start with yarn, thread, embroidery material or macramé/cord, or use the project and guide tools if you do not know the product name yet.",
  },
  {
    number: "02",
    title: "Shortlist the exact line",
    text: "Open product pages, compare intended use, save products and add the quantity or project notes that matter to your requirement.",
  },
  {
    number: "03",
    title: "Confirm live details before buying",
    text: "Current shade, stock, pack information, price and delivery are confirmed directly instead of being presented as permanent website facts.",
  },
];

const websiteCanHelp = [
  "Recognise the exact product line and brand",
  "Understand the intended material family and project use",
  "Compare catalogue options and save a shortlist",
  "Estimate packs when you already know the pattern requirement",
  "Build one organised retail or wholesale enquiry",
];

const confirmLive = [
  "Current shade card or a live stock photo",
  "Stock available in the quantity you need",
  "Current pack, ball, cone or roll details",
  "Quantity-based pricing and acceptable alternatives",
  "Delivery availability, timing and final order details",
];

const principles = [
  {
    icon: ShieldCheck,
    title: "Do not fake certainty",
    text: "If a detail changes with stock, batch, supplier material or order quantity, the website sends you to live confirmation instead of pretending it is fixed.",
  },
  {
    icon: ShoppingBagOpen,
    title: "Make enquiries easier to answer",
    text: "Wishlist, comparison and enquiry tools are designed to turn browsing into one clear requirement instead of a long chain of disconnected messages.",
  },
  {
    icon: Truck,
    title: "Support local and India-wide buyers",
    text: "The same catalogue works for Pune customers, individual makers, boutiques, resellers and buyers who need delivery elsewhere in India.",
  },
];

export default function About() {
  useDocumentMeta({
    title: "About Fakhri Mart | Yarn & Craft Supplier in Pune",
    description: "Learn how Fakhri Mart helps makers, boutiques, resellers and wholesale buyers discover verified yarn, thread and cord lines and confirm live shades, stock and pricing before ordering.",
    canonical: "/about",
  });

  return (
    <div className="about-v22">
      <section className="about-hero about-v22__hero">
        <div className="container about-hero-grid">
          <Reveal className="about-hero-copy" variant="slide-left">
            <p className="eyebrow">Pune based · India-wide enquiries</p>
            <h1>A yarn and craft supplier that helps you decide before asking you to order.</h1>
            <p className="large-copy">
              Fakhri Mart brings supplier-backed yarn, thread and cord lines into one practical catalogue for makers, boutiques, resellers and bulk buyers. Browse first, then confirm the live details that actually matter to the order.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" to="/products">
                Explore the catalogue <ArrowRight size={18} />
              </Link>
              <Link className="btn btn-outline" to="/blog">
                Use buying guides
              </Link>
            </div>
            <div className="about-hero-trust" aria-label="Fakhri Mart buying support">
              <span>Retail + wholesale enquiries</span>
              <span>Live shade confirmation</span>
              <span>{businessInfo.delivery}</span>
            </div>
          </Reveal>

          <Reveal as="picture" className="about-hero-image about-v22__hero-image" delay={80} variant="scale-in">
            <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/craft-stock-room.webp"
              alt="Representative display of yarn, cord and thread materials"
              width="1536"
              height="1024"
              decoding="async"
            />
          </Reveal>
        </div>
      </section>

      <section className="about-v22__stats" aria-label="Current catalogue summary">
        <div className="container about-v22__stats-grid">
          {trustStats.map((item) => (
            <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>
          ))}
        </div>
      </section>

      <section className="section about-v22__audience" aria-labelledby="about-who-title">
        <div className="container">
          <Reveal className="section-heading" variant="fade-up">
            <div>
              <p className="eyebrow">Who the store is built for</p>
              <h2 id="about-who-title">One catalogue, three very different buying situations</h2>
              <p>The site should work whether you need one project’s material or a repeat supply conversation.</p>
            </div>
          </Reveal>
          <div className="about-v22__audience-grid">
            {audiences.map(({ icon: Icon, title, text }, index) => (
              <Reveal as="article" key={title} delay={index * 50} variant="fade-up">
                <Icon size={28} weight="duotone" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted about-v22__truth" aria-labelledby="about-truth-title">
        <div className="container">
          <Reveal className="about-v22__truth-intro" variant="fade-up">
            <p className="eyebrow">What the website knows vs what the store confirms</p>
            <h2 id="about-truth-title">Useful online discovery without pretending stock is static</h2>
            <p>Yarn and craft buying often depends on live shade, batch, pack and quantity details. Fakhri Mart separates stable catalogue information from the details that should be confirmed at the moment you buy.</p>
          </Reveal>

          <div className="about-v22__truth-grid">
            <Reveal as="article" variant="slide-left">
              <span className="about-v22__truth-label">Use the website for</span>
              <h3>Discovery and preparation</h3>
              <div className="about-v22__check-list">
                {websiteCanHelp.map((item) => <p key={item}><CheckCircle size={18} weight="fill" /> {item}</p>)}
              </div>
            </Reveal>
            <Reveal as="article" delay={70} variant="slide-right">
              <span className="about-v22__truth-label">Confirm directly for</span>
              <h3>The live order</h3>
              <div className="about-v22__check-list">
                {confirmLive.map((item) => <p key={item}><ChatCircleDots size={18} weight="fill" /> {item}</p>)}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section about-v22__process" aria-labelledby="about-process-title">
        <div className="container">
          <Reveal className="section-heading" variant="fade-up">
            <div>
              <p className="eyebrow">How buying works</p>
              <h2 id="about-process-title">From “I need yarn” to a requirement the store can answer</h2>
            </div>
            <Link className="btn btn-outline" to="/yarn-guide">I need help choosing</Link>
          </Reveal>
          <div className="about-process-grid about-v22__process-grid">
            {process.map((item, index) => (
              <Reveal key={item.number} as="article" className="about-process-card" delay={index * 50} variant="fade-up">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted about-v22__principles" aria-labelledby="about-principles-title">
        <div className="container">
          <Reveal className="section-heading" variant="fade-up">
            <div>
              <p className="eyebrow">How Fakhri Mart is trying to be useful</p>
              <h2 id="about-principles-title">Less showroom theatre. More buying confidence.</h2>
            </div>
          </Reveal>
          <div className="about-v22__principle-grid">
            {principles.map(({ icon: Icon, title, text }, index) => (
              <Reveal as="article" key={title} delay={index * 50} variant="fade-up">
                <Icon size={27} weight="duotone" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-v22__location">
        <div className="container">
          <StoreLocation compact />
          <div className="about-v22__final-cta">
            <div>
              <p className="eyebrow">Ready to shortlist?</p>
              <h2>Start with the catalogue. Ask a human when the live detail matters.</h2>
            </div>
            <div>
              <Link className="btn btn-primary" to="/products">Browse materials <ArrowRight size={17} /></Link>
              <Link className="btn btn-outline" to="/contact"><ChatCircleDots size={17} /> Contact Fakhri Mart</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
