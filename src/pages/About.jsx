// src/pages/About.jsx
// About — real business story, real photography. No abstract decorative filler.

import { Reveal } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { businessInfo } from "../data/catalogue.js";

export default function About() {
  useDocumentMeta({
    title: "About",
    description: `${businessInfo.name} — a yarn, thread and craft-accessories specialty store. Real story, real products, WhatsApp-first service.`,
    canonical: `${businessInfo.url}/about`,
  });

  return (
    <div className="about-page">
      <div className="container">
        <Reveal>
          <header className="page-header">
            <p className="eyebrow">Our story</p>
            <h1>About {businessInfo.shortName}</h1>
            <p className="page-lede">{businessInfo.tagline}</p>
          </header>
        </Reveal>

        <div className="about-grid">
          <Reveal>
            <div className="about-content">
              <p>
                {businessInfo.name} is a yarn, thread and craft-accessories specialty store
                based in {businessInfo.location}. We carry crochet threads, knitting yarns,
                macrame cords, embroidery floss, beads, bases, purse handles and the small
                hardware a maker needs to finish a piece — sourced from brands we use ourselves,
                including Bliss, Vardhaman, Ganga and a handful of small-batch suppliers.
              </p>
              <p>
                There's no checkout and no account. The whole catalogue is a WhatsApp enquiry
                basket — pick what you like, send one message, we reply with availability and
                pricing. It keeps things personal, which is how craft shopping should feel.
                {businessInfo.delivery}.
              </p>
              <p>
                We work with individual crafters, boutiques, resellers and wholesalers across
                India. Whether you need a single ball to finish a project or a bulk order for a
                store, the conversation starts the same way: a WhatsApp message.
              </p>
              <p>
                <strong>Hours:</strong> {businessInfo.hours}.<br />
                <strong>Location:</strong> {businessInfo.address}.<br />
                <strong>Phone:</strong> {businessInfo.phoneDisplay}.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div className="about-photography">
              <img
                src="/assets/images/products/cotton-dreamz/hero.webp"
                alt="Cotton Dreamz yarn in seafoam, hot pink and butter yellow"
                loading="lazy"
                className="about-photo"
              />
              <img
                src="/assets/images/products/single-macrame-cord/hero.webp"
                alt="Single-twist macrame cord in natural beige"
                loading="lazy"
                className="about-photo"
              />
              <img
                src="/assets/images/products/anchor-lacchi/hero.webp"
                alt="Anchor Lacchi embroidery thread in magenta and jade"
                loading="lazy"
                className="about-photo"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
