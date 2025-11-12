const {sendTelegramMessage, sendTelegramPhoto} = require('../utils/telegramUtilities');
const {removeFirebaseRecord, updateFirebaseRecord} = require('../utils/firebaseUtilities');
const {DB_ROOT} = require('../configs/consts');

const sendTelegramMessageOrUnsubscribe = async ({chatID, message, buffer}) => {
  try {
    await sendTelegramMessage(chatID, message);
    buffer && (await sendTelegramPhoto(chatID, buffer));
  } catch (error) {
    if (err instanceof GrammyError && err.parameters?.migrate_to_chat_id) {
      const newId = err.parameters.migrate_to_chat_id;

      const subscribedChanelInfo = {
        id: chatId,
        name: msg.chat.username || '',
        type: 'private',
        subscribed: new Date(),
      };

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${newId}`, {id: newId});
      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
      return;
    }

    await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
  }
};

module.exports = sendTelegramMessageOrUnsubscribe;
