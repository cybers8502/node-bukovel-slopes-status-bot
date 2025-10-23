require('dotenv').config();
const puppeteer = require('puppeteer');
const {NEWS_URL, DB_ROOT} = require('../configs/consts');
const errorInform = require('../services/errorInform');
const {getFirebaseData, updateFirebaseRecord} = require('../utils/firebaseUtilities');
const sendDigest = require('../services/sendDigest');
const logger = require('../utils/logger');

const bukovelWebSiteNewsParser = async () => {
  try {
    const newsLastDate = (await getFirebaseData(`${DB_ROOT}news/newsSiteLastDate`)) || 0;
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
      ],
      userDataDir: '/tmp/puppeteer',
    });
    const page = await browser.newPage();

    await page.goto(NEWS_URL, {waitUntil: 'domcontentloaded'});

    await page.waitForSelector('div[class^="List_list-container"]');

    const news = await page.evaluate(async () => {
      const container = document.querySelector('ul[class^="List_list"]');
      if (!container) return [];

      return Array.from(container.querySelectorAll('li')).map((newsItem) => {
        const dateSpan = newsItem.querySelector('span.app-text');
        const date = dateSpan ? dateSpan.textContent.trim() : 'Дата відсутня';
        const title = newsItem.querySelector('h3')?.textContent.trim() || 'Заголовок відсутній';
        const link = newsItem.querySelector('a')?.href || 'Посилання відсутнє';

        return {date, title, link};
      });
    });

    await browser.close();

    const filteredNews = [];
    for (let i = 0; i < news.length; i++) {
      if (news[i].date === newsLastDate) {
        break;
      }
      filteredNews.push(news[i]);
    }

    if (filteredNews.length > 0) {
      await updateFirebaseRecord(`${DB_ROOT}news/newsSiteLastDate`, filteredNews[0].date);
      const htmlNews = filteredNews.map((item) => `<a href='${item.link}'>${item.title}</a>`);
      logger.info(`<b>Останні новини з вебсайту:</b> \n\n ${htmlNews.join('\n\n')}`);
      // await sendDigest(`<b>Останні новини з вебсайту:</b> \n\n ${htmlNews.join('\n\n')}`);
    }
  } catch (error) {
    await errorInform({message: `Помилка при парсингу новин: ${error.message}`});
  }
};

module.exports = bukovelWebSiteNewsParser;
