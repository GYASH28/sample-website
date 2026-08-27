import CommerceHero from "../components/home/CommerceHero.jsx";
import MakerHelpStrip from "../components/home/MakerHelpStrip.jsx";
import {
  CommerceBenefits,
  CommerceCategoryGrid,
  CommerceCategoryNav,
  CommerceCraftFinder,
  CommerceOrderFlow,
  CommerceProductRail,
  CommerceWholesaleCta,
} from "../components/home/CommerceHomeSections.jsx";
import { RecentlyViewedHome, ShadeDiscovery } from "../components/home/StorefrontDiscovery.jsx";
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

const RAIL_SIZE = 6;
const popularProducts = featuredProducts.slice(0, RAIL_SIZE);
const yarnProducts = featuredProducts.filter((product) => product.masterCategory === "Yarns").slice(0, RAIL_SIZE);
const threadProducts = featuredProducts.filter((product) => product.masterCategory === "Threads").slice(0, RAIL_SIZE);
const accessoryProducts = featuredProducts.filter((product) => product.masterCategory === "Accessories").slice(0, RAIL_SIZE);

const macrameAndBagProducts = featuredProducts
  .filter((product) => {
    const searchable = [product.name, product.category, product.suitableFor, ...(product.tags || []), ...(product.filters || [])].join(" ");
    return /macrame|cord|bag|purse|handle|base|bead|hook/i.test(searchable);
  })
  .slice(0, RAIL_SIZE);

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart | Shop Yarn, Threads & Craft Materials",
    description:
      "Shop yarn, crochet thread, macrame cord, embroidery supplies, beads and bag-making materials. Quick-view products, save shades and build a retail or wholesale WhatsApp enquiry.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  return (
    <div className="fm-home commerce-home product-first-home">
      <CommerceHero />
      <CommerceCategoryNav categories={productCategories} />
      <MakerHelpStrip />

      <CommerceProductRail
        eyebrow="Popular right now"
        title="Start with the products customers ask for most"
        text="Quick-view shades, choose a quantity and add products to your enquiry without leaving the homepage."
        products={popularProducts}
        href="/products"
      />

      <CommerceCraftFinder products={featuredProducts} />
      <CommerceCategoryGrid categories={productCategories.slice(0, 8)} />
      <ShadeDiscovery />
      <RecentlyViewedHome />

      <CommerceProductRail
        eyebrow="Yarn collection"
        title="Yarns for crochet, knitting and soft projects"
        text="Browse cotton, soft, baby and everyday yarn families with shade previews and project guidance."
        products={yarnProducts.length ? yarnProducts : popularProducts}
        href="/products?department=Yarns"
      />

      <CommerceProductRail
        eyebrow="Thread collection"
        title="Crochet, embroidery and decorative threads"
        text="Compare thread types, available shade families and the projects they suit before requesting current stock."
        products={threadProducts.length ? threadProducts : featuredProducts.slice(4, 4 + RAIL_SIZE)}
        href="/products?department=Threads"
      />

      <CommerceProductRail
        eyebrow="Macrame and bag making"
        title="Cords, handles, bases, beads and finishing pieces"
        text="Build the whole project from one place instead of searching across unrelated category pages."
        products={macrameAndBagProducts.length ? macrameAndBagProducts : accessoryProducts}
        href="/products?department=Accessories"
      />

      <CommerceProductRail
        eyebrow="Tools and accessories"
        title="The useful extras that finish the work"
        text="Hooks, rings, locks, charms and other practical materials for makers, classes and resale shelves."
        products={accessoryProducts.length ? accessoryProducts : featuredProducts.slice(-RAIL_SIZE)}
        href="/products?department=Accessories"
      />

      <CommerceBenefits />
      <CommerceOrderFlow />
      <CommerceWholesaleCta />
    </div>
  );
}
