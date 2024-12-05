const bot = require('../configs/telegramConfig');
const {
  handlePrivateChatSubscription,
  handlePublicChatSubscription,
  handlePublicChatUnsubscription,
} = require('../utils/telegramBotSubscriptionHandler');
const {updateFirebaseRecord, removeFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');
const {BOT_PRIVATE_SUBSCRIPTION, BOT_CHANNEL_SUBSCRIPTION} = require('../configs/messanges');

function setupBotCommandsService() {
  bot.onText(/\/start/, async (msg) => {
    if (handlePrivateChatSubscription(msg)) {
      const chatId = msg.chat.id;

      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.username || '',
        type: 'private',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`, subscribedChanelInfo);

      bot.sendMessage(chatId, BOT_PRIVATE_SUBSCRIPTION);
    }
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (handlePublicChatSubscription(msg)) {
      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.title || '',
        type: 'group',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`, subscribedChanelInfo);

      bot.sendMessage(chatId, BOT_CHANNEL_SUBSCRIPTION);
    }

    if (handlePublicChatUnsubscription(msg)) {
      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`);
    }
  });
}

module.exports = setupBotCommandsService;
