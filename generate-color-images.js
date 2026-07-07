import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const products = [
  {
    name: "Makhhi Thread",
    slug: "makhhi-thread",
    type: "crochet thread",
    colors: [
      { name: "Teal", hex: "#35b8ad" },
      { name: "Blush Pink", hex: "#f6a7b8" },
      { name: "Sunflower Gold", hex: "#f3c65f" },
      { name: "Mint Green", hex: "#7ecdb5" },
      { name: "Coral", hex: "#f28b82" }
    ]
  },
  {
    name: "4 Ply Cotton Thread",
    slug: "4-ply-cotton-thread",
    type: "cotton thread",
    colors: [
      { name: "Deep Teal", hex: "#2f9f98" },
      { name: "Peach Cream", hex: "#ffe2d8" },
      { name: "Dusty Rose", hex: "#c77d90" },
      { name: "Ivory", hex: "#f5f0e8" },
      { name: "Charcoal", hex: "#4a4a4a" }
    ]
  },
  {
    name: "Cotton Dreamz",
    slug: "cotton-dreamz",
    type: "cotton yarn ball",
    colors: [
      { name: "Seafoam", hex: "#94d4c9" },
      { name: "Hot Pink", hex: "#ed7fa2" },
      { name: "Butter Yellow", hex: "#f9d976" },
      { name: "Lavender", hex: "#c4a8e0" },
      { name: "Sky Blue", hex: "#87ceeb" }
    ]
  },
  {
    name: "Cool Knit",
    slug: "cool-knit",
    type: "knitting yarn ball",
    colors: [
      { name: "Ocean Blue", hex: "#68b7c8" },
      { name: "Baby Pink", hex: "#f8b3be" },
      { name: "Walnut Brown", hex: "#8b6f47" },
      { name: "Sage Green", hex: "#9dc09f" }
    ]
  },
  {
    name: "Cotone",
    slug: "cotone",
    type: "mercerized cotton yarn",
    colors: [
      { name: "Emerald Teal", hex: "#1e9f92" },
      { name: "Rose Quartz", hex: "#f7c8d1" },
      { name: "Mint Cream", hex: "#f1f7ee" },
      { name: "Mauve", hex: "#d4a5b5" }
    ]
  },
  {
    name: "Baby Soft",
    slug: "baby-soft",
    type: "soft acrylic yarn",
    colors: [
      { name: "Candy Pink", hex: "#f7a9bd" },
      { name: "Mint Frost", hex: "#d8f2ee" },
      { name: "Aqua Soft", hex: "#b7dfd8" },
      { name: "Lemon Chiffon", hex: "#fff8dc" },
      { name: "Lilac", hex: "#d4b8e0" }
    ]
  },
  {
    name: "Blankie",
    slug: "blankie",
    type: "chunky blanket yarn ball",
    colors: [
      { name: "Sage Teal", hex: "#85c7bd" },
      { name: "Petal Pink", hex: "#f2d0d8" },
      { name: "Wheat Gold", hex: "#ddc49a" },
      { name: "Cloud Grey", hex: "#c8c8c8" }
    ]
  },
  {
    name: "Spectrum",
    slug: "spectrum",
    type: "vibrant yarn ball",
    colors: [
      { name: "Fuchsia", hex: "#e86f9e" },
      { name: "Teal Green", hex: "#32b8ac" },
      { name: "Golden Yellow", hex: "#f5c84b" },
      { name: "Electric Blue", hex: "#4a90d9" },
      { name: "Tangerine", hex: "#f5a623" }
    ]
  },
  {
    name: "Superstitch",
    slug: "superstitch",
    type: "craft sewing yarn ball",
    colors: [
      { name: "Forest Teal", hex: "#296f68" },
      { name: "Blush Rose", hex: "#f9a8b7" },
      { name: "Vanilla", hex: "#f6e6b6" },
      { name: "Charcoal", hex: "#4a4a4a" }
    ]
  },
  {
    name: "T-Shirt Yarn",
    slug: "t-shirt-yarn",
    type: "chunky flat fabric yarn ball",
    colors: [
      { name: "Teal", hex: "#32b8ac" },
      { name: "Rosy Pink", hex: "#ed7fa2" },
      { name: "Camel Brown", hex: "#b9855b" },
      { name: "Navy Blue", hex: "#2c3e6b" },
      { name: "Mustard", hex: "#d4a825" },
      { name: "Ivory", hex: "#f5f0e8" }
    ]
  },
  {
    name: "Single Macrame Cord",
    slug: "single-macrame-cord",
    type: "single twist macrame rope roll",
    colors: [
      { name: "Natural Beige", hex: "#d8b38f" },
      { name: "Teal", hex: "#35b8ad" },
      { name: "Blush", hex: "#f7c8d1" },
      { name: "Black", hex: "#333333" },
      { name: "Mustard", hex: "#d4a825" }
    ]
  },
  {
    name: "Twisted Macrame Cord",
    slug: "twisted-macrame-cord",
    type: "twisted multi strand macrame rope roll",
    colors: [
      { name: "Coffee Brown", hex: "#9a704f" },
      { name: "Rose Pink", hex: "#f2b8c6" },
      { name: "Mint Teal", hex: "#6dc7bd" },
      { name: "Cream", hex: "#f5f0e0" }
    ]
  },
  {
    name: "Anchor Lacchi",
    slug: "anchor-lacchi",
    type: "embroidery thread floss skein",
    colors: [
      { name: "Magenta", hex: "#db5d8b" },
      { name: "Jade Green", hex: "#27a69b" },
      { name: "Golden Yellow", hex: "#f5c84b" },
      { name: "Royal Blue", hex: "#3d5aa9" },
      { name: "Red", hex: "#d44545" }
    ]
  },
  {
    name: "Doli Lacchi",
    slug: "doli-lacchi",
    type: "embroidery thread floss skein",
    colors: [
      { name: "Purple", hex: "#9a5cc8" },
      { name: "Salmon Pink", hex: "#f2a7b7" },
      { name: "Aqua Teal", hex: "#45b8ad" },
      { name: "Sunshine Yellow", hex: "#f5d547" }
    ]
  },
  {
    name: "Crochet Hook",
    slug: "crochet-hook",
    type: "ergonomic metal crochet hook with colored handle",
    colors: [
      { name: "Teal", hex: "#35b8ad" },
      { name: "Gold", hex: "#f3c65f" },
      { name: "Rose", hex: "#ffb0bd" }
    ]
  },
  {
    name: "Purse Handles",
    slug: "purse-handles",
    type: "premium purse handles accessory",
    colors: [
      { name: "Wooden Brown", hex: "#c09162" },
      { name: "Blush Pink", hex: "#f3b4c2" },
      { name: "Teal Green", hex: "#3aaea5" },
      { name: "Gold", hex: "#c5a44b" }
    ]
  }
];

const destDir = path.join('public', 'assets', 'images', 'products');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Generate a deterministic seed based on product name and color name
function getSeed(productName, colorName) {
  const str = productName + colorName;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 1000000;
}

// Build prompt based on product type
function getPrompt(product, color) {
  const type = product.type;
  const colorName = color.name;
  
  if (type.includes('yarn')) {
    return `A premium photorealistic product photograph of a single yarn ball in ${colorName} color. The yarn is neatly wound and shows beautiful realistic thread textures. Isolated on a clean, solid, soft off-white background with a soft shadow. Cozy craft style, highly detailed, 8k resolution, professional studio lighting.`;
  } else if (type.includes('thread') || type.includes('floss') || type.includes('skein')) {
    return `A premium photorealistic product photograph of a single skein of embroidery floss or crochet thread in ${colorName} color. Neatly wound with paper bands, showing realistic cotton thread texture. Isolated on a clean, solid, soft off-white background with a soft shadow. Needlework craft style, highly detailed, 8k resolution, professional studio lighting.`;
  } else if (type.includes('rope') || type.includes('cord')) {
    return `A premium photorealistic product photograph of a spool of macrame cord in ${colorName} color. The cord has a realistic cotton rope twist and texture. Isolated on a clean, solid, soft off-white background with a soft shadow. Bohemian craft style, highly detailed, 8k resolution, professional studio lighting.`;
  } else if (type.includes('hook')) {
    return `A premium photorealistic product photograph of a single high-quality crochet hook with a ${colorName} colored handle, lying on a clean, solid, soft off-white background with a soft shadow. Craft tool style, highly detailed, professional studio lighting.`;
  } else if (type.includes('handles') || type.includes('accessory')) {
    return `A premium photorealistic product photograph of a pair of high-quality purse handles in ${colorName} color. Lying on a clean, solid, soft off-white background with a soft shadow. Premium handbag hardware, craft accessory, highly detailed, professional studio lighting.`;
  }
  
  return `A premium photorealistic product photograph of ${product.name} in ${colorName} color, isolated on a clean, solid, soft off-white background with a soft shadow, highly detailed, professional studio lighting.`;
}

async function downloadAndOptimize(product, color, retryCount = 3) {
  const colorSlug = color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filename = `${product.slug}-${colorSlug}.webp`;
  const outputPath = path.join(destDir, filename);

  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`Skipping (already exists): ${filename}`);
    return;
  }

  const prompt = getPrompt(product, color);
  const seed = getSeed(product.name, color.name);
  const url = `https://image.pollinations.ai/p/${encodeURIComponent(prompt)}?width=600&height=600&nologo=true&seed=${seed}&enhance=false`;

  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`Generating [Attempt ${attempt}/${retryCount}]: ${product.name} (${color.name}) -> ${filename}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Process with sharp
      await sharp(buffer)
        .webp({ quality: 80, effort: 5 })
        .toFile(outputPath);

      console.log(`Successfully saved and optimized: ${filename}`);
      return;
    } catch (err) {
      console.error(`Error on attempt ${attempt} for ${filename}:`, err.message);
      if (attempt === retryCount) {
        console.error(`FAILED to generate ${filename} after ${retryCount} attempts.`);
      } else {
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

async function main() {
  const allTasks = [];
  for (const product of products) {
    for (const color of product.colors) {
      allTasks.push({ product, color });
    }
  }

  console.log(`Starting generation for ${allTasks.length} color variant images...`);
  
  // Run with concurrency limit of 5 to avoid overloading the API or local memory
  const concurrency = 5;
  for (let i = 0; i < allTasks.length; i += concurrency) {
    const batch = allTasks.slice(i, i + concurrency);
    console.log(`\nProcessing batch ${Math.floor(i / concurrency) + 1} of ${Math.ceil(allTasks.length / concurrency)}...`);
    await Promise.all(batch.map(task => downloadAndOptimize(task.product, task.color)));
    // Brief pause between batches
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\nAll color variant images processed!');
}

main().catch(err => {
  console.error('Fatal error in main script:', err);
  process.exit(1);
});
