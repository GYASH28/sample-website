import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle,
  Compass,
  Package,
  Palette,
  Ruler,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { blogPosts } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const START_HERE = [
  {
    icon: Compass,
    eyebrow: "I do not know what to buy",
    title: "Use the material matcher",
    text: "Start from the project, finish and experience level, then shortlist catalogue options without guessing live stock.",
    to: "/yarn-guide",
  },
  {
    icon: Calculator,
    eyebrow: "I have a pattern",
    title: "Calculate packs needed",
    text: "Convert a known pattern requirement into balls, cones or packs and add a sensible safety buffer.",
    href: "#quantity-planner",
  },
  {
    icon: Palette,
    eyebrow: "Colour matters",
    title: "Buy shades more safely",
    text: "Know what a screen preview can tell you, what it cannot, and what to confirm before paying.",
    href: "#shade-checklist",
  },
  {
    icon: Package,
    eyebrow: "I am buying in quantity",
    title: "Prepare a wholesale brief",
    text: "Send product, shade, pack, quantity and delivery details together so the quote can be useful the first time.",
    href: "#wholesale-checklist",
  },
];

const MATERIAL_GUIDE = [
  {
    name: "Yarn",
    bestFor: "Crochet, knitting, garments, blankets, toys and general handmade projects.",
    check: "Match the pattern's yarn thickness/weight, fibre or composition, length per ball, suggested hook/needle and care label.",
  },
  {
    name: "Crochet thread",
    bestFor: "Detailed crochet, smaller stitches, decorative work and projects where a finer strand is useful.",
    check: "Confirm the exact thread line, thickness/ply information on the current pack, shade code and how it is sold.",
  },
  {
    name: "Embroidery & decorative thread",
    bestFor: "Surface embroidery, accents, festive detailing, embellishment and colour work.",
    check: "Confirm thread format, usable strand/construction information, shade code and current bundle or pack format.",
  },
  {
    name: "Macramé cord / Malai Dori",
    bestFor: "Knotted décor, bags, baskets, organisers and projects that need visible structure.",
    check: "Diameter, single/twisted construction where specified, roll/pack quantity and how firmly the finished piece should hold shape.",
  },
  {
    name: "T-shirt / structured yarn",
    bestFor: "Bags, baskets, mats and larger structured crochet or craft pieces.",
    check: "Width/thickness, pack weight or length, stretch, project gauge and the quantity needed for the finished size.",
  },
];

const LABEL_CHECKS = [
  ["1", "Material / composition", "Use the current product label when fibre content matters; do not infer it from a product photo."],
  ["2", "Thickness / yarn weight", "Yarn weight means strand thickness, not how heavy the ball is. Ply count alone is not a universal thickness system."],
  ["3", "Length and net weight", "These tell you what one ball, cone or pack contains and are essential when comparing pattern requirements."],
  ["4", "Suggested hook / needle", "Treat the label size as a starting point. Your pattern gauge and tension decide the final tool size."],
  ["5", "Shade / batch information", "Use the shade code as the reference. If the supplier uses dye lots or batch numbers, keep them consistent for one project."],
  ["6", "Care instructions", "For wearables, baby items or washable homeware, confirm washing and drying guidance before buying the full quantity."],
];

const SHADE_CHECKS = [
  "Use the digital colour preview to compare colour families, not to approve the final colour.",
  "Ask for the current supplier shade card or a live stock photo when the exact shade matters.",
  "Send the written shade code/name with the enquiry instead of relying only on a screenshot.",
  "For a large project, confirm that enough quantity is available in the required shade before splitting the order.",
  "If batch or dye-lot information exists for that product, ask whether the quantity can be supplied consistently.",
];

const WHOLESALE_CHECKS = [
  "Exact product line or a short list of acceptable alternatives",
  "Shade names/codes and quantity required for each shade",
  "Preferred pack, cone, ball or roll format if it matters",
  "Whether substitution is acceptable if one shade or line is unavailable",
  "Delivery city / PIN code and whether the order is urgent or repeat supply",
  "Any must-match specification from your pattern, label, boutique or customer",
];

const MISTAKES = [
  {
    title: "Buying by colour alone",
    text: "Two similar colours can belong to very different yarn/thread constructions. Confirm the material line first, then the shade.",
  },
  {
    title: "Treating ply as exact thickness",
    text: "Ply describes construction and is not a universal replacement for a yarn-weight or measured-thickness specification.",
  },
  {
    title: "Comparing only grams",
    text: "Two 100 g balls can contain very different lengths. For pattern substitution, compare length, thickness and gauge information too.",
  },
  {
    title: "Ordering before checking total quantity",
    text: "Use the pattern requirement first, add a small buffer, then confirm enough stock in the chosen shade before finalising.",
  },
];

function QuickStartCard({ item, index }) {
  const Icon = item.icon;
  const content = (
    <>
      <span className="guides-start-card__icon"><Icon size={24} weight="duotone" /></span>
      <span className="guides-start-card__copy">
        <small>{item.eyebrow}</small>
        <strong>{item.title}</strong>
        <span>{item.text}</span>
      </span>
      <ArrowRight size={18} />
    </>
  );

  return (
    <Reveal as="article" className="guides-start-card" delay={index * 45} variant="fade-up">
      {item.to ? <Link to={item.to}>{content}</Link> : <a href={item.href}>{content}</a>}
    </Reveal>
  );
}

export default function Blog() {
  const [requiredAmount, setRequiredAmount] = useState("500");
  const [packAmount, setPackAmount] = useState("100");
  const [buffer, setBuffer] = useState("10");
  const [unit, setUnit] = useState("g");

  useDocumentMeta({
    title: "Yarn & Craft Guides, Calculators & Buying Help | Fakhri Mart",
    description: "Practical yarn and craft-material help from Fakhri Mart: choose materials, understand thickness, calculate packs, confirm shades and prepare retail or wholesale enquiries.",
    canonical: "/blog",
  });

  const estimate = useMemo(() => {
    const required = Number(requiredAmount);
    const perPack = Number(packAmount);
    const extraPercent = Math.max(0, Number(buffer) || 0);
    if (!Number.isFinite(required) || required <= 0 || !Number.isFinite(perPack) || perPack <= 0) return null;
    const adjusted = required * (1 + extraPercent / 100);
    const packs = Math.ceil(adjusted / perPack);
    return {
      packs,
      adjusted,
      spare: Math.max(0, packs * perPack - adjusted),
    };
  }, [requiredAmount, packAmount, buffer]);

  return (
    <div className="guides-hub">
      <PageHero
        motif="editorial"
        eyebrow="Guides & practical tools"
        title="Choose craft materials with fewer guesses"
        text="Use this page while you are planning, comparing or preparing an order. It explains what to check, calculates a known pattern requirement and shows when you should ask Fakhri Mart for live shade, stock or pack confirmation."
      >
        <div className="guides-hero-proof" aria-label="What this guide hub helps with">
          <div className="guides-hero-proof__intro">
            <span className="guides-hero-proof__icon"><BookOpen size={27} weight="duotone" /></span>
            <div>
              <strong>Practical help, built around the real catalogue</strong>
              <p>Choose a starting point now, then jump straight to the relevant checklist or calculator.</p>
            </div>
          </div>
          <div className="guides-hero-proof__topics">
            <span><CheckCircle size={17} weight="fill" /> Material choice</span>
            <span><CheckCircle size={17} weight="fill" /> Quantity planning</span>
            <span><CheckCircle size={17} weight="fill" /> Shade confidence</span>
            <span><CheckCircle size={17} weight="fill" /> Bulk enquiry prep</span>
          </div>
        </div>
      </PageHero>

      <section className="section guides-start" aria-labelledby="guides-start-title">
        <div className="container">
          <div className="section-heading guides-section-heading">
            <div>
              <p className="eyebrow">Start with your situation</p>
              <h2 id="guides-start-title">What are you trying to solve?</h2>
              <p>Pick the shortest path instead of reading the whole page.</p>
            </div>
          </div>
          <div className="guides-start-grid">
            {START_HERE.map((item, index) => <QuickStartCard item={item} index={index} key={item.title} />)}
          </div>
        </div>
      </section>

      <section id="choose-material" className="section section-tinted guides-materials" aria-labelledby="material-guide-title">
        <div className="container">
          <div className="section-heading guides-section-heading">
            <div>
              <p className="eyebrow">Material chooser</p>
              <h2 id="material-guide-title">Start with the job the material has to do</h2>
              <p>Product names can be confusing. First identify the project behaviour you need, then compare the exact supplier-backed product lines in the catalogue.</p>
            </div>
            <Link className="btn btn-outline" to="/products">Open catalogue <ArrowRight size={17} /></Link>
          </div>

          <div className="guides-material-grid">
            {MATERIAL_GUIDE.map((item, index) => (
              <Reveal as="article" className="guides-material-card" key={item.name} delay={index * 35} variant="fade-up">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.name}</h3>
                <p><strong>Usually useful for:</strong> {item.bestFor}</p>
                <p><strong>Before buying:</strong> {item.check}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section guides-label-guide" aria-labelledby="label-guide-title">
        <div className="container guides-two-column">
          <Reveal className="guides-sticky-copy" variant="slide-left">
            <p className="eyebrow">Read the pack, not the photo</p>
            <h2 id="label-guide-title">Six things to check on a yarn or thread label</h2>
            <p>A product photo is good for recognising the line. The label or current supplier material is where you verify the technical information that can change the result of a project.</p>
            <Link className="text-link" to="/yarn-guide">Need a shortlist first? Use the material matcher <ArrowRight size={17} /></Link>
          </Reveal>
          <div className="guides-check-list">
            {LABEL_CHECKS.map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="quantity-planner" className="section section-tinted quantity-planner" aria-labelledby="quantity-planner-title">
        <div className="container quantity-planner__grid">
          <Reveal className="quantity-planner__copy" variant="slide-left">
            <p className="eyebrow">Quantity calculator</p>
            <h2 id="quantity-planner-title">Turn a known pattern requirement into packs</h2>
            <p>This calculator does not guess how much yarn a project needs. Give it the amount your pattern already requires and the amount in one current ball/cone/pack.</p>
            <div className="quantity-planner__notes">
              <p><Ruler size={18} /> Use the <strong>same unit</strong> for both numbers.</p>
              <p><BookOpen size={18} /> Metres/yards are usually more reliable than grams when substituting one yarn for another.</p>
              <p><Package size={18} /> Confirm the current pack label before placing the final order.</p>
            </div>
          </Reveal>

          <Reveal as="form" className="quantity-calculator" delay={70} variant="fade-up" onSubmit={(event) => event.preventDefault()}>
            <div className="quantity-calculator__head">
              <span className="quantity-calculator__icon"><Calculator size={24} weight="duotone" /></span>
              <div><strong>Pack calculator</strong><small>Known requirement → packs to buy</small></div>
            </div>

            <div className="quantity-calculator__fields">
              <label>
                <span>Pattern needs</span>
                <input type="number" min="1" step="1" inputMode="decimal" value={requiredAmount} onChange={(event) => setRequiredAmount(event.target.value)} />
              </label>
              <label>
                <span>One pack contains</span>
                <input type="number" min="1" step="1" inputMode="decimal" value={packAmount} onChange={(event) => setPackAmount(event.target.value)} />
              </label>
              <label>
                <span>Unit</span>
                <select value={unit} onChange={(event) => setUnit(event.target.value)}>
                  <option value="g">grams</option>
                  <option value="m">metres</option>
                  <option value="yd">yards</option>
                </select>
              </label>
              <label>
                <span>Safety buffer</span>
                <select value={buffer} onChange={(event) => setBuffer(event.target.value)}>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="10">10%</option>
                  <option value="15">15%</option>
                  <option value="20">20%</option>
                </select>
              </label>
            </div>

            <div className="quantity-calculator__result" aria-live="polite">
              {estimate ? (
                <>
                  <span>You should plan for</span>
                  <strong>{estimate.packs} {estimate.packs === 1 ? "pack" : "packs"}</strong>
                  <small>
                    Requirement with buffer: {Math.ceil(estimate.adjusted)} {unit}. Approx. {Math.floor(estimate.spare)} {unit} remains after rounding up to whole packs.
                  </small>
                </>
              ) : (
                <><span>Enter two positive numbers</span><strong>—</strong><small>The result will appear here.</small></>
              )}
            </div>
            <p className="quantity-calculator__disclaimer">For fitted garments or gauge-sensitive patterns, match the pattern specification and make a swatch before buying the full quantity.</p>
          </Reveal>
        </div>
      </section>

      <section id="shade-checklist" className="section guides-shades" aria-labelledby="shade-guide-title">
        <div className="container guides-two-column guides-two-column--reverse">
          <div className="guides-check-list guides-check-list--accent">
            {SHADE_CHECKS.map((item, index) => (
              <article key={item}>
                <span>{index + 1}</span>
                <div><p>{item}</p></div>
              </article>
            ))}
          </div>
          <Reveal className="guides-sticky-copy" variant="slide-right">
            <p className="eyebrow">Colour confidence</p>
            <h2 id="shade-guide-title">A screen can narrow the colour. It cannot approve it.</h2>
            <p>Displays, lighting, supplier photography and physical batches can all change how colour looks. Use Fakhri Mart's digital preview to explore, then confirm the live shade before ordering when colour accuracy matters.</p>
            <Link className="btn btn-primary" to="/products">Browse products & digital previews <ArrowRight size={17} /></Link>
          </Reveal>
        </div>
      </section>

      <section id="wholesale-checklist" className="section section-tinted guides-wholesale" aria-labelledby="wholesale-guide-title">
        <div className="container guides-wholesale__grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">Retail, boutique & wholesale</p>
            <h2 id="wholesale-guide-title">A better enquiry gets a better answer</h2>
            <p>Instead of sending several disconnected messages, prepare one requirement that Fakhri Mart can actually quote and confirm.</p>
            <div className="guides-wholesale__actions">
              <Link className="btn btn-primary" to="/enquiry"><ShoppingBagOpen size={18} /> Build an enquiry</Link>
              <Link className="btn btn-outline" to="/collections/wholesale-yarn-pune">Wholesale catalogue path</Link>
            </div>
          </Reveal>
          <div className="guides-wholesale__checklist">
            {WHOLESALE_CHECKS.map((item) => <p key={item}><CheckCircle size={19} weight="fill" /> {item}</p>)}
          </div>
        </div>
      </section>

      <section className="section guides-mistakes" aria-labelledby="mistakes-title">
        <div className="container">
          <div className="section-heading guides-section-heading"><div><p className="eyebrow">Avoid expensive mistakes</p><h2 id="mistakes-title">Four checks that save re-ordering later</h2></div></div>
          <div className="guides-mistake-grid">
            {MISTAKES.map((item, index) => (
              <Reveal as="article" key={item.title} delay={index * 40} variant="fade-up">
                <span>{String(index + 1).padStart(2, "0")}</span><h3>{item.title}</h3><p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted guides-reading" aria-labelledby="deep-guides-title">
        <div className="container">
          <div className="section-heading guides-section-heading">
            <div>
              <p className="eyebrow">Deep reads</p>
              <h2 id="deep-guides-title">Learn the topic when you need more detail</h2>
              <p>The articles stay here as reference material; the practical tools above are for making the buying decision.</p>
            </div>
          </div>
          <div className="guides-reading-grid">
            {blogPosts.map((post, index) => (
              <Reveal as="article" className="guides-reading-card" key={post.slug} delay={index * 45} variant="fade-up">
                <span className="eyebrow">{post.category || "Craft guide"} · {post.readMinutes} min read</span>
                <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{post.excerpt}</p>
                <Link className="text-link" to={`/blog/${post.slug}`}>Read guide <ArrowRight size={17} /></Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
