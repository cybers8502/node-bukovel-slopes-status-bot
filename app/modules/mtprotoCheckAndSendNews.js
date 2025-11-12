require('dotenv').config();
const mtProtoFetchChannelHistory = require('../services/mtProtoFetchChannelHistory');
const mtProtoAuthorize = require('../services/mtProtoAuthorize');
const errorInform = require('../services/errorInform');
const {getFirebaseData, updateFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const sendDigest = require('../services/sendDigest');
const logger = require('../utils/logger');
const {hasText, isNewsRelevant} = require('../telegramNews/isNewsRelevant');

const CHANNEL = 'bukovel_resort';
const MESSAGES_LIMIT = 5;

const mtprotoCheckAndSendNews = async () => {
  try {
    await mtProtoAuthorize();

    const channelHistory = await mtProtoFetchChannelHistory({
      channelName: CHANNEL,
      messagesLimit: MESSAGES_LIMIT,
    });

    const newsLastDate = (await getFirebaseData(`${DB_ROOT}news/newsTelegramLastDate`)) || 0;

    const fresh = (channelHistory?.messages || []).filter((m) => Number(m?.date) > Number(newsLastDate));

    if (fresh.length === 0) return;

    const latestDate = Math.max(...fresh.map((m) => Number(m.date)));

    await updateFirebaseRecord(`${DB_ROOT}news/newsTelegramLastDate`, latestDate);

    const withText = fresh.filter(hasText);

    const passed = withText.map((m) => m.message.trim()).filter(isNewsRelevant);

    if (passed.length > 0) {
      await sendDigest(`<b>Останні новини з телеграму:</b>\n\n${passed.join('\n\n')}`);
    }
  } catch (error) {
    await errorInform({message: `Fetch Message Error: ${error.message || error}`});
  }
};

module.exports = mtprotoCheckAndSendNews;
