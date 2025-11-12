require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});
// const cron = require('node-cron');
const express = require('express');
const {webhookCallback} = require('grammy');
const logger = require('./app/utils/logger');
const {bot} = require('./app/configs/telegramConfig');
const compareAndSendMessage = require('./app/modules/compareAndSendMessage');
const setupBotCommandsService = require('./app/modules/setupBotCommands');
const mtprotoCheckAndSendNews = require('./app/modules/mtprotoCheckAndSendNews');
// const bukovelWebSiteNewsParser = require('./app/modules/bukovelWebSiteNewsParser');

const SECRET = process.env.SECRET;

const app = express();
app.use(express.json());

const digest = async () => {
  try {
    await compareAndSendMessage();
    await mtprotoCheckAndSendNews();
    // await bukovelWebSiteNewsParser();
    logger.info('Digest completed successfully.');
  } catch (error) {
    logger.error(`Digest failed: ${error.message}`);
  }
};

app.get('/', (_req, res) => res.status(200).send('Service is up'));

app.use(`/telegram/${process.env.TELEGRAM_TOKEN}`, webhookCallback(bot, 'express', {secretToken: SECRET}));

app.use((req, _res, next) => {
  if (req.path.startsWith('/telegram')) {
    logger.info(`Incoming ${req.method} ${req.path}`, {
      headers: {
        secret: req.header('x-telegram-bot-api-secret-token') ? 'present' : 'absent',
      },
    });
  }
  next();
});

app.use((err, _req, res, _next) => {
  logger.error('Express error:', err);
  res.status(500).send('Internal error');
});

app.get('/cron', async (req, res) => {
  const token = req.query.secret || req.headers['x-cron-secret'];
  if (token !== process.env.SECRET) return res.status(401).send('Unauthorized');

  try {
    await digest();
    res.status(200).send('OK');
  } catch (e) {
    res.status(500).send(e.message || 'Error');
  }
});

// ловимо помилки бота
bot.catch((err) => {
  logger.error('Grammy error:', err);
});

setupBotCommandsService();

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
