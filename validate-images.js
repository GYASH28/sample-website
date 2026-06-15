import fs from 'fs';
import path from 'path';
import { featuredProducts } from './src/data/siteData.js';

const destDir = path.join('public', 'assets', 'images', 'products');

function validate() {
  console.log('--- Fakhri Mart Image Coverage Audit ---');
  let totalRequired = 0;
  let totalMissing = 0;
  let totalFound = 0;
  const missingReport = [];

  for (const product of featuredProducts) {
    const productSlug = product.slug;
    const productDir = path.join(destDir, productSlug);
    const productMissing = [];

    // Check directory
    if (!fs.existsSync(productDir)) {
      productMissing.push('directory');
      totalMissing += 3 + (product.colors?.length || 0);
      totalRequired += 3 + (product.colors?.length || 0);
      missingReport.push({ name: product.name, slug: productSlug, missing: ['Entire directory missing'] });
      continue;
    }

    // Helper check
    const checkFile = (filename) => {
      totalRequired++;
      const filepath = path.join(productDir, filename);
      if (!fs.existsSync(filepath)) {
        productMissing.push(filename);
        totalMissing++;
        return false;
      }
      
      const stats = fs.statSync(filepath);
      if (stats.size === 0) {
        productMissing.push(`${filename} (empty)`);
        totalMissing++;
        return false;
      }
      
      totalFound++;
      return true;
    };

    // Check hero
    checkFile('hero.webp');

    // Check gallery
    checkFile('gallery-1.webp');
    checkFile('gallery-2.webp');

    // Check colors
    if (product.colors && product.colors.length > 0) {
      for (const color of product.colors) {
        const colorSlug = color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        checkFile(`color-${colorSlug}.webp`);
      }
    }

    if (productMissing.length > 0) {
      missingReport.push({ name: product.name, slug: productSlug, missing: productMissing });
    }
  }

  const coveragePercent = totalRequired > 0 ? ((totalFound / totalRequired) * 100).toFixed(1) : 0;
  console.log(`\nAudit Summary:`);
  console.log(`- Total Required Assets: ${totalRequired}`);
  console.log(`- Found Assets:          ${totalFound}`);
  console.log(`- Missing/Empty Assets:  ${totalMissing}`);
  console.log(`- Coverage Completeness: ${coveragePercent}%`);

  if (missingReport.length > 0) {
    console.log(`\nMissing Assets Breakdown:`);
    missingReport.forEach(p => {
      console.log(`\n[${p.name} (${p.slug})]:`);
      p.missing.forEach(m => console.log(`  - Missing: ${m}`));
    });
  } else {
    console.log(`\n🎉 Success! 100% Image coverage achieved for all products!`);
  }

  // Write simple report to file
  const reportPath = path.join('public', 'image-coverage-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalRequired,
    totalFound,
    totalMissing,
    coveragePercent: parseFloat(coveragePercent),
    missingReport
  }, null, 2));
  console.log(`\nWritten JSON report to ${reportPath}`);
}

validate();
