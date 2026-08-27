import { ArrowRight, BookOpen, Compass, Package, Sparkle } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import { catalogueMessage, createWhatsAppLink } from "../../data/siteData.js";

const HELP_STYLES = `.maker-help{position:relative;z-index:2;padding:18px 0;border-block:1px solid var(--ui-border);background:color-mix(in srgb,var(--ui-surface) 78%,transparent)}.maker-help__grid{display:grid;grid-template-columns:auto repeat(4,minmax(0,1fr));gap:9px;align-items:stretch}.maker-help__lead{display:flex;gap:8px;align-items:center;padding:0 12px 0 0;color:var(--ui-gold);font-size:.7rem;font-weight:850;letter-spacing:.08em;text-transform:uppercase;white-space:nowrap}.maker-help__item{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;min-width:0;padding:12px 13px;border:1px solid var(--ui-border);border-radius:14px;background:var(--ui-surface);box-shadow:0 4px 16px rgba(47,38,48,.035);transition:transform .22s var(--v17e),border-color .22s ease,box-shadow .22s ease}.maker-help__item>svg{color:var(--ui-accent);flex:none}.maker-help__item>span{display:grid;min-width:0}.maker-help__item small{font-size:.62rem;font-weight:800;color:var(--ui-text-subtle);text-transform:uppercase;letter-spacing:.06em}.maker-help__item strong{font-size:.83rem;line-height:1.2}.maker-help__item em{margin-top:2px;overflow:hidden;color:var(--ui-text-muted);font-size:.67rem;font-style:normal;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}.maker-help__item--whatsapp>svg{color:#1f9d66}@media(hover:hover) and (pointer:fine){.maker-help__item:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--ui-accent) 36%,var(--ui-border));box-shadow:0 16px 36px rgba(47,38,48,.09)}}@media(max-width:980px) and (min-width:801px){.maker-help__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.maker-help__lead{grid-column:1/-1;padding:0 2px 4px}}@media(max-width:800px){.maker-help{padding:14px 0}.maker-help__grid{display:grid;grid-auto-flow:column;grid-auto-columns:min(84vw,340px);grid-template-columns:none;gap:9px;overflow-x:auto;scroll-snap-type:x mandatory;overscroll-behavior-inline:contain;scrollbar-width:none;padding-right:20px}.maker-help__lead{display:none}.maker-help__item{scroll-snap-align:start;min-height:86px}.maker-help__item em{white-space:normal}}@media(prefers-reduced-motion:reduce){.maker-help__item{transition:none!important}}`;

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
      <style>{HELP_STYLES}</style>
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
