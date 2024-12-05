const {getFirebaseData} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const sendTelegramMessageOrUnsubscribe = require('./sendTelegramMessageOrUnsubscribe');

const sendDigest = async (collectMessages, buffer) => {
  if (process.env.NODE_ENV === 'production') {
    const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

    await Promise.all(
      Object.keys(chatsID).map((chatID) =>
        sendTelegramMessageOrUnsubscribe({chatID, message: collectMessages, buffer}),
      ),
    );
  } else {
    await sendTelegramMessageOrUnsubscribe({
      chatID: process.env.TELEGRAM_CHAT_ID,
      message: collectMessages,
      buffer,
    });
  }
};

module.exports = sendDigest;
