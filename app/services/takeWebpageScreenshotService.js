const puppeteer = require('puppeteer');
async function takeWebpageScreenshotService({url, selector, customCSS, customViewport}) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  if (customViewport) {
    await page.setViewport({
      ...customViewport,
      deviceScaleFactor: 1,
    });
  }

  await page.goto(url);

  if (customCSS) {
    await page.addStyleTag({content: customCSS});
  }

  const element = await page.$(selector);
  const screenshotBuffer = await element.screenshot();

  await browser.close();

  return screenshotBuffer;
}

module.exports = {takeWebpageScreenshotService};
