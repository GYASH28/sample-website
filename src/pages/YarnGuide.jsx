import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Handbag,
  Scissors,
  Sparkle,
} from "@phosphor-icons/react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import { businessInfo } from "../data/siteData.js";
import { storeFaqs } from "../data/businessProfile.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { faqPageJsonLd, useJsonLd } from "../hooks/useJsonLd.js";

const PROJECTS = [
  {
    id: "crochet",
    label: "Crochet & amigurumi",
    tag: "Crochet",
    icon: Sparkle,
    summary: "Motifs, toys, doilies, tops and everyday crochet projects.",
    checks: ["Smooth, even twist", "Hook size matched to the pattern", "Enough quantity from one shade lot", "Shade availability before ordering"],
  },
  {
    id: "knitting",
    label: "Knitting",
    tag: "Knitting",
    icon: Sparkle,
    summary: "Babywear, scarves, sweaters, blankets and soft knitted pieces.",
    checks: ["Yarn weight or ply", "Needle-size guidance", "Softness for the intended use", "Quantity required by the pattern"],
  },
  {
    id: "macrame",
    label: "Macrame & baskets",
    tag: "Macrame",
    icon: Scissors,
    summary: "Plant hangers, wall decor, baskets and structured handmade pieces.",
    checks: ["Single or twisted cord", "3 mm or 4 mm thickness", "Roll length for the complete project", "Natural or coloured finish"],
  },
  {
    id: "bags",
    label: "Bag making",
    tag: "Bag Making",
    icon: Handbag,
    summary: "Crochet bags, purses, clutches, bases, handles and finishing hardware.",
    checks: ["Sturdy yarn or cord", "Compatible base and handle size", "Locks, rings and magnets", "Matching hardware colour"],
  },
  {
    id: "embroidery",
    label: "Embroidery",
    tag: "Embroidery",
    icon: Scissors,
    summary: "Decorative stitching, surface work and colourful detailing.",
    checks: ["Thread type for the fabric", "Required number of strands", "Exact shade or colour family", "Needle and hoop compatibility"],
  },
  {
    id: "beginner",
    label: "Beginner friendly",
    tag: "Beginner Friendly",
    icon: CheckCircle,
    summary: "A simpler starting point for a first crochet, knitting or craft project.",
    checks: ["Medium thickness that is easy to see", "Smooth yarn that does not split easily", "Comfortable hook or needle", "A small project with limited colours"],
  },
];

export default function YarnGuide() {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  const selected = useMemo(
    () => PROJECTS.find((project) => project.id === selectedId) || PROJECTS[0],
    [selectedId],
  );

  useDocumentMeta({
    title: "Yarn & Craft Material Guide",
    description:
      "Choose yarn, thread, macrame cord and bag-making materials by project, then browse matching Fakhri Mart products or ask on WhatsApp.",
    pathname: "/yarn-guide",
  });
  useJsonLd(faqPageJsonLd(storeFaqs));

  const message = [
    `Hello ${businessInfo.name}, I am making a ${selected.label.toLowerCase()} project.`,
    "Please suggest suitable materials, available shades, quantity, price and the right tools or accessories.",
    "My delivery city is: ____",
  ].join(" ");

  return (
    <>
      <PageHero
        motif="line"
        eyebrow="Project finder"
        title="Start with what you want to make"
        text="Choose a project to see the practical details worth checking before you buy yarn, thread, cord, hooks or bag-making accessories."
      >
        <picture className="catalogue-hero-photo">
          <source srcSet="/assets/images/editorial/shade-library-640.avif" type="image/avif" />
          <img
            src="/assets/images/editorial/shade-library-640.webp"
            alt="Colourful yarn and thread shade library"
            width="640"
            height="427"
          />
        </picture>
      </PageHero>

      <section className="section">
        <div className="container project-finder">
          <div className="project-finder__options" aria-label="Choose a project type">
            {PROJECTS.map((project) => {
              const Icon = project.icon;
              const active = project.id === selected.id;
              return (
                <button
                  key={project.id}
                  type="button"
                  className={`project-choice ${active ? "project-choice--active" : ""}`}
                  aria-pressed={active}
                  onClick={() => setSelectedId(project.id)}
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
            <span className="eyebrow">Material checklist</span>
            <h2>{selected.label}</h2>
            <p>{selected.summary}</p>
            <ul>
              {selected.checks.map((item) => (
                <li key={item}>
                  <CheckCircle size={19} weight="fill" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="project-recommendation__actions">
              <Link className="btn btn-primary" to={`/products?tag=${encodeURIComponent(selected.tag)}`}>
                Browse matching products <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                className="btn btn-whatsapp"
                href={`https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ChatCircleDots size={18} aria-hidden="true" /> Ask on WhatsApp
              </a>
            </div>
            <small>Share a project photo or pattern for a more accurate recommendation.</small>
          </Reveal>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container guide-faqs">
          <div>
            <span className="eyebrow">Before you enquire</span>
            <h2>Five details that prevent the wrong purchase</h2>
            <ol>
              <li>What are you making?</li>
              <li>Which colour or shade family do you need?</li>
              <li>How much material does the pattern require?</li>
              <li>Do you already have the hook, needle, base or handle?</li>
              <li>Is it one project, a bulk order or repeat supply?</li>
            </ol>
          </div>
          <div className="guide-faqs__list">
            {storeFaqs.map((faq) => (
              <details key={faq.question}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
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
