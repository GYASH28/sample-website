import CommerceHero from "../components/home/CommerceHero.jsx";
import MakerHelpStrip from "../components/home/MakerHelpStrip.jsx";
import GuideHelpSection from "../components/home/GuideHelpSection.jsx";
import DeferredSection from "../components/DeferredSection.jsx";
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

// Two full-resolution material cards fit the initial journey without asking a
// phone to decode an entire shelf before the customer starts browsing.
const RAIL_SIZE = 2;
const featuredCatalogueProducts = featuredProducts.slice(0, RAIL_SIZE);
const yarnProducts = featuredProducts.filter((product) => product.masterCategory === "Yarns").slice(0, RAIL_SIZE);
const threadProducts = featuredProducts.filter((product) => product.masterCategory === "Threads").slice(0, RAIL_SIZE);
const macrameProducts = featuredProducts.filter((product) => product.masterCategory === "Macrame & Cords").slice(0, RAIL_SIZE);

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart | Shop Yarn, Threads & Craft Materials",
    description:
      "Browse verified yarn collections, crochet and decorative threads, embroidery threads, macrame cord and Malai Dori. Build a retail or wholesale WhatsApp enquiry for current shades and pricing.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  return (
    <div className="fm-home commerce-home product-first-home">
      <CommerceHero />
      <CommerceCategoryNav categories={productCategories} />
      <MakerHelpStrip />

      <CommerceProductRail
        eyebrow="Catalogue highlights"
        title="A few materials worth starting with"
        text="Explore a verified product line, choose what you need and add it to one enquiry. We confirm current shades, pack details and final pricing before you order."
        products={featuredCatalogueProducts}
        href="/products"
      />

      <GuideHelpSection />

      <DeferredSection label="Project finder" minHeight={640}>
        <CommerceCraftFinder products={featuredProducts} />
        <CommerceCategoryGrid categories={productCategories} />
      </DeferredSection>

      <DeferredSection label="Shade-card support" minHeight={480}>
        <ShadeDiscovery />
        <RecentlyViewedHome />
      </DeferredSection>

      <DeferredSection label="Material collections" minHeight={760}>
        <CommerceProductRail
          eyebrow="Yarn collection"
          title="Yarns for crochet, knitting and handmade projects"
          text="Browse current lines from Ganga, Vardhaman and Taj, then request the latest shade card or stock photo before finalising your choice."
          products={yarnProducts.length ? yarnProducts : featuredCatalogueProducts}
          href="/products?department=Yarns"
        />
        <CommerceProductRail
          eyebrow="Thread collection"
          title="Crochet, embroidery and decorative threads"
          text="Compare thread families by use, then confirm the exact current shade and pack details with the store."
          products={threadProducts.length ? threadProducts : featuredProducts.slice(0, RAIL_SIZE)}
          href="/products?department=Threads"
        />
      </DeferredSection>

      <DeferredSection label="Macrame and dori materials" minHeight={520}>
        <CommerceProductRail
          eyebrow="Macrame & dori"
          title="Cord and dori for knotting, decor and handmade projects"
          text="Explore Macrame Cord and Malai Dori lines, then confirm construction, size, shade and quantity before ordering."
          products={macrameProducts}
          href="/products?department=Macrame%20%26%20Cords"
        />
      </DeferredSection>

      <DeferredSection label="Ordering information" minHeight={620}>
        <CommerceBenefits />
        <CommerceOrderFlow />
        <CommerceWholesaleCta />
      </DeferredSection>
    </div>
  );
}
