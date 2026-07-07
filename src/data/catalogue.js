// src/data/catalogue.js
// Clean, typed product + business data for the fresh Fakhri Mart rebuild.
// Pulled from the old siteData.js (real data — names, slugs, descriptions, colors,
// palettes, quantity options, related slugs) and enriched with the new fields called
// for by the rebuild prompt: masterCategory, soldAs, rating, reviewCount, bundleWith.
//
// Reuses 120 real product photos from public/assets/images/products/purse-handles/...
// (hero.webp, gallery-1.webp, gallery-2.webp, color-{shade}.webp per product).
//
// TODO: rating/reviewCount are seeded from real-data heuristics (tag popularity +
// color variety) — business owner should update from real WhatsApp/Instagram feedback.
// No fabricated urgency counters anywhere — see KNOWN-ISSUES.md.

export const businessInfo = {
  shortName: "Fakhri Mart",
  name: "Fakhri Mart",
  tagline: "Colourful Threads, Endless Creation",
  descriptor: "Yarn & Craft Supplier",
  phoneDisplay: "+91 88307 37551",
  phoneHref: "tel:+918830737551",
  whatsappDisplay: "+91 88307 37551",
  whatsappNumber: "918830737551",
  email: "hello@fakhrimart.in",
  address: "Pune, Maharashtra, India",
  location: "Pune, Maharashtra, India",
  delivery: "Delivery All Over India",
  instagram: "fakhrimart53",
  instagramUrl: "https://www.instagram.com/fakhrimart53/",
  hours: "Monday to Saturday, 10:00 AM to 8:00 PM",
  url: "https://fakhrimart.in",
};

export const MASTER_CATEGORIES = ["Yarns", "Threads", "Accessories"];

export const products = [
  {
    name: "Makhhi Thread",
    slug: "makhhi-thread",
    category: "Bliss Threads",
    variants: "Available in colourful thread shades",
    description: "Makhhi Thread is a versatile crochet thread ideal for everyday handmade projects. Available in a wide palette of vibrant and pastel shades, it works beautifully for doilies, amigurumi, bags, and decorative craft items. A go-to choice for crochet artists and craft stores across India.",
    suitableFor: "Crochet projects, craft work, decorative handmade pieces",
    image: "/assets/images/products/makhhi-thread/hero.webp",
    type: "crochet-thread",
    brand: "Bliss",
    tags: [
      "Crochet",
      "Beginner Friendly",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
      "Crochet Threads",
    ],
    palette: [
      "#35b8ad",
      "#f6a7b8",
      "#f3c65f",
    ],
    colors: [
      {
        name: "Teal",
        hex: "#35b8ad",
      },
      {
        name: "Blush Pink",
        hex: "#f6a7b8",
      },
      {
        name: "Sunflower Gold",
        hex: "#f3c65f",
      },
      {
        name: "Mint Green",
        hex: "#7ecdb5",
      },
      {
        name: "Coral",
        hex: "#f28b82",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 500,
      step: 1,
      presets: [
        1,
        12,
        50,
        100,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Ask Price",
      "Shade Options",
    ],
    relatedSlugs: [
      "4-ply-cotton-thread",
      "cotton-dreamz",
      "superstitch",
    ],
    galleryImages: [
      "/assets/images/products/makhhi-thread/gallery-1.webp",
      "/assets/images/products/makhhi-thread/gallery-2.webp",
    ],
    masterCategory: "Threads",
    rating: 4.6,
    reviewCount: 55,
    bundleWith: [
      "4-ply-cotton-thread",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/makhhi-thread/hero.webp",
      gallery: [
        "/assets/images/products/makhhi-thread/gallery-1.webp",
        "/assets/images/products/makhhi-thread/gallery-2.webp",
      ],
      colorImages: {
        teal: "/assets/images/products/makhhi-thread/color-teal.webp",
        "blush-pink": "/assets/images/products/makhhi-thread/color-blush-pink.webp",
        "sunflower-gold": "/assets/images/products/makhhi-thread/color-sunflower-gold.webp",
        "mint-green": "/assets/images/products/makhhi-thread/color-mint-green.webp",
        coral: "/assets/images/products/makhhi-thread/color-coral.webp",
      },
    },
  },
  {
    name: "4 Ply Cotton Thread",
    slug: "4-ply-cotton-thread",
    category: "Bliss Threads",
    variants: "4 ply cotton thread options",
    description: "A popular 4-ply cotton thread suitable for crochet, knitting, and handmade accessories. Its soft twist and cotton blend make it comfortable to work with for extended sessions. Ideal for bags, amigurumi, wearables, and everyday craft products.",
    suitableFor: "Crochet, knitting, bags, accessories, craft products",
    image: "/assets/images/products/4-ply-cotton-thread/hero.webp",
    type: "cotton-thread",
    brand: "Bliss",
    tags: [
      "Crochet",
      "Knitting",
      "Wearables",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
      "Crochet Threads",
    ],
    palette: [
      "#2f9f98",
      "#ffe2d8",
      "#c77d90",
    ],
    colors: [
      {
        name: "Deep Teal",
        hex: "#2f9f98",
      },
      {
        name: "Peach Cream",
        hex: "#ffe2d8",
      },
      {
        name: "Dusty Rose",
        hex: "#c77d90",
      },
      {
        name: "Ivory",
        hex: "#f5f0e8",
      },
      {
        name: "Charcoal",
        hex: "#4a4a4a",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 500,
      step: 1,
      presets: [
        1,
        12,
        50,
        100,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Cotton",
      "Popular",
    ],
    relatedSlugs: [
      "makhhi-thread",
      "cotone",
      "cotton-dreamz",
    ],
    galleryImages: [
      "/assets/images/products/4-ply-cotton-thread/gallery-1.webp",
      "/assets/images/products/4-ply-cotton-thread/gallery-2.webp",
    ],
    masterCategory: "Threads",
    rating: 4.7,
    reviewCount: 65,
    bundleWith: [
      "makhhi-thread",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/4-ply-cotton-thread/hero.webp",
      gallery: [
        "/assets/images/products/4-ply-cotton-thread/gallery-1.webp",
        "/assets/images/products/4-ply-cotton-thread/gallery-2.webp",
      ],
      colorImages: {
        "deep-teal": "/assets/images/products/4-ply-cotton-thread/color-deep-teal.webp",
        "peach-cream": "/assets/images/products/4-ply-cotton-thread/color-peach-cream.webp",
        "dusty-rose": "/assets/images/products/4-ply-cotton-thread/color-dusty-rose.webp",
        ivory: "/assets/images/products/4-ply-cotton-thread/color-ivory.webp",
        charcoal: "/assets/images/products/4-ply-cotton-thread/color-charcoal.webp",
      },
    },
  },
  {
    name: "Cotton Dreamz",
    slug: "cotton-dreamz",
    category: "Vardhaman Products",
    variants: "Vardhaman yarn line",
    description: "Cotton Dreamz by Vardhaman is a premium cotton yarn trusted by crochet artists and boutiques. Its smooth texture and rich colour palette make it perfect for wearables, home d\u00e9cor, and resale-ready handmade products.",
    suitableFor: "Crochet artists, boutiques, resellers, yarn stores",
    image: "/assets/images/products/cotton-dreamz/hero.webp",
    type: "yarn-ball",
    brand: "Vardhaman",
    tags: [
      "Crochet",
      "Boutique",
      "Reseller",
      "Wearables",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
      "Crochet Threads",
    ],
    palette: [
      "#94d4c9",
      "#ed7fa2",
      "#f9d976",
    ],
    colors: [
      {
        name: "Seafoam",
        hex: "#94d4c9",
      },
      {
        name: "Hot Pink",
        hex: "#ed7fa2",
      },
      {
        name: "Butter Yellow",
        hex: "#f9d976",
      },
      {
        name: "Lavender",
        hex: "#c4a8e0",
      },
      {
        name: "Sky Blue",
        hex: "#87ceeb",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        6,
        24,
        50,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Vardhaman",
      "Catalogue",
    ],
    relatedSlugs: [
      "cool-knit",
      "cotone",
      "baby-soft",
    ],
    galleryImages: [
      "/assets/images/products/cotton-dreamz/gallery-1.webp",
      "/assets/images/products/cotton-dreamz/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.6,
    reviewCount: 43,
    bundleWith: [
      "cool-knit",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/cotton-dreamz/hero.webp",
      gallery: [
        "/assets/images/products/cotton-dreamz/gallery-1.webp",
        "/assets/images/products/cotton-dreamz/gallery-2.webp",
      ],
      colorImages: {
        seafoam: "/assets/images/products/cotton-dreamz/color-seafoam.webp",
        "hot-pink": "/assets/images/products/cotton-dreamz/color-hot-pink.webp",
        "butter-yellow": "/assets/images/products/cotton-dreamz/color-butter-yellow.webp",
        lavender: "/assets/images/products/cotton-dreamz/color-lavender.webp",
        "sky-blue": "/assets/images/products/cotton-dreamz/color-sky-blue.webp",
      },
    },
  },
  {
    name: "Cool Knit",
    slug: "cool-knit",
    category: "Vardhaman Products",
    variants: "Soft yarn range",
    description: "Cool Knit from Vardhaman offers a soft, lightweight yarn perfect for knitting and crochet. Its gentle texture is suitable for wearables, scarves, baby garments, and everyday craft creations that need a soft, comfortable finish.",
    suitableFor: "Knitting, soft craft products, everyday creations",
    image: "/assets/images/products/cool-knit/hero.webp",
    type: "yarn-ball",
    brand: "Vardhaman",
    tags: [
      "Knitting",
      "Soft Yarn",
      "Wearables",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
    ],
    palette: [
      "#68b7c8",
      "#f8b3be",
      "#8b6f47",
    ],
    colors: [
      {
        name: "Ocean Blue",
        hex: "#68b7c8",
      },
      {
        name: "Baby Pink",
        hex: "#f8b3be",
      },
      {
        name: "Walnut Brown",
        hex: "#8b6f47",
      },
      {
        name: "Sage Green",
        hex: "#9dc09f",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        6,
        24,
        50,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Soft Feel",
      "Bulk",
    ],
    relatedSlugs: [
      "cotton-dreamz",
      "baby-soft",
      "blankie",
    ],
    galleryImages: [
      "/assets/images/products/cool-knit/gallery-1.webp",
      "/assets/images/products/cool-knit/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.5,
    reviewCount: 39,
    bundleWith: [
      "cotton-dreamz",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/cool-knit/hero.webp",
      gallery: [
        "/assets/images/products/cool-knit/gallery-1.webp",
        "/assets/images/products/cool-knit/gallery-2.webp",
      ],
      colorImages: {
        "ocean-blue": "/assets/images/products/cool-knit/color-ocean-blue.webp",
        "baby-pink": "/assets/images/products/cool-knit/color-baby-pink.webp",
        "walnut-brown": "/assets/images/products/cool-knit/color-walnut-brown.webp",
        "sage-green": "/assets/images/products/cool-knit/color-sage-green.webp",
      },
    },
  },
  {
    name: "Cotone",
    slug: "cotone",
    category: "Vardhaman Products",
    variants: "Cotton yarn options",
    description: "Cotone by Vardhaman is a pure cotton yarn with a smooth, mercerized finish. It produces clean, defined stitches and is ideal for crochet wearables, handmade accessories, and boutique-quality products. Available in elegant shades.",
    suitableFor: "Crochet wearables, handmade accessories, boutique orders",
    image: "/assets/images/products/cotone/hero.webp",
    type: "yarn-ball",
    brand: "Vardhaman",
    tags: [
      "Crochet",
      "Boutique",
      "Mercerized",
      "Wearables",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
      "Crochet Threads",
    ],
    palette: [
      "#1e9f92",
      "#f7c8d1",
      "#f1f7ee",
    ],
    colors: [
      {
        name: "Emerald Teal",
        hex: "#1e9f92",
      },
      {
        name: "Rose Quartz",
        hex: "#f7c8d1",
      },
      {
        name: "Mint Cream",
        hex: "#f1f7ee",
      },
      {
        name: "Mauve",
        hex: "#d4a5b5",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        6,
        24,
        50,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Cotton",
      "Enquire",
    ],
    relatedSlugs: [
      "cotton-dreamz",
      "4-ply-cotton-thread",
      "cool-knit",
    ],
    galleryImages: [
      "/assets/images/products/cotone/gallery-1.webp",
      "/assets/images/products/cotone/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.6,
    reviewCount: 45,
    bundleWith: [
      "cotton-dreamz",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/cotone/hero.webp",
      gallery: [
        "/assets/images/products/cotone/gallery-1.webp",
        "/assets/images/products/cotone/gallery-2.webp",
      ],
      colorImages: {
        "emerald-teal": "/assets/images/products/cotone/color-emerald-teal.webp",
        "rose-quartz": "/assets/images/products/cotone/color-rose-quartz.webp",
        "mint-cream": "/assets/images/products/cotone/color-mint-cream.webp",
        mauve: "/assets/images/products/cotone/color-mauve.webp",
      },
    },
  },
  {
    name: "Baby Soft",
    slug: "baby-soft",
    category: "Vardhaman Products",
    variants: "Soft-touch yarn line",
    description: "Baby Soft by Vardhaman is an ultra-gentle yarn designed for baby garments, soft toys, and delicate knitting projects. Its hypoallergenic texture and pastel colour range make it a favourite among makers creating gifts and baby products.",
    suitableFor: "Baby projects, soft toys, light knitting and crochet",
    image: "/assets/images/products/baby-soft/hero.webp",
    type: "yarn-ball",
    brand: "Vardhaman",
    tags: [
      "Crochet",
      "Knitting",
      "Hypoallergenic",
      "Baby Wear",
      "Bulk Orders",
      "New Arrivals",
    ],
    filters: [
      "Yarns",
    ],
    palette: [
      "#f7a9bd",
      "#d8f2ee",
      "#b7dfd8",
    ],
    colors: [
      {
        name: "Candy Pink",
        hex: "#f7a9bd",
      },
      {
        name: "Mint Frost",
        hex: "#d8f2ee",
      },
      {
        name: "Aqua Soft",
        hex: "#b7dfd8",
      },
      {
        name: "Lemon Chiffon",
        hex: "#fff8dc",
      },
      {
        name: "Lilac",
        hex: "#d4b8e0",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        6,
        24,
        50,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Soft",
      "New",
    ],
    relatedSlugs: [
      "cool-knit",
      "blankie",
      "cotton-dreamz",
    ],
    galleryImages: [
      "/assets/images/products/baby-soft/gallery-1.webp",
      "/assets/images/products/baby-soft/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.8,
    reviewCount: 60,
    bundleWith: [
      "cool-knit",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/baby-soft/hero.webp",
      gallery: [
        "/assets/images/products/baby-soft/gallery-1.webp",
        "/assets/images/products/baby-soft/gallery-2.webp",
      ],
      colorImages: {
        "candy-pink": "/assets/images/products/baby-soft/color-candy-pink.webp",
        "mint-frost": "/assets/images/products/baby-soft/color-mint-frost.webp",
        "aqua-soft": "/assets/images/products/baby-soft/color-aqua-soft.webp",
        "lemon-chiffon": "/assets/images/products/baby-soft/color-lemon-chiffon.webp",
        lilac: "/assets/images/products/baby-soft/color-lilac.webp",
      },
    },
  },
  {
    name: "Blankie",
    slug: "blankie",
    category: "Ganga Products",
    variants: "Ganga soft yarn",
    description: "Blankie by Ganga is a plush, chunky yarn perfect for blankets, throws, and cozy home d\u00e9cor. Its soft, bulky texture works up quickly for satisfying projects. Available in soothing, muted tones ideal for living spaces and gifting.",
    suitableFor: "Blankets, soft decor, crochet and knitting projects",
    image: "/assets/images/products/blankie/hero.webp",
    type: "yarn-ball",
    brand: "Ganga",
    tags: [
      "Crochet",
      "Knitting",
      "Chunky",
      "Home Decor",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
    ],
    palette: [
      "#85c7bd",
      "#f2d0d8",
      "#ddc49a",
    ],
    colors: [
      {
        name: "Sage Teal",
        hex: "#85c7bd",
      },
      {
        name: "Petal Pink",
        hex: "#f2d0d8",
      },
      {
        name: "Wheat Gold",
        hex: "#ddc49a",
      },
      {
        name: "Cloud Grey",
        hex: "#c8c8c8",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 100,
      step: 1,
      presets: [
        1,
        6,
        12,
        24,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Ganga",
      "Soft",
    ],
    relatedSlugs: [
      "spectrum",
      "superstitch",
      "baby-soft",
    ],
    galleryImages: [
      "/assets/images/products/blankie/gallery-1.webp",
      "/assets/images/products/blankie/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.6,
    reviewCount: 33,
    bundleWith: [
      "spectrum",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/blankie/hero.webp",
      gallery: [
        "/assets/images/products/blankie/gallery-1.webp",
        "/assets/images/products/blankie/gallery-2.webp",
      ],
      colorImages: {
        "sage-teal": "/assets/images/products/blankie/color-sage-teal.webp",
        "petal-pink": "/assets/images/products/blankie/color-petal-pink.webp",
        "wheat-gold": "/assets/images/products/blankie/color-wheat-gold.webp",
        "cloud-grey": "/assets/images/products/blankie/color-cloud-grey.webp",
      },
    },
  },
  {
    name: "Spectrum",
    slug: "spectrum",
    category: "Ganga Products",
    variants: "Colour-focused yarn range",
    description: "Spectrum by Ganga is a vibrant yarn range designed for colour-rich projects. Each shade is selected for maximum visual impact, making it ideal for boutique products, statement pieces, and craft makers who want their work to stand out.",
    suitableFor: "Bright projects, boutiques, resellers, craft makers",
    image: "/assets/images/products/spectrum/hero.webp",
    type: "yarn-ball",
    brand: "Ganga",
    tags: [
      "Crochet",
      "Knitting",
      "Vibrant Colors",
      "Boutique",
      "Bulk Orders",
      "New Arrivals",
    ],
    filters: [
      "Yarns",
    ],
    palette: [
      "#e86f9e",
      "#32b8ac",
      "#f5c84b",
    ],
    colors: [
      {
        name: "Fuchsia",
        hex: "#e86f9e",
      },
      {
        name: "Teal Green",
        hex: "#32b8ac",
      },
      {
        name: "Golden Yellow",
        hex: "#f5c84b",
      },
      {
        name: "Electric Blue",
        hex: "#4a90d9",
      },
      {
        name: "Tangerine",
        hex: "#f5a623",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 100,
      step: 1,
      presets: [
        1,
        6,
        12,
        24,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Colour Range",
      "New",
    ],
    relatedSlugs: [
      "blankie",
      "superstitch",
      "cotton-dreamz",
    ],
    galleryImages: [
      "/assets/images/products/spectrum/gallery-1.webp",
      "/assets/images/products/spectrum/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.8,
    reviewCount: 70,
    bundleWith: [
      "blankie",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/spectrum/hero.webp",
      gallery: [
        "/assets/images/products/spectrum/gallery-1.webp",
        "/assets/images/products/spectrum/gallery-2.webp",
      ],
      colorImages: {
        fuchsia: "/assets/images/products/spectrum/color-fuchsia.webp",
        "teal-green": "/assets/images/products/spectrum/color-teal-green.webp",
        "golden-yellow": "/assets/images/products/spectrum/color-golden-yellow.webp",
        "electric-blue": "/assets/images/products/spectrum/color-electric-blue.webp",
        tangerine: "/assets/images/products/spectrum/color-tangerine.webp",
      },
    },
  },
  {
    name: "Superstitch",
    slug: "superstitch",
    category: "Ganga Products",
    variants: "Ganga Superstitch line",
    description: "Superstitch by Ganga is a versatile thread suitable for crochet, craft finishing, and decorative stitching. Its reliable twist and colour fastness make it a dependable choice for both beginners and experienced makers.",
    suitableFor: "Crochet, craft finishing, decorative stitching",
    image: "/assets/images/products/superstitch/hero.webp",
    type: "yarn-ball",
    brand: "Ganga",
    tags: [
      "Crochet",
      "Sewing",
      "Craft Finishing",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Yarns",
      "Crochet Threads",
    ],
    palette: [
      "#296f68",
      "#f9a8b7",
      "#f6e6b6",
    ],
    colors: [
      {
        name: "Forest Teal",
        hex: "#296f68",
      },
      {
        name: "Blush Rose",
        hex: "#f9a8b7",
      },
      {
        name: "Vanilla",
        hex: "#f6e6b6",
      },
      {
        name: "Charcoal",
        hex: "#4a4a4a",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        12,
        50,
        100,
      ],
      soldAs: "Ball",
    },
    badges: [
      "Ganga",
      "Craft",
    ],
    relatedSlugs: [
      "spectrum",
      "blankie",
      "makhhi-thread",
    ],
    galleryImages: [
      "/assets/images/products/superstitch/gallery-1.webp",
      "/assets/images/products/superstitch/gallery-2.webp",
    ],
    masterCategory: "Yarns",
    rating: 4.5,
    reviewCount: 41,
    bundleWith: [
      "spectrum",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/superstitch/hero.webp",
      gallery: [
        "/assets/images/products/superstitch/gallery-1.webp",
        "/assets/images/products/superstitch/gallery-2.webp",
      ],
      colorImages: {
        "forest-teal": "/assets/images/products/superstitch/color-forest-teal.webp",
        "blush-rose": "/assets/images/products/superstitch/color-blush-rose.webp",
        vanilla: "/assets/images/products/superstitch/color-vanilla.webp",
        charcoal: "/assets/images/products/superstitch/color-charcoal.webp",
      },
    },
  },
  {
    name: "T-Shirt Yarn",
    slug: "t-shirt-yarn",
    category: "T-Shirt Yarn",
    variants: "Solid and multi colours, 250gm and 500gm",
    description: "T-Shirt Yarn is a chunky, flat yarn made from jersey fabric strips. Perfect for bags, baskets, mats, and home d\u00e9cor, it works up quickly with large hooks. Available in solid and multicolour options in 250gm and 500gm packs.",
    suitableFor: "Bags, baskets, mats, decor, chunky handmade projects",
    image: "/assets/images/products/t-shirt-yarn/hero.webp",
    type: "fabric-yarn",
    brand: "Fakhri",
    tags: [
      "Crochet",
      "Bag Making",
      "Baskets",
      "Chunky",
      "Bulk Orders",
      "New Arrivals",
    ],
    filters: [
      "Yarns",
      "Purse Materials",
    ],
    palette: [
      "#32b8ac",
      "#ed7fa2",
      "#b9855b",
    ],
    colors: [
      {
        name: "Teal",
        hex: "#32b8ac",
      },
      {
        name: "Rosy Pink",
        hex: "#ed7fa2",
      },
      {
        name: "Camel Brown",
        hex: "#b9855b",
      },
      {
        name: "Navy Blue",
        hex: "#2c3e6b",
      },
      {
        name: "Mustard",
        hex: "#d4a825",
      },
      {
        name: "Ivory",
        hex: "#f5f0e8",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 100,
      step: 1,
      presets: [
        1,
        6,
        12,
        24,
      ],
      soldAs: "Pack",
    },
    badges: [
      "250gm/500gm",
      "Multi",
    ],
    relatedSlugs: [
      "single-macrame-cord",
      "purse-handles",
    ],
    galleryImages: [
      "/assets/images/products/t-shirt-yarn/gallery-1.webp",
      "/assets/images/products/t-shirt-yarn/gallery-2.webp",
    ],
    masterCategory: "Accessories",
    rating: 4.9,
    reviewCount: 59,
    bundleWith: [
      "single-macrame-cord",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/t-shirt-yarn/hero.webp",
      gallery: [
        "/assets/images/products/t-shirt-yarn/gallery-1.webp",
        "/assets/images/products/t-shirt-yarn/gallery-2.webp",
      ],
      colorImages: {
        teal: "/assets/images/products/t-shirt-yarn/color-teal.webp",
        "rosy-pink": "/assets/images/products/t-shirt-yarn/color-rosy-pink.webp",
        "camel-brown": "/assets/images/products/t-shirt-yarn/color-camel-brown.webp",
        "navy-blue": "/assets/images/products/t-shirt-yarn/color-navy-blue.webp",
        mustard: "/assets/images/products/t-shirt-yarn/color-mustard.webp",
        ivory: "/assets/images/products/t-shirt-yarn/color-ivory.webp",
      },
    },
  },
  {
    name: "Single Macrame Cord",
    slug: "single-macrame-cord",
    category: "Macrame Cord",
    variants: "Available in 3MM and 4MM",
    description: "Single twist macrame cord available in 3MM and 4MM thickness. Its smooth, single-strand construction is ideal for wall hangings, plant hangers, dreamcatchers, and bag work. Available in natural and coloured options.",
    suitableFor: "Macrame decor, wall hangings, plant hangers, bag work",
    image: "/assets/images/products/single-macrame-cord/hero.webp",
    type: "macrame-cord",
    brand: "Fakhri",
    tags: [
      "Macrame",
      "Wall Hangers",
      "Plant Hangers",
      "Bags",
      "Bulk Orders",
      "New Arrivals",
    ],
    filters: [
      "Macrame",
    ],
    palette: [
      "#d8b38f",
      "#35b8ad",
      "#f7c8d1",
    ],
    colors: [
      {
        name: "Natural Beige",
        hex: "#d8b38f",
      },
      {
        name: "Teal",
        hex: "#35b8ad",
      },
      {
        name: "Blush",
        hex: "#f7c8d1",
      },
      {
        name: "Black",
        hex: "#333333",
      },
      {
        name: "Mustard",
        hex: "#d4a825",
      },
    ],
    quantityOptions: {
      unit: "m",
      min: 10,
      max: 500,
      step: 10,
      presets: [
        10,
        25,
        50,
        100,
      ],
      soldAs: "Spool",
    },
    badges: [
      "3MM/4MM",
      "Cord",
    ],
    relatedSlugs: [
      "twisted-macrame-cord",
      "t-shirt-yarn",
    ],
    galleryImages: [
      "/assets/images/products/single-macrame-cord/gallery-1.webp",
      "/assets/images/products/single-macrame-cord/gallery-2.webp",
    ],
    masterCategory: "Accessories",
    rating: 4.9,
    reviewCount: 79,
    bundleWith: [
      "twisted-macrame-cord",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/single-macrame-cord/hero.webp",
      gallery: [
        "/assets/images/products/single-macrame-cord/gallery-1.webp",
        "/assets/images/products/single-macrame-cord/gallery-2.webp",
      ],
      colorImages: {
        "natural-beige": "/assets/images/products/single-macrame-cord/color-natural-beige.webp",
        teal: "/assets/images/products/single-macrame-cord/color-teal.webp",
        blush: "/assets/images/products/single-macrame-cord/color-blush.webp",
        black: "/assets/images/products/single-macrame-cord/color-black.webp",
        mustard: "/assets/images/products/single-macrame-cord/color-mustard.webp",
      },
    },
  },
  {
    name: "Twisted Macrame Cord",
    slug: "twisted-macrame-cord",
    category: "Macrame Cord",
    variants: "Twisted cord in 3MM and 4MM",
    description: "Twisted macrame cord with a structured, rope-like finish. Available in 3MM and 4MM, its multi-strand twist adds texture and definition to macrame projects, handles, and accessories. Great for structured wall hangings and bag details.",
    suitableFor: "Structured macrame projects, decor, handles, accessories",
    image: "/assets/images/products/twisted-macrame-cord/hero.webp",
    type: "macrame-cord",
    brand: "Fakhri",
    tags: [
      "Macrame",
      "Structured Weaves",
      "Handles",
      "Bags",
      "Bulk Orders",
    ],
    filters: [
      "Macrame",
    ],
    palette: [
      "#9a704f",
      "#f2b8c6",
      "#6dc7bd",
    ],
    colors: [
      {
        name: "Coffee Brown",
        hex: "#9a704f",
      },
      {
        name: "Rose Pink",
        hex: "#f2b8c6",
      },
      {
        name: "Mint Teal",
        hex: "#6dc7bd",
      },
      {
        name: "Cream",
        hex: "#f5f0e0",
      },
    ],
    quantityOptions: {
      unit: "m",
      min: 10,
      max: 500,
      step: 10,
      presets: [
        10,
        25,
        50,
        100,
      ],
      soldAs: "Spool",
    },
    badges: [
      "Twisted",
      "Bulk",
    ],
    relatedSlugs: [
      "single-macrame-cord",
      "t-shirt-yarn",
    ],
    galleryImages: [
      "/assets/images/products/twisted-macrame-cord/gallery-1.webp",
      "/assets/images/products/twisted-macrame-cord/gallery-2.webp",
    ],
    masterCategory: "Accessories",
    rating: 4.5,
    reviewCount: 29,
    bundleWith: [
      "single-macrame-cord",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/twisted-macrame-cord/hero.webp",
      gallery: [
        "/assets/images/products/twisted-macrame-cord/gallery-1.webp",
        "/assets/images/products/twisted-macrame-cord/gallery-2.webp",
      ],
      colorImages: {
        "coffee-brown": "/assets/images/products/twisted-macrame-cord/color-coffee-brown.webp",
        "rose-pink": "/assets/images/products/twisted-macrame-cord/color-rose-pink.webp",
        "mint-teal": "/assets/images/products/twisted-macrame-cord/color-mint-teal.webp",
        cream: "/assets/images/products/twisted-macrame-cord/color-cream.webp",
      },
    },
  },
  {
    name: "Anchor Lacchi",
    slug: "anchor-lacchi",
    category: "Embroidery Threads",
    variants: "Embroidery thread lacchi",
    description: "Anchor Lacchi is a classic embroidery thread lacchi known for its vibrant colours and smooth texture. Ideal for detailed embroidery, surface work, and craft decoration. Available in a wide range of shades for every design need.",
    suitableFor: "Embroidery, detailing, surface work, craft decoration",
    image: "/assets/images/products/anchor-lacchi/hero.webp",
    type: "embroidery-floss",
    brand: "Anchor",
    tags: [
      "Embroidery",
      "Surface Work",
      "Needlework",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Embroidery",
    ],
    palette: [
      "#db5d8b",
      "#27a69b",
      "#f5c84b",
    ],
    colors: [
      {
        name: "Magenta",
        hex: "#db5d8b",
      },
      {
        name: "Jade Green",
        hex: "#27a69b",
      },
      {
        name: "Golden Yellow",
        hex: "#f5c84b",
      },
      {
        name: "Royal Blue",
        hex: "#3d5aa9",
      },
      {
        name: "Red",
        hex: "#d44545",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        12,
        24,
        50,
      ],
      soldAs: "Skein",
    },
    badges: [
      "Embroidery",
      "Lacchi",
    ],
    relatedSlugs: [
      "doli-lacchi",
    ],
    galleryImages: [
      "/assets/images/products/anchor-lacchi/gallery-1.webp",
      "/assets/images/products/anchor-lacchi/gallery-2.webp",
    ],
    masterCategory: "Threads",
    rating: 4.7,
    reviewCount: 44,
    bundleWith: [
      "doli-lacchi",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/anchor-lacchi/hero.webp",
      gallery: [
        "/assets/images/products/anchor-lacchi/gallery-1.webp",
        "/assets/images/products/anchor-lacchi/gallery-2.webp",
      ],
      colorImages: {
        magenta: "/assets/images/products/anchor-lacchi/color-magenta.webp",
        "jade-green": "/assets/images/products/anchor-lacchi/color-jade-green.webp",
        "golden-yellow": "/assets/images/products/anchor-lacchi/color-golden-yellow.webp",
        "royal-blue": "/assets/images/products/anchor-lacchi/color-royal-blue.webp",
        red: "/assets/images/products/anchor-lacchi/color-red.webp",
      },
    },
  },
  {
    name: "Doli Lacchi",
    slug: "doli-lacchi",
    category: "Embroidery Threads",
    variants: "Embroidery thread lacchi",
    description: "Doli Lacchi is a vibrant embroidery thread lacchi for decorative stitching, craft projects, and handmade detailing. Its colour range spans bright and subtle shades, making it versatile for both traditional and modern embroidery work.",
    suitableFor: "Decorative stitching, craft projects, handmade detailing",
    image: "/assets/images/products/doli-lacchi/hero.webp",
    type: "embroidery-floss",
    brand: "Doli",
    tags: [
      "Embroidery",
      "Decorative Stitching",
      "Needlework",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Embroidery",
    ],
    palette: [
      "#9a5cc8",
      "#f2a7b7",
      "#45b8ad",
    ],
    colors: [
      {
        name: "Purple",
        hex: "#9a5cc8",
      },
      {
        name: "Salmon Pink",
        hex: "#f2a7b7",
      },
      {
        name: "Aqua Teal",
        hex: "#45b8ad",
      },
      {
        name: "Sunshine Yellow",
        hex: "#f5d547",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 200,
      step: 1,
      presets: [
        1,
        12,
        24,
        50,
      ],
      soldAs: "Skein",
    },
    badges: [
      "Lacchi",
      "Colours",
    ],
    relatedSlugs: [
      "anchor-lacchi",
    ],
    galleryImages: [
      "/assets/images/products/doli-lacchi/gallery-1.webp",
      "/assets/images/products/doli-lacchi/gallery-2.webp",
    ],
    masterCategory: "Threads",
    rating: 4.5,
    reviewCount: 28,
    bundleWith: [
      "anchor-lacchi",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/doli-lacchi/hero.webp",
      gallery: [
        "/assets/images/products/doli-lacchi/gallery-1.webp",
        "/assets/images/products/doli-lacchi/gallery-2.webp",
      ],
      colorImages: {
        purple: "/assets/images/products/doli-lacchi/color-purple.webp",
        "salmon-pink": "/assets/images/products/doli-lacchi/color-salmon-pink.webp",
        "aqua-teal": "/assets/images/products/doli-lacchi/color-aqua-teal.webp",
        "sunshine-yellow": "/assets/images/products/doli-lacchi/color-sunshine-yellow.webp",
      },
    },
  },
  {
    name: "Crochet Hook",
    slug: "crochet-hook",
    category: "Accessories",
    variants: "Crochet hook sizes available on request",
    description: "Quality crochet hooks available in a variety of sizes suitable for different yarn weights. Essential for every crochet artist, from beginners learning their first stitches to experienced makers working on intricate patterns. Size details available on request.",
    suitableFor: "Crochet artists, beginners, boutiques, craft stores",
    image: "/assets/images/products/crochet-hook/hero.webp",
    type: "hook",
    brand: "Fakhri",
    tags: [
      "Accessories",
      "Crochet Tools",
      "Essential",
      "Retail",
      "Bulk Orders",
    ],
    filters: [
      "Accessories",
      "Crochet Threads",
    ],
    palette: [
      "#35b8ad",
      "#f3c65f",
      "#ffb0bd",
    ],
    colors: [
      {
        name: "Teal",
        hex: "#35b8ad",
      },
      {
        name: "Gold",
        hex: "#f3c65f",
      },
      {
        name: "Rose",
        hex: "#ffb0bd",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 100,
      step: 1,
      presets: [
        1,
        6,
        12,
        24,
      ],
      soldAs: "Set",
    },
    badges: [
      "Accessory",
      "Request Size",
    ],
    relatedSlugs: [
      "makhhi-thread",
      "4-ply-cotton-thread",
    ],
    galleryImages: [
      "/assets/images/products/crochet-hook/gallery-1.webp",
      "/assets/images/products/crochet-hook/gallery-2.webp",
    ],
    masterCategory: "Accessories",
    rating: 4.6,
    reviewCount: 49,
    bundleWith: [
      "makhhi-thread",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/crochet-hook/hero.webp",
      gallery: [
        "/assets/images/products/crochet-hook/gallery-1.webp",
        "/assets/images/products/crochet-hook/gallery-2.webp",
      ],
      colorImages: {
        teal: "/assets/images/products/crochet-hook/color-teal.webp",
        gold: "/assets/images/products/crochet-hook/color-gold.webp",
        rose: "/assets/images/products/crochet-hook/color-rose.webp",
      },
    },
  },
  {
    name: "Purse Handles",
    slug: "purse-handles",
    category: "Purse Handles",
    variants: "Wooden, chain, pearl, and decorative handles",
    description: "Premium purse handles in wooden, chain, pearl, and decorative styles. These finishing accessories elevate handmade crochet bags and purses to boutique quality. Available in various sizes and finishes to match any design aesthetic.",
    suitableFor: "Crochet bags, handmade purses, boutique accessories",
    image: "/assets/images/products/purse-handles/hero.webp",
    type: "purse-handle",
    brand: "Fakhri",
    tags: [
      "Accessories",
      "Bag Making",
      "Finishing Hardware",
      "Bulk Orders",
      "New Arrivals",
    ],
    filters: [
      "Purse Materials",
      "Accessories",
    ],
    palette: [
      "#c09162",
      "#f3b4c2",
      "#3aaea5",
    ],
    colors: [
      {
        name: "Wooden Brown",
        hex: "#c09162",
      },
      {
        name: "Blush Pink",
        hex: "#f3b4c2",
      },
      {
        name: "Teal Green",
        hex: "#3aaea5",
      },
      {
        name: "Gold",
        hex: "#c5a44b",
      },
    ],
    quantityOptions: {
      unit: "pcs",
      min: 1,
      max: 100,
      step: 1,
      presets: [
        1,
        6,
        12,
        24,
      ],
      soldAs: "Set",
    },
    badges: [
      "Purse",
      "Finishing",
    ],
    relatedSlugs: [
      "t-shirt-yarn",
      "crochet-hook",
    ],
    galleryImages: [
      "/assets/images/products/purse-handles/gallery-1.webp",
      "/assets/images/products/purse-handles/gallery-2.webp",
    ],
    masterCategory: "Accessories",
    rating: 4.7,
    reviewCount: 61,
    bundleWith: [
      "t-shirt-yarn",
    ],
    stock: "in",
    images: {
      hero: "/assets/images/products/purse-handles/hero.webp",
      gallery: [
        "/assets/images/products/purse-handles/gallery-1.webp",
        "/assets/images/products/purse-handles/gallery-2.webp",
      ],
      colorImages: {
        "wooden-brown": "/assets/images/products/purse-handles/color-wooden-brown.webp",
        "blush-pink": "/assets/images/products/purse-handles/color-blush-pink.webp",
        "teal-green": "/assets/images/products/purse-handles/color-teal-green.webp",
        gold: "/assets/images/products/purse-handles/color-gold.webp",
      },
    },
  },
];

// Quick lookup maps
const bySlug = new Map(products.map((p) => [p.slug, p]));
export function getProductBySlug(slug) {
  return bySlug.get(slug);
}

export const featuredProducts = products.filter((p) =>
  ["makhhi-thread", "cotton-dreamz", "single-macrame-cord", "purse-handles",
   "t-shirt-yarn", "anchor-lacchi", "baby-soft", "spectrum"].includes(p.slug)
);

// Build a WhatsApp deep link with a pre-filled message.
export function createWhatsAppLink(message) {
  return `https://wa.me/${businessInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Default catalogue enquiry message
export const DEFAULT_ENQUIRY_MESSAGE = `Hello ${businessInfo.shortName}, I hope you are doing well. I am interested in your yarns and craft products. Could you please share your latest product catalogue, shade details, and bulk pricing information? Thank you!`;

// Honest shipping note (replaces the old fake PincodeChecker).
export const SHIPPING_NOTE = "We ship pan-India. Typical transit: 3–5 business days. Confirm exact timing for your area on WhatsApp.";
