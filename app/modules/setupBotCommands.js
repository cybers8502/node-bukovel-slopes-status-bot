const {bot} = require('../configs/telegramConfig');
const {
  handlePrivateChatSubscription,
  handlePublicChatSubscription,
  handlePublicChatUnsubscription,
} = require('../services/botSubscribeService');
const {updateFirebaseRecord, removeFirebaseRecord} = require('../services/firebaseService');
const {DB_ROOT} = require('../common-consts');

function setupBotCommandsService() {
  bot.onText(/\/start/, async (msg) => {
    if (handlePrivateChatSubscription(msg)) {
      const chatId = msg.chat.id;

      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.username,
        type: 'private',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`, subscribedChanelInfo);

      bot.sendMessage(chatId, `Підписано`);
    }
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    if (handlePublicChatSubscription(msg)) {
      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.title,
        type: 'group',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`, subscribedChanelInfo);

      bot.sendMessage(chatId, `Підписано`);
    }
    if (handlePublicChatUnsubscription(msg)) {
      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`);
    }
  });
}

module.exports = {setupBotCommandsService};
