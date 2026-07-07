import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const sourceDir = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\f3969e90-4377-429a-ac03-b9d81ec885f3';
const destDir = 'C:\\Users\\Admin\\Desktop\\projects\\sample website\\public\\assets\\images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'));

async function optimizeImages() {
  for (const file of files) {
    if (!file.startsWith('hero_') && !file.startsWith('cat_') && !file.startsWith('base_')) continue;
    
    // We want to extract the base name before the timestamp
    // e.g. cat_bliss_1781508615068.png -> cat_bliss.webp
    const baseNameMatch = file.match(/^(hero_banner|cat_[a-z_]+|base_[a-z0-9_]+)_\d+\.png$/);
    if (!baseNameMatch) continue;
    
    const outputName = `${baseNameMatch[1]}.webp`;
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(destDir, outputName);

    try {
      // Resize to a sensible web dimension and convert to webp
      await sharp(inputPath)
        .resize({ width: baseNameMatch[1] === 'hero_banner' ? 1600 : 800, withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);
      console.log(`Optimized: ${outputName}`);
    } catch (err) {
      console.error(`Failed to optimize ${file}:`, err);
    }
  }
}

optimizeImages().then(() => console.log('Optimization complete.'));
