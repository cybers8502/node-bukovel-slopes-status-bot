const {sendTelegramMessage, sendTelegramPhoto} = require('../utils/telegramUtilities');
const {removeFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const logger = require('../utils/logger');
const {bot} = require('../configs/telegramConfig');

const sendTelegramMessageOrUnsubscribe = async ({chatID, message, buffer}) => {
  console.log('sendTelegramMessageOrUnsubscribe message: ', message);
  console.log('sendTelegramMessageOrUnsubscribe buffer: ', buffer);

  try {
    await sendTelegramMessage(chatID, message);
    buffer && (await sendTelegramPhoto(chatID, buffer));
  } catch (error) {
    logger.error(`Error sendTelegramMessageOrUnsubscribe: ${error}`);
    await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
  }
};

module.exports = sendTelegramMessageOrUnsubscribe;
