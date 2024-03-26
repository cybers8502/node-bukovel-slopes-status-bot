const puppeteer = require('puppeteer');
const {sendTelegramMessage} = require('./sendTelegramMessageService');
async function takeWebpageScreenshotService({url, selector, customCSS, customViewport}) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  const startTime = new Date().getTime();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['stylesheet', 'font'].includes(request.resourceType())) {
      request.abort();
    } else {
      request.continue();
    }
  });

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
  const endTime = new Date().getTime();

  const loadTime = endTime - startTime;
  await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, `Час завантаження сторінки: ${loadTime} мс`);

  return screenshotBuffer;
}

module.exports = {takeWebpageScreenshotService};
