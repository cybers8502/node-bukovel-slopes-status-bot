const puppeteer = require('puppeteer');
const {NEWS_URL} = require('../common-consts');

const parseBukovelNews = async () => {
  const url = NEWS_URL;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('div[class^="List_list-container"]');

    const news = await page.evaluate(() => {
      const container = document.querySelector('div[class^="List_list-container"]');
      if (!container) return [];

      const newsItems = Array.from(container.querySelectorAll('li')).slice(0, 3);

      return newsItems.map(item => item.textContent.trim());
    });

    await browser.close();

    console.log('Останні новини:', news);
    return news;
  } catch (error) {
    console.error('Помилка при парсингу новин:', error.message);
  }
};

module.exports = {parseBukovelNews};

parseBukovelNews();
