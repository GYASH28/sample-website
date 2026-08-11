const CRAFTS = ["Crochet", "Knitting", "Embroidery", "Macrame", "Bag Making", "Beginner Friendly"];

export const PROJECTS = [
  {
    slug: "crochet-bag",
    name: "Crochet bag",
    description: "Find yarns, cords, handles and finishing materials that can be shortlisted for a handmade bag project.",
    icon: "Handbag",
    keywords: ["crochet", "bag", "handle", "base", "t-shirt yarn", "cotton"],
    preferredTags: ["Crochet", "Bag Making"],
    preferredTypes: ["yarn-ball", "cotton-thread", "crochet-thread", "macrame-cord", "purse-handle"],
  },
  {
    slug: "baby-blanket",
    name: "Baby blanket",
    description: "Start with softer yarn families and confirm the current pack composition and care label before ordering.",
    icon: "Baby",
    keywords: ["baby", "blanket", "soft", "knitting", "crochet"],
    preferredTags: ["Knitting", "Crochet", "Soft Yarn"],
    preferredTypes: ["yarn-ball"],
  },
  {
    slug: "amigurumi",
    name: "Amigurumi",
    description: "Browse compact crochet-friendly thread and yarn options, then request the current shade card for your character palette.",
    icon: "Smiley",
    keywords: ["amigurumi", "crochet", "cotton", "thread"],
    preferredTags: ["Crochet", "Beginner Friendly"],
    preferredTypes: ["crochet-thread", "cotton-thread", "yarn-ball"],
  },
  {
    slug: "wearables",
    name: "Wearables",
    description: "Explore yarns tagged for knitting, crochet or wearables and confirm fibre/care information from the current pack label.",
    icon: "TShirt",
    keywords: ["wearable", "sweater", "scarf", "knitting", "crochet"],
    preferredTags: ["Wearables", "Knitting", "Crochet"],
    preferredTypes: ["yarn-ball", "cotton-thread"],
  },
  {
    slug: "macrame-decor",
    name: "Macramé décor",
    description: "Shortlist single or twisted cord for wall hangings, plant holders and décor, then confirm current structure and size.",
    icon: "Plant",
    keywords: ["macrame", "decor", "wall hanging", "plant hanger", "cord"],
    preferredTags: ["Macrame"],
    preferredTypes: ["macrame-cord"],
  },
  {
    slug: "purse-making",
    name: "Purse making",
    description: "Bring together yarn or cord, a base, handles, locks, rings and other finishing accessories in one enquiry.",
    icon: "Bag",
    keywords: ["purse", "bag", "base", "handle", "lock", "ring", "accessory"],
    preferredTags: ["Bag Making"],
    preferredTypes: ["purse-handle", "macrame-cord", "yarn-ball"],
    preferredCategories: ["Purse Handles", "Purse Accessories", "Bases"],
  },
  {
    slug: "embroidery-project",
    name: "Embroidery project",
    description: "Browse embroidery and decorative thread families for detailing, surface work and colourful stitching.",
    icon: "Needle",
    keywords: ["embroidery", "lacchi", "decorative", "thread", "stitch"],
    preferredTags: ["Embroidery"],
    preferredTypes: ["embroidery-floss"],
    preferredCategories: ["Embroidery Threads", "Decorative Threads"],
  },
  {
    slug: "home-basket",
    name: "Basket & home organiser",
    description: "Explore sturdier yarn/cord families for baskets and organisers, then confirm the size and quantity for your project.",
    icon: "Basket",
    keywords: ["basket", "home", "organiser", "t-shirt yarn", "macrame"],
    preferredTags: ["Bag Making", "Macrame"],
    preferredTypes: ["macrame-cord", "yarn-ball"],
  },
];

export const GLOSSARY = [
  {
    term: "Ply",
    aliases: ["4 ply", "ply"],
    definition: "A ply count describes strands twisted together in a yarn/thread construction. It is not a universal thickness guarantee, so confirm the current pack label for exact specifications.",
  },
  {
    term: "Macramé cord",
    aliases: ["macrame", "macramé cord", "macrame cord"],
    definition: "Cord used for knot-based craft. Single-strand and twisted constructions behave differently for structure, knots and fringe, so choose by project finish.",
  },
  {
    term: "Lacchi",
    aliases: ["lacchi"],
    definition: "A bundled thread format commonly used for embroidery and decorative stitching. Shade, strand count and pack details should be confirmed from the current product.",
  },
  {
    term: "T-shirt yarn",
    aliases: ["t-shirt yarn", "t shirt yarn"],
    definition: "A broad, fabric-style yarn commonly used for bags, baskets, mats and structured crochet. Current width/composition can vary by product batch, so ask for the current pack details.",
  },
  {
    term: "Hook size",
    aliases: ["hook size", "crochet hook"],
    definition: "The hook diameter affects stitch size, drape and density. Use the current product label and your desired fabric/gauge rather than relying on a generic recommendation.",
  },
  {
    term: "Bulk enquiry",
    aliases: ["wholesale", "bulk", "bulk order"],
    definition: "A quantity-based enquiry where Fakhri Mart confirms current pack format, available shades, order quantity, delivery and pricing directly.",
  },
  {
    term: "Representative shade",
    aliases: ["representative shade", "shade"],
    definition: "A screen colour used for navigation only. Displays and real batches can differ, so request a current shade/photo confirmation before finalising an order.",
  },
];

export const SEO_COLLECTIONS = [
  {
    slug: "crochet-yarn",
    eyebrow: "Crochet materials",
    title: "Crochet yarn & thread in Pune",
    description: "Explore crochet-friendly yarns and threads from Fakhri Mart, then request current shades, pack details and quantity pricing on WhatsApp.",
    intro: "Use this collection to shortlist crochet materials by product family, shade range and intended project. Exact composition, pack details and availability are confirmed before ordering.",
    query: "crochet",
    tags: ["Crochet"],
    guidance: ["Compare listed shade ranges", "Check the current pack label for composition", "Add multiple options to one enquiry"],
  },
  {
    slug: "macrame-cord",
    eyebrow: "Macramé materials",
    title: "Macramé cord in Pune",
    description: "Browse single and twisted macramé cord options for décor, bags and knotting projects with India-wide enquiry support.",
    intro: "Cord construction changes the look of knots and fringe. Shortlist the product family here, then ask Fakhri Mart to confirm the current structure, size and shade.",
    query: "macrame",
    tags: ["Macrame"],
    guidance: ["Choose single vs twisted construction", "Confirm current diameter/pack", "Request a current shade photo"],
  },
  {
    slug: "embroidery-thread",
    eyebrow: "Embroidery materials",
    title: "Embroidery thread & lacchi in Pune",
    description: "Explore embroidery thread and decorative thread families for stitching, craft detailing and colourful surface work.",
    intro: "Browse thread families first, then confirm the exact current shades and bundle/pack information required for your project.",
    query: "embroidery",
    tags: ["Embroidery"],
    guidance: ["Shortlist by thread family", "Request current shade options", "Combine multiple shades in one enquiry"],
  },
  {
    slug: "yarn-for-bags",
    eyebrow: "Bag-making materials",
    title: "Yarn, cord & accessories for handmade bags",
    description: "Find yarn, cord, handles, bases and finishing accessories for crochet and handmade bag projects.",
    intro: "A bag usually needs more than one material. Use the project view to shortlist the main yarn/cord plus handles, bases and finishing accessories, then send one organised enquiry.",
    project: "purse-making",
    guidance: ["Choose your main yarn or cord", "Add compatible handles/bases", "Send the complete material list together"],
  },
  {
    slug: "cotton-yarn",
    eyebrow: "Cotton-labelled catalogue",
    title: "Cotton yarn & cotton thread options",
    description: "Browse Fakhri Mart products whose current catalogue text explicitly identifies cotton yarn or thread.",
    intro: "This page only includes products whose existing name/description identifies cotton. Always confirm the current composition from the supplied pack label before ordering.",
    material: "Cotton",
    guidance: ["Compare intended craft use", "Check current pack composition", "Request shades before placing a bulk enquiry"],
  },
  {
    slug: "wholesale-yarn-pune",
    eyebrow: "Retail & wholesale enquiries",
    title: "Wholesale yarn & craft material enquiries in Pune",
    description: "Build a multi-product wholesale yarn and craft material enquiry with Fakhri Mart in Pune for current quantity pricing and India-wide delivery.",
    intro: "Wholesale pricing depends on the exact product, shade, pack and quantity. Build your material list here and send it once so the team can quote the current combination accurately.",
    bulkOnly: true,
    guidance: ["Add products and exact quantities", "Include shade/pack notes", "Share delivery city or postcode"],
  },
  {
    slug: "yarn-craft-supplies-pune",
    eyebrow: "Pune catalogue",
    title: "Yarn & craft supplies in Pune",
    description: "Discover yarns, crochet threads, macramé cord, embroidery supplies, beads and bag-making materials from Fakhri Mart in Pune.",
    intro: "Browse the catalogue by craft or project instead of guessing product names. Fakhri Mart confirms current shades, quantity pricing and delivery before the order is finalised.",
    query: "",
    guidance: ["Search by craft or project", "Save or compare materials", "Send one WhatsApp enquiry for current details"],
  },
];

const COLOR_NAME_RULES = [
  ["Red", /red|wine|maroon|coral|scarlet|cherry/i],
  ["Pink", /pink|rose|blush|peach/i],
  ["Orange", /orange|rust|terracotta/i],
  ["Yellow", /yellow|gold|mustard|butter|sunflower/i],
  ["Green", /green|mint|teal|seafoam|olive|sage/i],
  ["Blue", /blue|navy|sky|ocean|aqua/i],
  ["Purple", /purple|lavender|violet|lilac/i],
  ["Brown", /brown|tan|beige|camel|coffee/i],
  ["Neutral", /white|ivory|cream|grey|gray|charcoal|black|natural/i],
];

function normalizeText(value = "") {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function colorFamilyForShade(shade) {
  const name = shade?.name || "";
  const rule = COLOR_NAME_RULES.find(([, matcher]) => matcher.test(name));
  return rule?.[0] || "Other";
}

export function getProductDiscoveryMeta(product) {
  const haystack = normalizeText([
    product.name,
    product.description,
    product.variants,
    product.category,
    product.type,
    product.brand,
    product.suitableFor,
    ...(product.tags || []),
    ...(product.filters || []),
  ].filter(Boolean).join(" "));

  const crafts = CRAFTS.filter((craft) => {
    const normalizedCraft = normalizeText(craft);
    return (product.tags || []).some((tag) => normalizeText(tag) === normalizedCraft) || haystack.includes(normalizedCraft);
  });

  let material = null;
  if (/\bcotton\b/.test(haystack)) material = "Cotton";
  else if (/\bmacrame\b/.test(haystack)) material = "Macramé cord";
  else if (/\bembroidery\b/.test(haystack)) material = "Embroidery thread";
  else if (/t shirt yarn/.test(haystack)) material = "T-shirt yarn";

  const thicknessMatches = [
    ...(String(product.name).match(/\b\d+\s*ply\b/gi) || []),
    ...(String(product.variants || "").match(/\b\d+(?:\.\d+)?\s*mm\b/gi) || []),
    ...(String(product.variants || "").match(/\b\d+\s*ply\b/gi) || []),
  ];
  const thicknesses = [...new Set(thicknessMatches.map((value) => value.replace(/\s+/g, " ").toUpperCase()))];
  const colorFamilies = [...new Set((product.colors || []).map(colorFamilyForShade))];
  const shadeCount = product.colors?.length || 0;
  const bulkSuitable = (product.tags || []).includes("Bulk Orders");
  const retailSuitable = (product.tags || []).includes("Retail");

  return {
    crafts,
    material,
    thicknesses,
    colorFamilies,
    shadeCount,
    bulkSuitable,
    retailSuitable,
    soldAs: product.quantityOptions?.soldAs || null,
    searchableText: normalizeText([
      haystack,
      crafts.join(" "),
      material,
      thicknesses.join(" "),
      colorFamilies.join(" "),
      ...(product.colors || []).map((shade) => shade.name),
    ].filter(Boolean).join(" ")),
  };
}

const INTENT_EXPANSIONS = [
  { matcher: /baby|blanket|newborn/, terms: ["baby", "soft", "knitting", "crochet"] },
  { matcher: /bag|purse|handbag|tote/, terms: ["bag making", "crochet", "macrame", "handle", "base", "t shirt yarn"] },
  { matcher: /amigurumi|toy|doll/, terms: ["amigurumi", "crochet", "cotton", "thread"] },
  { matcher: /wall|plant|decor|hanger/, terms: ["macrame", "decor", "cord"] },
  { matcher: /sweater|scarf|wearable|garment/, terms: ["knitting", "crochet", "wearables", "soft"] },
  { matcher: /embroidery|stitch|lacchi/, terms: ["embroidery", "lacchi", "thread"] },
  { matcher: /beginner|first project|easy/, terms: ["beginner friendly", "crochet"] },
  { matcher: /wholesale|bulk|resell|shop/, terms: ["bulk orders", "reseller", "retail"] },
];

function editDistance(a, b) {
  if (!a) return b.length;
  if (!b) return a.length;
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const old = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = old;
    }
  }
  return previous[b.length];
}

function tokenMatches(token, candidate) {
  if (!token || !candidate) return false;
  if (candidate.includes(token) || token.includes(candidate)) return true;
  if (token.length < 4 || candidate.length < 4) return false;
  return editDistance(token, candidate) <= 1;
}

export function scoreProductForQuery(product, query) {
  const normalized = normalizeText(query);
  if (!normalized) return 1;
  const meta = getProductDiscoveryMeta(product);
  const productWords = new Set(meta.searchableText.split(" ").filter(Boolean));
  const queryTokens = normalized.split(" ").filter(Boolean);
  const expandedTerms = INTENT_EXPANSIONS
    .filter(({ matcher }) => matcher.test(normalized))
    .flatMap(({ terms }) => terms.flatMap((term) => normalizeText(term).split(" ")));
  const tokens = [...new Set([...queryTokens, ...expandedTerms])];

  let score = 0;
  const name = normalizeText(product.name);
  const category = normalizeText(product.category);
  for (const token of tokens) {
    if (name.includes(token)) score += 8;
    if (category.includes(token)) score += 5;
    if ([...productWords].some((word) => tokenMatches(token, word))) score += 2;
  }
  if (meta.searchableText.includes(normalized)) score += 10;
  return score;
}

export function searchProducts(products, query) {
  const normalized = normalizeText(query);
  if (!normalized) return products.map((product, index) => ({ product, score: products.length - index }));
  return products
    .map((product) => ({ product, score: scoreProductForQuery(product, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}

export function productsForProject(products, projectSlug) {
  const project = PROJECTS.find((item) => item.slug === projectSlug);
  if (!project) return [];
  return products
    .map((product) => {
      const meta = getProductDiscoveryMeta(product);
      let score = 0;
      score += (project.preferredTags || []).filter((tag) => (product.tags || []).includes(tag)).length * 6;
      score += (project.preferredTypes || []).includes(product.type) ? 5 : 0;
      score += (project.preferredCategories || []).includes(product.category) ? 7 : 0;
      score += project.keywords.filter((keyword) => meta.searchableText.includes(normalizeText(keyword))).length * 2;
      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
}

export function productMatchesCollection(product, collection) {
  const meta = getProductDiscoveryMeta(product);
  if (collection.project) {
    return productsForProject([product], collection.project).length > 0;
  }
  if (collection.tags?.length && !collection.tags.some((tag) => (product.tags || []).includes(tag))) return false;
  if (collection.material && meta.material !== collection.material) return false;
  if (collection.bulkOnly && !meta.bulkSuitable) return false;
  if (collection.query && scoreProductForQuery(product, collection.query) <= 0) return false;
  return true;
}

export function getCollectionBySlug(slug) {
  return SEO_COLLECTIONS.find((collection) => collection.slug === slug) || null;
}

export function findGlossaryTerm(term) {
  const normalized = normalizeText(term);
  return GLOSSARY.find((entry) => entry.aliases.some((alias) => normalizeText(alias) === normalized)) || null;
}

export function getCompareFacts(product) {
  const meta = getProductDiscoveryMeta(product);
  return {
    category: product.category,
    brand: product.brand || "Catalogue family",
    material: meta.material || "Confirm current composition",
    thickness: meta.thicknesses.length ? meta.thicknesses.join(", ") : "Confirm current pack",
    crafts: meta.crafts.length ? meta.crafts.join(", ") : product.suitableFor,
    shades: meta.shadeCount ? `${meta.shadeCount} representative shades listed` : "Ask for current shades",
    soldAs: meta.soldAs || "Confirm current pack",
    retail: meta.retailSuitable ? "Listed for retail enquiries" : "Ask for retail quantity",
    bulk: meta.bulkSuitable ? "Bulk enquiries supported" : "Ask for quantity options",
    variants: product.variants || "Confirm current options",
  };
}

export const CUSTOMER_CREATIONS = [];

export const DISCOVERY_FILTER_OPTIONS = {
  crafts: CRAFTS,
  materials: ["Cotton", "Macramé cord", "Embroidery thread", "T-shirt yarn"],
  colors: ["Red", "Pink", "Orange", "Yellow", "Green", "Blue", "Purple", "Brown", "Neutral", "Other"],
};
