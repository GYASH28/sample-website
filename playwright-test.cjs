const { chromium } = require('playwright');

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
    await page.goto('http://127.0.0.1:4173/');
    await page.waitForTimeout(2000);
    const html = await page.content();
    const rootLength = await page.evaluate(() => document.getElementById('root').innerHTML.length);
    console.log("Root content length in real browser:", rootLength);
    if (rootLength === 0) {
      console.log("PAGE IS BLANK");
    }
  } catch (err) {
    console.error("Test failed", err);
  } finally {
    await browser.close();
  }
})();
