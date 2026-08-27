import { ArrowRight, BookOpen, Compass, Package, Sparkle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import { catalogueMessage, createWhatsAppLink } from "../../data/siteData.js";

const shortcuts = [
  {
    icon: Compass,
    eyebrow: "I know the project",
    title: "Shop by what you make",
    text: "Crochet, knitting, macrame, bags or embroidery.",
    to: "/products?q=Crochet",
  },
  {
    icon: BookOpen,
    eyebrow: "I need help choosing",
    title: "Open the yarn guide",
    text: "Compare weight, fibre, texture and project fit.",
    to: "/yarn-guide",
  },
  {
    icon: Package,
    eyebrow: "I need quantity",
    title: "Build a bulk enquiry",
    text: "Prepare colours and quantities for resale or projects.",
    to: "/enquiry",
  },
];

export default function MakerHelpStrip() {
  return (
    <section className="maker-help" aria-label="Quick ways to find the right craft material">
      <div className="container maker-help__grid">
        <div className="maker-help__lead">
          <Sparkle size={18} weight="fill" />
          <span>Start your way</span>
        </div>
        {shortcuts.map(({ icon: Icon, eyebrow, title, text, to }) => (
          <Link className="maker-help__item" key={title} to={to}>
            <Icon size={22} />
            <span>
              <small>{eyebrow}</small>
              <strong>{title}</strong>
              <em>{text}</em>
            </span>
            <ArrowRight size={17} />
          </Link>
        ))}
        <a
          className="maker-help__item maker-help__item--whatsapp"
          href={createWhatsAppLink(catalogueMessage)}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon size={22} />
          <span>
            <small>I want a human answer</small>
            <strong>Ask on WhatsApp</strong>
            <em>Check live shades, stock and current pricing.</em>
          </span>
          <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}
