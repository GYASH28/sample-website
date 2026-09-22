const { chromium } = require('playwright');
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:4173';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`BROWSER CONSOLE [${msg.type()}]: ${msg.text()}`);
  });
  
  page.on('pageerror', error => {
    console.log(`BROWSER ERROR: ${error.message}`);
  });

  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForTimeout(2000);
    const rootLength = await page.evaluate(() => document.getElementById('root').innerHTML.length);
    console.log("Root content length in real browser:", rootLength);
    if (rootLength === 0) {
      throw new Error("PAGE IS BLANK");
    }
  } catch (err) {
    console.error("Test failed", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
