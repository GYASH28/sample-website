import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MessageCircle,
  Scissors,
  ShoppingBag,
  Sparkles,
  Wand2,
} from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import { businessInfo } from "../data/siteData.js";
import { storeFaqs } from "../data/businessProfile.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { faqPageJsonLd, useJsonLd } from "../hooks/useJsonLd.js";

const PROJECTS = [
  {
    id: "crochet",
    label: "Crochet & Amigurumi",
    tag: "Crochet",
    icon: Sparkles,
    summary: "For motifs, toys, doilies, tops and everyday crochet projects.",
    recommendations: ["Cotton or crochet thread", "Smooth, even twist", "Shade availability", "Hook size matched to the project"],
    ask: "I am making a crochet or amigurumi project",
  },
  {
    id: "knitting",
    label: "Knitting",
    tag: "Knitting",
    icon: Heart,
    summary: "For babywear, scarves, sweaters, blankets and soft knitted pieces.",
    recommendations: ["Soft yarn with consistent thickness", "Ply or weight suitable for the pattern", "Enough quantity from one shade lot", "Needle-size guidance"],
    ask: "I am making a knitted project",
  },
  {
    id: "macrame",
    label: "Macrame & Baskets",
    tag: "Macrame",
    icon: Wand2,
    summary: "For plant hangers, wall decor, baskets and structured handmade pieces.",
    recommendations: ["Single or twisted macrame cord", "3 mm or 4 mm based on structure", "Natural or coloured cord", "Roll quantity for the full project"],
    ask: "I am making a macrame or basket project",
  },
  {
    id: "bags",
    label: "Bag Making",
    tag: "Bag Making",
    icon: ShoppingBag,
    summary: "For crochet bags, purses, clutches, bases, handles and finishing hardware.",
    recommendations: ["T-shirt yarn or sturdy cord", "Compatible base and handle size", "Locks, rings, magnets or charms", "Matching accessory colour"],
    ask: "I am making a bag or purse",
  },
  {
    id: "embroidery",
    label: "Embroidery",
    tag: "Embroidery",
    icon: Scissors,
    summary: "For decorative stitching, surface work and colourful detailing.",
    recommendations: ["Thread type for the fabric", "Colour family or exact shade", "Required number of strands", "Needle and hoop compatibility"],
    ask: "I need materials for an embroidery project",
  },
  {
    id: "beginner",
    label: "Beginner Friendly",
    tag: "Beginner Friendly",
    icon: CheckCircle2,
    summary: "A simpler starting point when you are learning or choosing your first project.",
    recommendations: ["Easy-to-see medium thickness", "Smooth yarn that does not split easily", "Comfortable hook or needle", "Small project with limited colours"],
    ask: "I am a beginner and need help choosing materials",
  },
];

export default function YarnGuide() {
  useDocumentMeta({
    title: "Yarn & Craft Material Guide — Fakhri Mart Pune",
    description:
      "Choose yarn, thread, macrame cord and bag-making accessories by project. Browse matching Fakhri Mart products or ask for help on WhatsApp.",
    pathname: "/yarn-guide",
  });
  useJsonLd(faqPageJsonLd(storeFaqs));

  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const selected = useMemo(
    () => PROJECTS.find((project) => project.id === selectedId) || PROJECTS[0],
    [selectedId],
  );

  const message = [
    `Hello ${businessInfo.name}, ${selected.ask}.`,
    "Please suggest suitable yarn/thread, available shades, quantity, price and the right hook/needle or accessories.",
    "My delivery city is: ____",
  ].join(" ");
  const whatsappHref = `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const catalogueHref = `/products?tag=${encodeURIComponent(selected.tag)}`;

  return (
    <>
      <PageHero
        eyebrow="Yarn Guide"
        title="Start with what you want to make"
        text="Pick your project and get a practical shortlist of what to check before choosing yarn, thread, cord, hooks or bag-making accessories."
      >
        <ProductVisual palette={["#2A8C82", "#D9A5B3", "#C9B36A"]} />
      </PageHero>

      <section className="section yarn-guide-section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Project Finder</p>
            <h2>What are you making?</h2>
            <p>Choose one option. The guide updates instantly without sending or ordering anything.</p>
          </Reveal>

          <div className="project-finder">
            <div className="project-finder__options" role="list" aria-label="Project types">
              {PROJECTS.map((project) => {
                const Icon = project.icon;
                const active = project.id === selected.id;
                return (
                  <button
                    key={project.id}
                    type="button"
                    className={`project-choice ${active ? "project-choice--active" : ""}`}
                    onClick={() => setSelectedId(project.id)}
                    aria-pressed={active}
                  >
                    <Icon size={22} aria-hidden="true" />
                    <span>
                      <strong>{project.label}</strong>
                      <small>{project.summary}</small>
                    </span>
                  </button>
                );
              })}
            </div>

            <Reveal className="project-recommendation" variant="slide-right">
              <p className="eyebrow">Recommended checks</p>
              <h2>{selected.label}</h2>
              <p>{selected.summary}</p>
              <ul>
                {selected.recommendations.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="project-recommendation__actions">
                <Link className="btn btn-primary" to={catalogueHref}>
                  Browse Matching Products
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a className="btn btn-whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} aria-hidden="true" />
                  Ask on WhatsApp
                </a>
              </div>
              <p className="project-recommendation__note">
                For a more accurate suggestion, include your pattern or reference photo, preferred colour, quantity and delivery city.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-tinted guide-faq-section">
        <div className="container guide-faq-layout">
          <Reveal variant="slide-left">
            <p className="eyebrow">Before You Enquire</p>
            <h2>Five details that prevent wrong purchases</h2>
            <ol className="enquiry-checklist">
              <li>What are you making?</li>
              <li>Which colour or shade family do you need?</li>
              <li>How much material does your pattern require?</li>
              <li>Do you already have the hook, needle, base or handle?</li>
              <li>Is it a single piece, bulk order or reseller enquiry?</li>
            </ol>
          </Reveal>

          <Reveal variant="slide-right" delay={90}>
            <div className="guide-faqs">
              {storeFaqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <StoreLocation compact />
        </div>
      </section>
    </>
  );
}
