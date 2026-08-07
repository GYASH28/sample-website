import {
  ArrowRight,
  ChatCircleDots,
  Check,
  Palette,
  ShoppingBagOpen,
  Truck,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import { aboutCopy, aboutPoints, businessInfo } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const values = [
  {
    icon: Palette,
    title: "Choose with more context",
    text: "Catalogue images help you compare material families, while live shade confirmation handles the final colour decision.",
  },
  {
    icon: ShoppingBagOpen,
    title: "One list, fewer back-and-forth messages",
    text: "Save materials, choose shades and quantities, then bring the useful details together in one organised enquiry.",
  },
  {
    icon: Truck,
    title: "Built for local and India-wide buying",
    text: "The same catalogue can support a Pune visit, a retail requirement or an enquiry that needs delivery elsewhere in India.",
  },
];

const process = [
  {
    number: "01",
    title: "Browse the material family",
    text: "Start with yarn, thread, cord, hooks, beads or bag-making supplies and narrow the catalogue by how you plan to use it.",
  },
  {
    number: "02",
    title: "Save the practical details",
    text: "Choose a listed shade where available, note the quantity or option you need, and keep everything together in the enquiry basket.",
  },
  {
    number: "03",
    title: "Confirm what is current",
    text: "Send the enquiry on WhatsApp so current stock, exact shade, packing, quantity-based pricing and delivery can be confirmed before ordering.",
  },
];

export default function About() {
  useDocumentMeta({
    title: "About Fakhri Mart | Yarn & Craft Supplier in Pune",
    description: "Meet Fakhri Mart, a Pune-based yarn and craft-material supplier serving makers, boutiques, resellers and wholesale buyers across India.",
    canonical: "/about",
  });

  return (
    <>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <Reveal className="about-hero-copy" variant="slide-left">
            <p className="eyebrow">Pune based · India wide</p>
            <h1>A material partner built around the questions that matter before you order.</h1>
            <p className="large-copy">
              Fakhri Mart helps individual crafters, small labels, resellers and craft stores explore
              yarns, cords, threads and finishing supplies, then confirm the practical details before buying.
            </p>
            <div className="about-hero-actions">
              <Link className="btn btn-primary" to="/products">
                Explore materials <ArrowRight size={18} />
              </Link>
              <Link className="btn btn-outline" to="/contact">
                <ChatCircleDots size={18} /> Ask a question
              </Link>
            </div>
            <div className="about-hero-trust" aria-label="What Fakhri Mart supports">
              <span>Retail + wholesale enquiries</span>
              <span>Live shade confirmation</span>
              <span>{businessInfo.delivery}</span>
            </div>
          </Reveal>

          <Reveal as="picture" className="about-hero-image" delay={80} variant="scale-in">
            <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/craft-stock-room.webp"
              alt="Organised yarn, cord, embroidery thread, beads and bag hardware in a warm craft stock room"
              width="1536"
              height="1024"
              decoding="async"
            />
          </Reveal>
        </div>
      </section>

      <section className="section about-values-section">
        <div className="container">
          <Reveal className="section-heading" variant="fade-up">
            <p className="eyebrow">A more useful catalogue experience</p>
            <h2>Designed to help you decide, not pretend every order is identical.</h2>
            <p>
              Shade, size, packing, quantity and availability can change what you actually need. The website keeps discovery simple and leaves final confirmation to the conversation where those details belong.
            </p>
          </Reveal>

          <div className="about-values-grid">
            {values.map(({ icon: Icon, title, text }, index) => (
              <Reveal key={title} as="article" className="about-value-card" delay={index * 55} variant="fade-up">
                <Icon size={28} weight="duotone" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container about-story-grid">
          <Reveal className="about-story-heading" variant="slide-left">
            <p className="eyebrow">{businessInfo.tagline}</p>
            <h2>Range when you are exploring. Specific answers when you are ordering.</h2>
          </Reveal>
          <Reveal className="about-story-rail" delay={70} variant="slide-right">
            <p className="large-copy">{aboutCopy}</p>
            <div className="about-point-list">
              {aboutPoints.map((point) => (
                <span key={point}><Check size={18} weight="bold" /> {point}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section about-process-section">
        <div className="container">
          <Reveal className="section-heading" variant="fade-up">
            <p className="eyebrow">From browsing to enquiry</p>
            <h2>A simple three-step path from idea to a useful stock conversation.</h2>
          </Reveal>

          <div className="about-process-grid">
            {process.map((item, index) => (
              <Reveal key={item.number} as="article" className="about-process-card" delay={index * 55} variant="fade-up">
                <span>{item.number}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="about-process-cta" delay={80} variant="fade-up">
            <Link className="text-link" to="/products">
              Start with the catalogue <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <Reveal as="p" className="eyebrow" variant="thread-draw">How we work</Reveal>
          <div className="principle-list">
            <Reveal as="article" variant="slide-left"><span>01</span><h3>Show the range honestly</h3><p>Catalogue images explain the material family. Live photos confirm the current stock and exact shade.</p></Reveal>
            <Reveal as="article" delay={55} variant="fade-up"><span>02</span><h3>Quote for the real requirement</h3><p>Quantity, size, shade and delivery location all affect a useful quote, so prices are confirmed personally.</p></Reveal>
            <Reveal as="article" delay={110} variant="slide-right"><span>03</span><h3>Support retail and repeat buying</h3><p>One project, a boutique run or a reseller restock can start from the same structured enquiry list.</p></Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
