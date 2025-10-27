const {getFirebaseData} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const sendTelegramMessageOrUnsubscribe = require('./sendTelegramMessageOrUnsubscribe');
const logger = require('../utils/logger');

const sendDigest = async (collectMessages, buffer) => {
  const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

  console.log('sendDigest buffer ', buffer);
  console.log('sendDigest chatsID ', chatsID);

  if (!chatsID || Object.keys(chatsID).length === 0) {
    throw new Error('No any chats ID found');
  }

  await Promise.all(
    Object.keys(chatsID).map((chatID) => {
      console.log('sendDigest chatID ', chatID);
      sendTelegramMessageOrUnsubscribe({chatID, message: collectMessages, buffer});
    }),
  );
};

module.exports = sendDigest;
