// audit-click-through.js
// Part B live audit: visit every route, click every button/link, capture console errors + dead links.

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const errors = [];
  const deadLinks = [];
  const brokenRoutes = [];

  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`);
  });

  // 1. Visit every route defined in App.jsx
  const routes = [
    '/', '/products', '/gallery', '/about', '/contact', '/enquiry', '/wishlist',
    '/yarn-calculator', '/blog',
    '/products/makhhi-thread', '/products/single-macrame-cord', '/products/purse-handles',
    '/blog/how-to-choose-yarn-weight',
    '/nonexistent-route-test-404'
  ];

  console.log('=== Route visit audit ===');
  for (const route of routes) {
    const response = await page.goto('http://127.0.0.1:4173' + route, { waitUntil: 'networkidle', timeout: 15000 }).catch(e => null);
    if (!response) {
      brokenRoutes.push(`✗ ${route} — no response`);
      console.log(`  ✗ ${route} — no response`);
      continue;
    }
    const status = response.status();
    const rootLen = await page.evaluate(() => document.getElementById('root')?.innerHTML.length || 0);
    if (status >= 400 && route !== '/nonexistent-route-test-404') {
      brokenRoutes.push(`✗ ${route} — HTTP ${status}`);
      console.log(`  ✗ ${route} — HTTP ${status}, root=${rootLen}`);
    } else {
      console.log(`  ✓ ${route.padEnd(45)} HTTP ${status}, root=${rootLen}`);
    }
  }

  // 2. On each main page, extract all internal links and verify they point at valid routes
  console.log('\n=== Internal link audit ===');
  const validRoutes = new Set(routes.filter(r => r !== '/nonexistent-route-test-404'));
  const pagesToCheck = ['/', '/products', '/gallery', '/about', '/contact', '/blog'];
  const allLinks = new Set();
  for (const route of pagesToCheck) {
    await page.goto('http://127.0.0.1:4173' + route, { waitUntil: 'networkidle' });
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
    });
    for (const href of links) {
      if (href && (href.startsWith('/') || href.startsWith('http://127.0.0.1:4173'))) {
        const path = href.startsWith('/') ? href : new URL(href).pathname;
        // Normalize: strip query/hash, keep only path
        const cleanPath = path.split('?')[0].split('#')[0];
        // For product/blog detail links, the slug varies — just check the prefix
        const isProductLink = cleanPath.startsWith('/products/');
        const isBlogLink = cleanPath.startsWith('/blog/');
        const isKnownRoute = validRoutes.has(cleanPath);
        if (!isKnownRoute && !isProductLink && !isBlogLink && cleanPath !== '/') {
          deadLinks.push(`${route} → ${href} (path: ${cleanPath})`);
        }
        allLinks.add(cleanPath);
      }
    }
  }
  if (deadLinks.length === 0) {
    console.log('  ✓ All internal links point at valid routes or product/blog detail slugs');
  } else {
    console.log(`  ✗ ${deadLinks.length} dead links found:`);
    deadLinks.slice(0, 10).forEach(l => console.log(`    ${l}`));
  }

  // 3. Click-through test on Products page — cycle through departments + filters
  console.log('\n=== Products page click-through ===');
  await page.goto('http://127.0.0.1:4173/products', { waitUntil: 'networkidle' });
  const deptTabs = await page.$$('.department-tab');
  console.log(`  Found ${deptTabs.length} department tabs`);
  for (let i = 0; i < deptTabs.length; i++) {
    await deptTabs[i].click();
    await page.waitForTimeout(200);
    const productCount = await page.locator('.product-card').count();
    console.log(`    ✓ Tab ${i}: ${productCount} products shown`);
  }
  // Test search
  await page.fill('input[type="search"]', 'yarn');
  await page.waitForTimeout(300);
  const searchCount = await page.locator('.product-card').count();
  console.log(`  ✓ Search 'yarn': ${searchCount} results`);
  await page.fill('input[type="search"]', '');

  // 4. Test Yarn Calculator flow
  console.log('\n=== Yarn Calculator click-through ===');
  await page.goto('http://127.0.0.1:4173/yarn-calculator', { waitUntil: 'networkidle' });
  const projectCards = await page.$$('button[aria-pressed]');
  console.log(`  Found ${projectCards.length} project buttons`);
  if (projectCards.length > 0) {
    await projectCards[0].click();
    await page.waitForTimeout(200);
    const sizeButtons = await page.$$('button[aria-pressed]');
    // After clicking a project, size buttons appear
    if (sizeButtons.length > projectCards.length) {
      await sizeButtons[projectCards.length].click(); // first size button
      await page.waitForTimeout(200);
      const estimate = await page.$('.yarn-calc-result, [class*="estimate"]');
      console.log(`  ✓ Project + size selected, estimate shown: ${estimate ? 'yes' : 'no'}`);
    }
  }

  // 5. Test ProductDetail interactions
  console.log('\n=== ProductDetail click-through ===');
  await page.goto('http://127.0.0.1:4173/products/makhhi-thread', { waitUntil: 'networkidle' });
  // Color swatches
  const swatches = await page.$$('.swatch-btn');
  console.log(`  Found ${swatches.length} color swatches (ColorSwatchPicker)`);
  if (swatches.length > 0) await swatches[0].click();
  // Quantity presets
  const qtyPresets = await page.$$('.quantity-preset');
  console.log(`  Found ${qtyPresets.length} quantity presets (QuantitySelector)`);
  if (qtyPresets.length > 0) await qtyPresets[0].click();
  // Lightbox
  const heroImg = await page.$('.product-image-container');
  if (heroImg) {
    await heroImg.click();
    await page.waitForTimeout(300);
    const lightbox = await page.$('.lightbox-backdrop');
    console.log(`  ✓ Lightbox opens on image click: ${lightbox ? 'yes' : 'no'}`);
    if (lightbox) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    }
  }
  // StickyBreadcrumb visible after scroll
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(200);
  const breadcrumb = await page.$('.sticky-breadcrumb');
  console.log(`  ✓ StickyBreadcrumb renders: ${breadcrumb ? 'yes' : 'no'}`);

  // 6. Check for stacked backdrop-filter elements in viewport (perf audit)
  console.log('\n=== Stacked backdrop-filter audit ===');
  await page.goto('http://127.0.0.1:4173/products/makhhi-thread', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollTo(0, 400));
  await page.waitForTimeout(300);
  const blurCount = await page.evaluate(() => {
    let count = 0;
    document.querySelectorAll('*').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const cs = getComputedStyle(el);
      if ((cs.backdropFilter && cs.backdropFilter !== 'none') ||
          (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none') ||
          (cs.filter && cs.filter.includes('blur'))) {
        count++;
      }
    });
    return count;
  });
  console.log(`  ${blurCount} elements with blur/backdrop-filter visible in viewport after scroll`);

  await browser.close();

  console.log('\n=== Summary ===');
  console.log(`  Broken routes: ${brokenRoutes.length}`);
  console.log(`  Dead internal links: ${deadLinks.length}`);
  console.log(`  Console errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\n  Console errors:');
    errors.slice(0, 15).forEach(e => console.log(`    ${e}`));
  }
  process.exit(errors.length + brokenRoutes.length + deadLinks.length > 0 ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
