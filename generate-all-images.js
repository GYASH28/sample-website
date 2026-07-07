import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { featuredProducts } from './src/data/siteData.js';

const destDir = path.join('public', 'assets', 'images', 'products');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Curated high-quality Unsplash image IDs that represent each product type perfectly
const productUnsplashMap = {
  'makhhi-thread': 'photo-1601924994987-69e26d50dc26', // Colorful embroidery skeins
  '4-ply-cotton-thread': 'photo-1606744824163-985d376605aa', // Working with yarn (verified)
  'cotton-dreamz': 'photo-1596461404969-9ae70f2830c1', // Cotton yarn in a basket
  'cool-knit': 'photo-1516962215378-7fa2e137ae93', // Pastel blue baby yarn (verified)
  'cotone': 'photo-1550985543-f47f38aeee65', // Fine spools of yarn
  'baby-soft': 'photo-1516962215378-7fa2e137ae93', // Pastel blue baby yarn
  'blankie': 'photo-1543852786-1cf6624b9987', // Chunky blanket yarn
  'spectrum': 'photo-1563245372-f21724e3856d', // Bright colorful spools
  'superstitch': 'photo-1506784983877-45594efa4cbe', // Sewing thread close up
  't-shirt-yarn': 'photo-1583847268964-b28dc8f51f92', // Fabric jersey yarn rolls
  'single-macrame-cord': 'photo-1608748010899-18f300247112', // Cotton macrame cord roll
  'twisted-macrame-cord': 'photo-1608748010899-18f300247112', // Macrame spool (verified)
  'anchor-lacchi': 'photo-1601924994987-69e26d50dc26', // Embroidery floss
  'doli-lacchi': 'photo-1544816155-12df9643f363', // Cotton embroidery skeins in row
  'crochet-hook': 'photo-1599599810769-bcde5a160d32', // Crochet hooks on yarn
  'purse-handles': 'photo-1547949003-9792a18a2601' // Wood and leather handles
};

// Curated category gallery images (Macro details and lifestyle context)
const categoryGalleryMap = {
  'Bliss Threads': [
    'photo-1596461404969-9ae70f2830c1',
    'photo-1517841905240-472988babdf9'
  ],
  'Vardhaman Products': [
    'photo-1606744824163-985d376605aa',
    'photo-1517841905240-472988babdf9'
  ],
  'Ganga Products': [
    'photo-1606744824163-985d376605aa',
    'photo-1543852786-1cf6624b9987'
  ],
  'T-Shirt Yarn': [
    'photo-1583847268964-b28dc8f51f92',
    'photo-1606744824163-985d376605aa'
  ],
  'Macrame Cord': [
    'photo-1608748010899-18f300247112',
    'photo-1608748010899-18f300247112' // Verified working ID
  ],
  'Embroidery Threads': [
    'photo-1601924994987-69e26d50dc26',
    'photo-1544816155-12df9643f363'
  ],
  'Decorative Threads': [
    'photo-1601924994987-69e26d50dc26',
    'photo-1506784983877-45594efa4cbe'
  ],
  'Accessories': [
    'photo-1599599810769-bcde5a160d32',
    'photo-1622396481328-9b1b78cdd9fd'
  ],
  'Beads': [
    'photo-1536924430914-71f986214530',
    'photo-1622396481328-9b1b78cdd9fd'
  ],
  'Bases': [
    'photo-1547949003-9792a18a2601',
    'photo-1622396481328-9b1b78cdd9fd'
  ],
  'Purse Accessories': [
    'photo-1547949003-9792a18a2601',
    'photo-1622396481328-9b1b78cdd9fd'
  ],
  'Purse Handles': [
    'photo-1547949003-9792a18a2601',
    'photo-1622396481328-9b1b78cdd9fd'
  ]
};

async function downloadImage(photoId, outputPath) {
  const url = `https://images.unsplash.com/${photoId}?w=800&auto=format&fit=crop&q=80`;
  
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
    return true;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Convert and resize with sharp
      await sharp(buffer)
        .resize(800, 800, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      return true;
    } catch (e) {
      console.error(`  Error downloading ${photoId} (attempt ${attempt}):`, e.message);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  return false;
}

async function tintImage(inputPath, outputPath, hexColor) {
  try {
    // 1. Load image
    // 2. Convert to greyscale to strip original color
    // 3. Tint it with target color
    // 4. Output to file
    await sharp(inputPath)
      .greyscale()
      .tint(hexColor)
      .webp({ quality: 80 })
      .toFile(outputPath);
    return true;
  } catch (e) {
    console.error(`  Error tinting ${inputPath} to ${hexColor}:`, e.message);
    return false;
  }
}

async function main() {
  console.log('--- Starting Local High-Quality Asset Generation ---');
  let downloadedCount = 0;
  let tintedCount = 0;

  for (const product of featuredProducts) {
    const slug = product.slug;
    const productDir = path.join(destDir, slug);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    console.log(`\nProcessing product: ${product.name} (${slug})`);

    // 1. Hero/Primary Image
    const heroPath = path.join(productDir, 'hero.webp');
    const photoId = productUnsplashMap[slug] || 'photo-1596461404969-9ae70f2830c1';
    console.log(`- Downloading Hero image (${photoId})`);
    const heroSuccess = await downloadImage(photoId, heroPath);
    if (heroSuccess) downloadedCount++;

    // 2. Gallery Images
    const categoryGals = categoryGalleryMap[product.category] || ['photo-1606744824163-985d376605aa', 'photo-1517841905240-472988babdf9'];
    
    const gal1Path = path.join(productDir, 'gallery-1.webp');
    console.log(`- Downloading Gallery 1 (${categoryGals[0]})`);
    const gal1Success = await downloadImage(categoryGals[0], gal1Path);
    if (gal1Success) downloadedCount++;

    const gal2Path = path.join(productDir, 'gallery-2.webp');
    console.log(`- Downloading Gallery 2 (${categoryGals[1]})`);
    const gal2Success = await downloadImage(categoryGals[1], gal2Path);
    if (gal2Success) downloadedCount++;

    // 3. Tint Shade Variant Images
    if (product.colors && product.colors.length > 0 && fs.existsSync(heroPath)) {
      console.log(`- Tinting ${product.colors.length} color shades locally`);
      for (const color of product.colors) {
        const colorSlug = color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const colorPath = path.join(productDir, `color-${colorSlug}.webp`);
        
        // Skip if already exists
        if (fs.existsSync(colorPath) && fs.statSync(colorPath).size > 0) {
          continue;
        }

        const tintSuccess = await tintImage(heroPath, colorPath, color.hex);
        if (tintSuccess) tintedCount++;
      }
    }
  }

  console.log(`\n--- Asset Generation Complete ---`);
  console.log(`- Downloaded & Optimized base assets: ${downloadedCount}`);
  console.log(`- Local color-tints created:          ${tintedCount}`);
}

main().catch(e => {
  console.error('Fatal error in generator:', e);
  process.exit(1);
});
