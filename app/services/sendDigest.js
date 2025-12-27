const { getFirebaseData } = require('../utils/firebaseUtilities');
const { DB_ROOT } = require('../configs/consts');
const sendTelegramMessageOrUnsubscribe = require('./sendTelegramMessageOrUnsubscribe');
const logger = require('../utils/logger');

const sendDigest = async (collectMessages, buffer) => {
  const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

  if (!chatsID || Object.keys(chatsID).length === 0) {
    throw new Error('No any chats ID found');
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const ids = Object.keys(chatsID);
  const CONCURRENCY = 5;
  const BATCH_DELAY_MS = 300;

  const results = [];

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY);

    const settled = await Promise.allSettled(
      chunk.map((chatID) =>
        sendTelegramMessageOrUnsubscribe({
          chatID,
          message: collectMessages,
          buffer,
        }),
      ),
    );

    results.push(...settled);

    if (i + CONCURRENCY < ids.length) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  const ok = results.filter((r) => r.status === 'fulfilled').length;
  const fail = results.filter((r) => r.status === 'rejected').length;
  logger.info('Broadcast done', { ok, fail, total: ids.length });
};

module.exports = sendDigest;
