import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Compass,
  Sparkle,
} from "@phosphor-icons/react";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import GlossaryTerm from "../components/GlossaryTerm.jsx";
import { businessInfo, featuredProducts } from "../data/siteData.js";
import { PROJECTS, getProductDiscoveryMeta, productsForProject } from "../data/discoveryData.js";
import { storeFaqs } from "../data/businessProfile.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { faqPageJsonLd, useJsonLd } from "../hooks/useJsonLd.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

const FINISHES = [
  { id: "balanced", label: "No strong preference", hint: "Show the best project matches from the current catalogue." },
  { id: "soft", label: "Soft / comfortable", hint: "Prioritise catalogue text that explicitly mentions softness, cotton or wearables." },
  { id: "structured", label: "Structured / sturdy", hint: "Prioritise cord, T-shirt yarn and bag-making context." },
  { id: "detailed", label: "Fine / detailed", hint: "Prioritise thread, embroidery and detailed crochet context." },
];

const EXPERIENCE = [
  { id: "beginner", label: "I’m learning", hint: "Give extra weight to products already tagged beginner friendly." },
  { id: "comfortable", label: "I know the basics", hint: "Keep the ranking centred on project fit." },
  { id: "experienced", label: "I’m experienced", hint: "Show the strongest project matches without simplifying the shortlist." },
];

function rankRecommendations(projectSlug, finish, experience) {
  return productsForProject(featuredProducts, projectSlug)
    .map((entry) => {
      const meta = getProductDiscoveryMeta(entry.product);
      let score = entry.score;
      const text = meta.searchableText;
      if (finish === "soft" && /soft|cotton|wearable/.test(text)) score += 7;
      if (finish === "structured" && /macrame|t shirt|bag making|cord|base|handle/.test(text)) score += 7;
      if (finish === "detailed" && /embroidery|crochet thread|lacchi|decorative thread/.test(text)) score += 7;
      if (experience === "beginner" && (entry.product.tags || []).includes("Beginner Friendly")) score += 8;
      return { ...entry, score };
    })
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}

export default function YarnGuide() {
  const [projectSlug, setProjectSlug] = useState(PROJECTS[0].slug);
  const [finish, setFinish] = useState("balanced");
  const [experience, setExperience] = useState("comfortable");
  const [showResults, setShowResults] = useState(false);

  useDocumentMeta({
    title: "Guided Yarn & Craft Material Finder | Fakhri Mart",
    description: "Tell Fakhri Mart what you are making, the finish you want and your experience level to shortlist suitable catalogue materials before enquiring.",
    canonical: "/yarn-guide",
  });
  useJsonLd(faqPageJsonLd(storeFaqs));

  const project = PROJECTS.find((item) => item.slug === projectSlug) || PROJECTS[0];
  const recommendations = useMemo(
    () => rankRecommendations(projectSlug, finish, experience).slice(0, 5),
    [projectSlug, finish, experience],
  );

  const selectedFinish = FINISHES.find((item) => item.id === finish);
  const selectedExperience = EXPERIENCE.find((item) => item.id === experience);
  const message = [
    `Hello ${businessInfo.name}, I am planning a *${project.name}* project.`,
    `Finish preference: *${selectedFinish?.label}*.` ,
    `Experience: *${selectedExperience?.label}*.` ,
    recommendations.length ? `The website shortlisted: ${recommendations.map(({ product }) => product.name).join(", ")}.` : "",
    "Please help me confirm the best current material, shade, pack details, quantity and price. My delivery city is: ____",
  ].filter(Boolean).join(" ");

  const revealResults = () => {
    setShowResults(true);
    trackEngagement("guide_result", {
      project: project.slug,
      craft: project.preferredTags?.[0] || project.name,
      count: recommendations.length,
      source: "yarn-guide",
    });
    window.requestAnimationFrame(() => document.getElementById("guide-results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <PageHero
        motif="line"
        eyebrow="Guided material finder"
        title="Tell us what you want to make"
        text="Three practical choices create a shortlist from real catalogue fields. The finder never invents live stock, price or fibre composition."
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

      <section className="section guided-finder">
        <div className="container guided-finder__shell">
          <div className="guided-finder__steps" aria-label="Material finder questions">
            <fieldset className="guided-question">
              <legend><span>01</span> What are you making?</legend>
              <div className="guided-choice-grid guided-choice-grid--projects">
                {PROJECTS.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    className={projectSlug === item.slug ? "is-selected" : ""}
                    onClick={() => { setProjectSlug(item.slug); setShowResults(false); }}
                    aria-pressed={projectSlug === item.slug}
                  >
                    <strong>{item.name}</strong>
                    <small>{item.description}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="guided-question">
              <legend><span>02</span> What finish do you want?</legend>
              <div className="guided-choice-grid">
                {FINISHES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={finish === item.id ? "is-selected" : ""}
                    onClick={() => { setFinish(item.id); setShowResults(false); }}
                    aria-pressed={finish === item.id}
                  >
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="guided-question">
              <legend><span>03</span> How experienced are you?</legend>
              <div className="guided-choice-grid">
                {EXPERIENCE.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={experience === item.id ? "is-selected" : ""}
                    onClick={() => { setExperience(item.id); setShowResults(false); }}
                    aria-pressed={experience === item.id}
                  >
                    <strong>{item.label}</strong>
                    <small>{item.hint}</small>
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <aside className="guided-finder__summary">
            <Compass size={27} aria-hidden="true" />
            <p className="eyebrow">Your brief</p>
            <h2>{project.name}</h2>
            <dl>
              <div><dt>Finish</dt><dd>{selectedFinish?.label}</dd></div>
              <div><dt>Experience</dt><dd>{selectedExperience?.label}</dd></div>
            </dl>
            <button type="button" className="btn btn-primary" onClick={revealResults}>
              Find matching materials <ArrowRight size={17} />
            </button>
            <small>Recommendations are based only on existing catalogue tags, names and descriptions.</small>
          </aside>
        </div>
      </section>

      <section id="guide-results" className={`section section-tinted guide-results ${showResults ? "is-visible" : ""}`} aria-live="polite">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Shortlist</p>
              <h2>{showResults ? `Good catalogue matches for ${project.name.toLowerCase()}` : "Your recommendations will appear here"}</h2>
              <p>{showResults ? "Open a product to compare shades, request current photos or add it to one organised enquiry." : "Complete the three choices above, then generate your shortlist."}</p>
            </div>
            {showResults ? (
              <a className="btn btn-whatsapp" href={`https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
                <ChatCircleDots size={17} /> Ask Fakhri Mart about this shortlist
              </a>
            ) : null}
          </div>

          {showResults ? (
            recommendations.length ? (
              <div className="card-grid product-grid">
                {recommendations.map(({ product }) => <ProductCard key={product.slug} product={product} compact />)}
              </div>
            ) : (
              <div className="guide-empty"><p>No confident direct matches were found from the current catalogue data.</p><Link className="btn btn-primary" to="/products">Browse all materials</Link></div>
            )
          ) : null}
        </div>
      </section>

      <section className="section guide-literacy">
        <div className="container guide-literacy__grid">
          <div>
            <p className="eyebrow">Buying vocabulary</p>
            <h2>Know enough to ask the right question</h2>
            <p>You do not need to become a yarn expert. These small definitions help you understand the information Fakhri Mart may confirm from the current pack.</p>
          </div>
          <div className="guide-literacy__terms">
            <p><GlossaryTerm term="Ply">Ply</GlossaryTerm> — useful construction context, but not a universal thickness standard.</p>
            <p><GlossaryTerm term="Macramé cord">Macramé cord</GlossaryTerm> — single and twisted structures behave differently.</p>
            <p><GlossaryTerm term="Lacchi">Lacchi</GlossaryTerm> — a bundled thread format used for decorative work.</p>
            <p><GlossaryTerm term="Representative shade">Representative shade</GlossaryTerm> — screen colour is not a substitute for a current photo.</p>
          </div>
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
        <div className="container"><StoreLocation compact /></div>
      </section>
    </>
  );
}
