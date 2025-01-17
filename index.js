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

cron.schedule('0 00 * * *', digest);
cron.schedule('0 6 * * *', digest);
cron.schedule('0 8 * * *', compareAndSendMessage);
cron.schedule('0 10 * * *', digest);
cron.schedule('0 15 * * *', digest);
cron.schedule('0 17 * * *', digest);
cron.schedule('0 20 * * *', digest);
cron.schedule('0 22 * * *', digest);

digest();
setupBotCommandsService();
