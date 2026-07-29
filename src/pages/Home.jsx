import HeroSignature from "../components/home/HeroSignature.jsx";
import {
  FeaturedEditSection,
  MaterialIndexSection,
  MaterialRibbon,
  ProcessSection,
  ShadeDeskSection,
  TradePanelSection,
} from "../components/home/HomeSections.jsx";
import {
  businessInfo,
  featuredProducts,
  productCategories,
} from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import {
  localBusinessJsonLd,
  useJsonLd,
  websiteJsonLd,
} from "../hooks/useJsonLd.js";

const categoryNames = [
  "Bliss Threads",
  "T-Shirt Yarn",
  "Macrame Cord",
  "Embroidery Threads",
  "Beads",
  "Purse Materials",
];

const shadeSlugs = [
  "cotton-dreamz",
  "makhhi-thread",
  "single-macrame-cord",
];

const featuredSlugs = [
  "makhhi-thread",
  "cotton-dreamz",
  "single-macrame-cord",
  "purse-handles",
];

const categoryEdit = categoryNames
  .map((name) => productCategories.find((category) => category.name === name))
  .filter(Boolean);

const shadeProducts = shadeSlugs
  .map((slug) => featuredProducts.find((product) => product.slug === slug))
  .filter(Boolean);

const featuredEdit = featuredSlugs
  .map((slug) => featuredProducts.find((product) => product.slug === slug))
  .filter(Boolean);

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart | Yarn, Threads & Craft Materials from Pune",
    description:
      "Browse yarn, crochet thread, macrame cord and bag-making supplies. Ask Fakhri Mart for current shades, pack sizes and quantity-based prices.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  return (
    <div className="fm-home">
      <HeroSignature />
      <MaterialRibbon categories={categoryEdit} />
      <MaterialIndexSection categories={categoryEdit} />
      <ShadeDeskSection products={shadeProducts} />
      <FeaturedEditSection products={featuredEdit} />
      <ProcessSection />
      <TradePanelSection />
    </div>
  );
}
