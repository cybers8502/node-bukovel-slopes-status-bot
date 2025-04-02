require('dotenv').config();
const logger = require('../utils/logger');
const {sendTelegramMessage} = require('../utils/telegramUtilities');

const errorInform = async ({message}) => {
  logger.error(`Error Inform: ${message}`);

  if (process.env.NODE_ENV === 'production') {
    if (!message) {
      await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, 'Error: message is undefined or empty.');
      return;
    }

    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, message);
  } else {
    console.warn('Error Inform is in development mod. Error: ', message);
  }
};

module.exports = errorInform;
