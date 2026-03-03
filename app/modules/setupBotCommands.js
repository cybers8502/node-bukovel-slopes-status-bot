const {
  handlePrivateChatSubscription,
  handlePublicChatSubscription,
  handlePublicChatUnsubscription,
} = require('../utils/telegramBotSubscriptionHandler');
const {
  updateFirebaseRecord,
  removeFirebaseRecord,
} = require('../utils/firebaseUtilities');
const { bot } = require('../configs/telegramConfig');
const { DB_ROOT } = require('../configs/consts');
const {
  BOT_PRIVATE_SUBSCRIPTION,
  BOT_CHANNEL_SUBSCRIPTION,
} = require('../configs/messanges');
const getSlopesStatus = require('../services/getSlopesStatus');

function setupBotCommandsService() {
  bot.api.setMyCommands([
    { command: 'start', description: 'Підписатися на сповіщення' },
    { command: 'slopes', description: 'Всі відкриті траси' },
    { command: 'red', description: '🔴 Відкриті червоні траси' },
    { command: 'black', description: '⚫ Відкриті чорні траси' },
    { command: 'blue', description: '🔵 Відкриті сині траси' },
  ]);

  bot.command('start', async (msg) => {
    if (handlePrivateChatSubscription(msg)) {
      const chatId = msg.chat.id;

      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.username || '',
        type: 'private',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(
        `${DB_ROOT}subscribedChanel/${chatId}`,
        subscribedChanelInfo,
      );

      bot.api.sendMessage(chatId, BOT_PRIVATE_SUBSCRIPTION);
    }
  });

  bot.command('slopes', async (msg) => {
    const chatId = msg.chat.id;
    const text = await getSlopesStatus();
    bot.api.sendMessage(chatId, text);
  });

  bot.command('red', async (msg) => {
    const chatId = msg.chat.id;
    const text = await getSlopesStatus('red');
    bot.api.sendMessage(chatId, text);
  });

  bot.command('black', async (msg) => {
    const chatId = msg.chat.id;
    const text = await getSlopesStatus('black');
    bot.api.sendMessage(chatId, text);
  });

  bot.command('blue', async (msg) => {
    const chatId = msg.chat.id;
    const text = await getSlopesStatus('blue');
    bot.api.sendMessage(chatId, text);
  });

  bot.on('message:text', async (msg) => {
    const chatId = msg.chat.id;

    if (handlePublicChatSubscription(msg)) {
      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.title || '',
        type: 'group',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(
        `${DB_ROOT}subscribedChanel/${chatId}`,
        subscribedChanelInfo,
      );

      bot.api.sendMessage(chatId, BOT_CHANNEL_SUBSCRIPTION);
    }

    if (handlePublicChatUnsubscription(msg)) {
      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatId}`);
    }
  });
}

module.exports = setupBotCommandsService;
