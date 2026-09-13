import {
  businessInfo,
  featuredProducts,
  MASTER_CATEGORIES,
  productCategories,
  productInterestOptions,
} from "../data/siteData.js";
import {
  DISCOVERY_FILTER_OPTIONS,
  PROJECTS,
  SEO_COLLECTIONS,
} from "../data/discoveryData.js";
import { verifiedBusiness } from "../data/verifiedBusiness.js";

const CATEGORY_DEFINITIONS = [
  {
    name: "Yarn Collections",
    shortName: "Yarns",
    icon: "Waves",
    tone: "mint",
    image: "/assets/images/cat_ganga.webp",
    description: "Verified Ganga, Vardhaman and Taj yarn lines for crochet, knitting, blankets, wearables and handmade projects.",
  },
  {
    name: "Crochet & Decorative Threads",
    shortName: "Craft Threads",
    icon: "Sparkles",
    tone: "teal",
    image: "/assets/reference/product-photos/glace-cotton-thread.jpeg",
    description: "Glace cotton thread and decorative Kasab lines for crochet, handwork, detailing and embellishment.",
  },
  {
    name: "Embroidery Threads",
    shortName: "Embroidery",
    icon: "Palette",
    tone: "violet",
    image: "/assets/images/products/verified-web/anchor-embroidery-thread.webp",
    description: "Anchor, Ambika and Dolly embroidery thread lines. Ask for the current shade card before finalising colours.",
  },
  {
    name: "Macrame & Dori",
    shortName: "Macrame & Dori",
    icon: "Cable",
    tone: "gold",
    image: "/assets/images/cat_macrame.webp",
    description: "Macrame cord and Malai Dori in the supplier-confirmed sizes for knotting, decor, bags and handmade projects.",
  },
];

function normaliseProduct(product) {
  const supplierCategory = product.category;

  // Preserve the source grouping for debugging/search history, but expose a
  // customer-facing material taxonomy instead of mixing brands and material
  // types at the same navigation level.
  product.supplierCategory = supplierCategory;

  if (product.masterCategory === "Yarns") {
    product.category = "Yarn Collections";
    product.masterCategory = "Yarns";
    product.type = "yarn-ball";
    product.filters = ["Yarns"];
    product.suitableFor = product.suitableFor || "Crochet, knitting and handmade yarn projects";
  } else if (supplierCategory === "Embroidery Threads") {
    product.category = "Embroidery Threads";
    product.masterCategory = "Threads";
    product.type = "embroidery-floss";
    product.filters = ["Embroidery"];
    product.suitableFor = "Embroidery, needlework, decorative stitching and detailed handwork";
  } else if (supplierCategory === "Macrame Cord") {
    product.category = "Macrame & Dori";
    product.masterCategory = "Macrame & Cords";
    product.type = "macrame-cord";
    product.filters = ["Macrame"];
    product.suitableFor = "Macrame, knotting, decor, handmade bags and craft projects";
  } else {
    product.category = "Crochet & Decorative Threads";
    product.masterCategory = "Threads";
    product.type = product.name.toLocaleLowerCase().includes("cotton") ? "cotton-thread" : "crochet-thread";
    product.filters = ["Crochet Threads"];
    product.suitableFor = "Crochet, decorative handwork, embellishment and craft projects";
  }

  // These universal swatches were placeholders, not product-specific live
  // shades. Removing them prevents product cards, search filters and enquiries
  // from implying that a colour is currently available. Current shades are
  // confirmed from the supplier card / live stock photo instead.
  product.colors = [];
  product.palette = ["#ede4d8", "#d8c7b6", "#f4eee6"];

  if (product.quantityOptions) {
    product.quantityOptions = {
      ...product.quantityOptions,
      soldAs: null,
    };
  }

  product.tags = [...new Set([...(product.tags || []), product.brand, "Shade Card", "Retail", "Bulk Orders"].filter(Boolean))];

  delete product.rating;
  delete product.reviewCount;
  delete product.stock;
}

function rewriteProject(slug, changes) {
  const project = PROJECTS.find((item) => item.slug === slug);
  if (project) Object.assign(project, changes);
}

function rewriteCollection(slug, changes) {
  const collection = SEO_COLLECTIONS.find((item) => item.slug === slug);
  if (collection) Object.assign(collection, changes);
}

export function applyCatalogueIntegrity() {
  Object.assign(businessInfo, verifiedBusiness);

  featuredProducts.forEach(normaliseProduct);

  MASTER_CATEGORIES.splice(0, MASTER_CATEGORIES.length, "Yarns", "Threads", "Macrame & Cords");

  productCategories.splice(
    0,
    productCategories.length,
    ...CATEGORY_DEFINITIONS.map((definition) => {
      const products = featuredProducts.filter((product) => product.category === definition.name);
      return {
        ...definition,
        count: `${products.length} verified ${products.length === 1 ? "line" : "lines"}`,
        products: products.map((product) => product.name).slice(0, 8),
      };
    }),
  );

  productInterestOptions.splice(
    0,
    productInterestOptions.length,
    "Yarn Collections",
    "Crochet / Decorative Thread",
    "Embroidery Thread",
    "Macrame Cord / Malai Dori",
    "Wholesale / Repeat Supply",
    "Other",
  );

  // There are no trustworthy product-specific colour values in the runtime
  // dataset yet, so do not expose colour-family filters that would return false
  // precision. Shade discovery remains available through enquiry/shade cards.
  DISCOVERY_FILTER_OPTIONS.colors.splice(0, DISCOVERY_FILTER_OPTIONS.colors.length);

  rewriteProject("crochet-bag", {
    description: "Shortlist yarn and cord families for a handmade crochet bag, then confirm the current structure, shade and quantity before ordering.",
    keywords: ["crochet", "bag", "t-shirt yarn", "yarn", "macrame", "cord"],
    preferredTypes: ["yarn-ball", "cotton-thread", "crochet-thread", "macrame-cord"],
  });
  rewriteProject("purse-making", {
    name: "Bag & purse making",
    description: "Start with the currently verified yarn and cord lines for handmade bags and purses, then confirm current shades and quantities with the store.",
    keywords: ["purse", "bag", "crochet", "macrame", "cord", "yarn"],
    preferredTypes: ["yarn-ball", "macrame-cord", "cotton-thread"],
    preferredCategories: ["Yarn Collections", "Macrame & Dori"],
  });
  rewriteProject("embroidery-project", {
    preferredCategories: ["Embroidery Threads", "Crochet & Decorative Threads"],
  });

  rewriteCollection("macrame-cord", {
    description: "Browse Fakhri Mart's verified macrame cord and Malai Dori lines for decor, bags and knotting projects with India-wide enquiry support.",
    intro: "Shortlist the cord or dori line here, then ask Fakhri Mart to confirm the current construction, listed size, shade and availability before ordering.",
    guidance: ["Choose the cord or dori line", "Confirm the current size/pack", "Request a current shade card or stock photo"],
  });
  rewriteCollection("yarn-for-bags", {
    title: "Yarn & cord for handmade bags",
    description: "Find verified yarn and cord lines that can be shortlisted for crochet and handmade bag projects.",
    intro: "Start with the main yarn or cord for your bag project, then send the shortlisted material and quantity in one organised enquiry for current shades and pricing.",
    guidance: ["Choose your main yarn or cord", "Confirm the current shade and quantity", "Send the material list in one enquiry"],
  });
  rewriteCollection("yarn-craft-supplies-pune", {
    description: "Discover verified yarns, crochet and decorative threads, embroidery threads, macrame cord and Malai Dori from Fakhri Mart in Pune.",
    intro: "Browse the verified catalogue by material, craft or project instead of guessing product names. Fakhri Mart confirms current shades, quantity pricing and delivery before the order is finalised.",
  });
}
