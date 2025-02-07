require('dotenv').config();
const cron = require('node-cron');
const logger = require('./app/utils/logger');
const compareAndSendMessage = require('./app/modules/compareAndSendMessage');
const setupBotCommandsService = require('./app/modules/setupBotCommands');
const mtprotoCheckAndSendNews = require('./app/modules/mtprotoCheckAndSendNews');
const bukovelWebSiteNewsParser = require('./app/modules/bukovelWebSiteNewsParser');

const digest = async () => {
  try {
    logger.info('Running digest...');
    await compareAndSendMessage();
    await mtprotoCheckAndSendNews();
    // await bukovelWebSiteNewsParser();
    logger.info('Digest completed successfully.');
  } catch (error) {
    logger.error(`Digest failed: ${error.message}`);
  }
};

cron.schedule('0 * * * *', digest);

digest();
setupBotCommandsService();
