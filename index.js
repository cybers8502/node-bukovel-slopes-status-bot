require('dotenv').config();
const cron = require('node-cron');
const compareAndSendMessage = require('./app/modules/compareAndSendMessage');
const setupBotCommandsService = require('./app/modules/setupBotCommands');
const mtprotoCheckAndSendNews = require('./app/modules/mtprotoCheckAndSendNews');
const bukovelWebSiteNewsParser = require('./app/modules/bukovelWebSiteNewsParser');

const digest = async () => {
  await compareAndSendMessage();
  await mtprotoCheckAndSendNews();
  await bukovelWebSiteNewsParser();
};

cron.schedule('0 6 * * *', digest);
cron.schedule('0 8 * * *', compareAndSendMessage);
cron.schedule('0 10 * * *', digest);
cron.schedule('0 20 * * *', digest);
cron.schedule('0 16 * * *', digest);
cron.schedule('0 22 * * *', digest);

digest();
setupBotCommandsService();
