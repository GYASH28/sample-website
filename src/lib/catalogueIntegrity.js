import {
  aboutPoints,
  blogPosts,
  bulkOrderCards,
  businessInfo,
  featuredProducts,
  galleryItems,
  MASTER_CATEGORIES,
  newArrivals,
  productCategories,
  productInterestOptions,
  whyChooseUs,
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
    description: "Macrame cord and Malai Dori for knotting, decor, bags and handmade projects. Confirm the current construction and listed size before ordering.",
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
    if (supplierCategory === "Decorative Threads") {
      product.type = "decorative-thread";
      product.filters = ["Decorative Threads"];
    } else {
      product.type = product.name.toLocaleLowerCase().includes("cotton") ? "cotton-thread" : "crochet-thread";
      product.filters = ["Crochet Threads"];
    }
    product.suitableFor = "Crochet, decorative handwork, embellishment and craft projects";
  }

  // These universal swatches were placeholders, not product-specific live
  // shades. Removing them prevents product cards, search filters and enquiries
  // from implying that a colour is currently available. The separate digital
  // shade preview is browser-only and never writes into product.colors.
  product.colors = [];
  product.palette = ["#ede4d8", "#d8c7b6", "#f4eee6"];

  // Quantity is a request field, not a statement about supplier pack format.
  // Use neutral units until the current supplier material confirms how the
  // exact line is sold/packed.
  product.quantityOptions = {
    unit: "units",
    min: 1,
    max: 500,
    step: 1,
    presets: [1, 12, 50, 100],
    soldAs: null,
  };

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

function rewriteBlogPost(slug, changes) {
  const post = blogPosts.find((item) => item.slug === slug);
  if (post) Object.assign(post, changes);
}

function rewriteCraftGuides() {
  rewriteBlogPost("how-to-choose-yarn-weight", {
    excerpt: "A practical guide to reading yarn labels, matching pattern gauge and comparing thickness without treating ply count as a universal weight standard.",
    body: `Yarn thickness matters, but there is no single shortcut that works for every yarn. Ply count alone does not universally determine yarn weight or thickness, and fibre, twist and construction can make two yarns with similar labels behave very differently. Start with the pattern's recommended yarn weight or gauge, then compare the current product label.

When substituting yarn, use the most useful specifications actually available on the pack: stated weight category, length for a given weight, recommended gauge and tool size. Make a gauge swatch when fit or finished dimensions matter, and judge the resulting drape, softness and structure for the project you are making.

A soft yarn may suit a blanket or wearable while a firmer construction may be useful for a bag, but those properties should be checked on the actual yarn rather than inferred from ply count alone. For Fakhri Mart catalogue lines, ask for the current pack label or supplier information whenever a specification is not published on the website.`,
  });

  rewriteBlogPost("macrame-basics-for-beginners", {
    excerpt: "Learn a small set of useful macrame knots, how cord construction affects the result and what to confirm before choosing material for a first project.",
    body: `Macrame becomes much easier once you practise a few repeatable knots. Beginner projects commonly use techniques such as the lark's head for mounting cords, square knots for stable patterns, half knots or half hitches for spirals and lines, double half hitches for shaped rows, and gathering knots for finishing groups of cords.

Those knots are a useful starting set, not a claim that every macrame pattern uses only five techniques. Practise each knot with scrap cord first so you can see how spacing and tension change the final texture.

Material choice matters too. Single, twisted and braided cords can fringe, hold structure and show knots differently, while diameter changes the scale of the finished piece. Before ordering, compare the project requirement with the current cord construction, listed size and shade information from the supplier.`,
  });

  rewriteBlogPost("crochet-vs-knitting-which-to-learn-first", {
    excerpt: "A beginner-friendly comparison of crochet and knitting that focuses on tools, fabric behaviour and the kind of project you actually want to make.",
    body: `Crochet and knitting are both approachable, but they build fabric differently. Crochet generally uses one hook and works one active loop at a time, while knitting usually uses two needles and keeps many live stitches on the needle. That difference affects the look, stretch, density and repair process of the finished fabric.

Neither craft is universally faster, easier or more forgiving. Crochet can feel straightforward for small shaped pieces and textured motifs; knitting can feel natural for people who enjoy rows of interlocking stitches and elastic fabric. The better first choice is usually the one that matches the project you are excited to finish.

Pick a small first project, use a yarn and tool combination recommended by that pattern, and practise the basic stitch before buying a large quantity. If you are choosing from the Fakhri Mart catalogue, shortlist the material family first and ask for the current pack details when gauge, fibre composition or tool-size guidance is not published.`,
  });
}

function rewriteDormantCatalogueData() {
  // These exports are not the primary storefront today, but keeping them honest
  // prevents a future/reused component from resurrecting the old sample range.
  newArrivals.splice(0, newArrivals.length);

  galleryItems.splice(
    0,
    galleryItems.length,
    {
      title: "Yarn Collections",
      label: "Verified Ganga, Vardhaman and Taj yarn lines for crochet, knitting and handmade projects.",
      type: "balls",
      colors: ["#d8c7b6", "#b7dfd8", "#d6bad8", "#e5d2b5"],
    },
    {
      title: "Crochet & Decorative Threads",
      label: "Glacé cotton thread and Kasab for crochet, detailing and embellishment.",
      type: "spools",
      colors: ["#d8c7b6", "#e3a8b7", "#91c8b4", "#c99a2e"],
    },
    {
      title: "Embroidery Threads",
      label: "Anchor, Ambika and Dolly embroidery lines; confirm exact colours from the current shade card.",
      type: "shade",
      colors: ["#b4a0d3", "#c96f90", "#78b5d6", "#e7c95e"],
    },
    {
      title: "Macrame & Dori",
      label: "Macrame cord and Malai Dori for knotting, décor, handmade bags and craft projects.",
      type: "cords",
      colors: ["#d8c4a8", "#b77b4d", "#91c8b4", "#45484d"],
    },
  );

  bulkOrderCards.splice(
    0,
    bulkOrderCards.length,
    { title: "Wholesale Enquiries", icon: "BadgeIndianRupee", text: "Share the product, requested quantity, shade reference and delivery location for current quantity-based pricing." },
    { title: "Shade-Card Confirmation", icon: "Swatches", text: "Use the website colour preview for ideas, then confirm the nearest available supplier shade before ordering." },
    { title: "Repeat Supply", icon: "Store", text: "Boutiques, resellers and makers can enquire about current availability for repeat or larger requirements." },
    { title: "All India Delivery", icon: "Truck", text: "Delivery is supported across India for the verified yarn, thread, embroidery and cord catalogue; timing and charges are confirmed per enquiry." },
  );

  whyChooseUs.splice(
    0,
    whyChooseUs.length,
    { title: "Verified Catalogue", icon: "CheckCircle", text: "The public range is based on the supplier handover instead of sample products or invented stock." },
    { title: "Colour Preview + Shade Cards", icon: "SwatchBook", text: "Preview colours instantly on one product photo, then confirm the real supplier shade from a current card or live photo." },
    { title: "Retail & Wholesale Enquiries", icon: "Handshake", text: "Individual makers, boutiques, resellers and bulk buyers can send organised requirements through the same enquiry flow." },
    { title: "All India Delivery", icon: "Truck", text: "Delivery support is available across India, with timing and charges confirmed for the actual order." },
    { title: "Direct WhatsApp Confirmation", icon: "MessageCircle", text: "Current availability, pack details, shade photos and quantity pricing are confirmed directly before the order is finalised." },
  );

  aboutPoints.splice(
    0,
    aboutPoints.length,
    "Verified yarn, thread, embroidery and cord catalogue",
    "Retail, repeat and bulk enquiries supported",
    "Digital colour preview with supplier shade-card confirmation",
    "Delivery support across India",
    "Direct WhatsApp confirmation for current commercial details",
  );
}

function sanitizeLegacyCatalogueQuery() {
  if (typeof window === "undefined" || window.location.pathname !== "/products") return;

  const params = new URLSearchParams(window.location.search);
  let changed = false;

  // Product-specific colour data is not published yet. Old saved/share links
  // must not reactivate the retired placeholder colour/shade filters.
  for (const key of ["color", "shades"]) {
    if (params.has(key)) {
      params.delete(key);
      changed = true;
    }
  }

  // Legacy sample-only product types no longer exist in the verified range.
  if (["hook", "purse-handle"].includes(params.get("type"))) {
    params.delete("type");
    changed = true;
  }

  // Sorting by a placeholder shade count no longer has meaningful semantics.
  if (["most-shades", "newest"].includes(params.get("sort"))) {
    params.delete("sort");
    changed = true;
  }

  if (!changed) return;
  const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}${window.location.hash}`;
  window.history.replaceState(window.history.state, "", next);
}

export function applyCatalogueIntegrity() {
  Object.assign(businessInfo, verifiedBusiness);

  featuredProducts.forEach(normaliseProduct);
  rewriteCraftGuides();
  rewriteDormantCatalogueData();

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

  sanitizeLegacyCatalogueQuery();
}
