const {sendTelegramMessage, sendTelegramPhoto} = require('../utils/telegramUtilities');
const {removeFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');

const sendTelegramMessageOrUnsubscribe = async ({chatID, message, buffer}) => {
  try {
    await sendTelegramMessage(chatID, message);
    buffer && (await sendTelegramPhoto(chatID, buffer));
  } catch {
    await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
  }
};

module.exports = sendTelegramMessageOrUnsubscribe;
