const {getFirebaseData} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const sendTelegramMessageOrUnsubscribe = require('./sendTelegramMessageOrUnsubscribe');
const logger = require('../utils/logger');

const sendDigest = async (collectMessages, buffer) => {
  logger.info('sendDigest is starting...');
  const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

  await Promise.all(
    Object.keys(chatsID).map((chatID) =>
      sendTelegramMessageOrUnsubscribe({chatID, message: collectMessages, buffer}),
    ),
  );
  logger.info('sendDigest is finished!');
};

module.exports = sendDigest;
