require('dotenv').config();
const mtProtoFetchChannelHistory = require('../services/mtProtoFetchChannelHistory');
const mtProtoAuthorize = require('../services/mtProtoAuthorize');
const errorInform = require('../services/errorInform');
const {getFirebaseData, updateFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const sendDigest = require('../services/sendDigest');
const logger = require('../utils/logger');

const mtprotoCheckAndSendNews = async () => {
  try {
    logger.info('Starting mtprotoCheckAndSendNews...');

    await mtProtoAuthorize();
    const channelHistory = await mtProtoFetchChannelHistory({
      channelName: 'bukovel_resort',
      messagesLimit: 1,
    });

    let messages = [];

    const newsLastDate = (await getFirebaseData(`${DB_ROOT}news/newsTelegramLastDate`)) || 0;

    const newMessages = channelHistory.messages;
    const filteredUnreadMessages = newMessages.filter((message) => {
      return message.date > newsLastDate;
    });

    if (filteredUnreadMessages.length > 0) {
      await updateFirebaseRecord(`${DB_ROOT}news/newsTelegramLastDate`, filteredUnreadMessages[0].date);

      messages = filteredUnreadMessages.map((message) => message.message);

      await sendDigest(`<b>Останні новини з телеграму:</b> \n\n ${messages.join('\n\n')}`);
    }

    logger.info('mtprotoCheckAndSendNews completed successfully.');
  } catch (error) {
    await errorInform({message: `Fetch Message Error: ${error.message || error}`});
  }
};

module.exports = mtprotoCheckAndSendNews;
