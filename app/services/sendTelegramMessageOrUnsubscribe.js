const {sendTelegramMessage, sendTelegramPhoto} = require('../utils/telegramUtilities');
const {removeFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const logger = require('../utils/logger');

const sendTelegramMessageOrUnsubscribe = async ({chatID, message, buffer}) => {
  try {
    logger.info('Starting sendTelegramMessageOrUnsubscribe...');

    await sendTelegramMessage(chatID, message);
    buffer && (await sendTelegramPhoto(chatID, buffer));

    logger.info('sendTelegramMessageOrUnsubscribe complete successfully.');
  } catch {
    await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
  }
};

module.exports = sendTelegramMessageOrUnsubscribe;
