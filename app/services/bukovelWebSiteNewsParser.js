const puppeteer = require('puppeteer');
const {NEWS_URL} = require('../configs/consts');

const bukovelWebSiteNewsParser = async () => {
  try {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(NEWS_URL, {waitUntil: 'domcontentloaded'});

    await page.waitForSelector('div[class^="List_list-container"]');

    const news = await page.evaluate(() => {
      const container = document.querySelector('ul[class^="List_list"]');
      if (!container) return [];

      const newsItems = Array.from(container.querySelectorAll('li'));

      return newsItems.map((newsItem) => {
        const dateSpan = newsItem.querySelector('span.app-text');
        const date = dateSpan ? dateSpan.textContent.trim() : 'Дата відсутня';
        const title = newsItem.querySelector('h3')?.textContent.trim() || 'Заголовок відсутній';
        const link = newsItem.querySelector('a')?.href || 'Посилання відсутнє';

        return {date, title, link};
      });
    });

    await browser.close();

    console.log('Останні новини:', news);
    return news;
  } catch (error) {
    console.error('Помилка при парсингу новин:', error.message);
  }
};

module.exports = {parseBukovelNews: bukovelWebSiteNewsParser};

bukovelWebSiteNewsParser();
