import CommerceHero from "../components/home/CommerceHero.jsx";
import {
  CommerceBenefits,
  CommerceCategoryGrid,
  CommerceCategoryNav,
  CommerceOrderFlow,
  CommerceProductRail,
  CommerceWholesaleCta,
} from "../components/home/CommerceHomeSections.jsx";
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

const yarnAndThreadProducts = featuredProducts
  .filter((product) => ["Yarns", "Threads"].includes(product.masterCategory))
  .slice(0, 8);

const projectAndAccessoryProducts = featuredProducts
  .filter((product) => {
    const searchable = [
      product.category,
      product.masterCategory,
      ...(product.tags || []),
      ...(product.filters || []),
    ].join(" ");
    return /macrame|bag|purse|bead|base|accessor|hook/i.test(searchable);
  })
  .filter((product) => !yarnAndThreadProducts.some((item) => item.slug === product.slug))
  .slice(0, 8);

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart | Yarn, Threads & Craft Materials from Pune",
    description:
      "Browse yarn, crochet thread, macrame cord, embroidery supplies, beads and bag-making materials. Save products and ask Fakhri Mart for live shades and quantity-based pricing.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  return (
    <div className="fm-home commerce-home">
      <CommerceHero />
      <CommerceCategoryNav categories={productCategories} />
      <CommerceCategoryGrid categories={productCategories.slice(0, 8)} />
      <CommerceBenefits />
      <CommerceProductRail
        eyebrow="Popular yarns and threads"
        title="Browse by fibre, feel and project"
        text="Compare product families, listed shades and common uses, then ask for the current pack and availability."
        products={yarnAndThreadProducts.length ? yarnAndThreadProducts : featuredProducts.slice(0, 8)}
        href="/products?department=Yarns"
      />
      <CommerceProductRail
        eyebrow="Macrame, bags and finishing"
        title="Everything around the yarn"
        text="Find cords, handles, bases, beads, hooks and finishing materials without digging through unrelated pages."
        products={projectAndAccessoryProducts.length ? projectAndAccessoryProducts : featuredProducts.slice(8, 16)}
        href="/products?department=Accessories"
      />
      <CommerceOrderFlow />
      <CommerceWholesaleCta />
    </div>
  );
}
