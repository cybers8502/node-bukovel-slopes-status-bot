const {
  sendTelegramMessage,
  sendTelegramPhoto,
} = require('../utils/telegramUtilities');
const {
  removeFirebaseRecord,
  updateFirebaseRecord,
} = require('../utils/firebaseUtilities');
const { DB_ROOT } = require('../configs/consts');

const sendTelegramMessageOrUnsubscribe = async ({
  chatID,
  message,
  buffer,
}) => {
  try {
    await sendTelegramMessage(chatID, message);
    buffer && (await sendTelegramPhoto(chatID, buffer));
  } catch (error) {
    // Лог, щоб бачити реальну причину
    console.error('Telegram send error:', error?.description || error);

    const migrateTo = error?.parameters?.migrate_to_chat_id;

    if (migrateTo) {
      console.warn(`Chat migrated ${chatID} → ${migrateTo}`);

      await updateFirebaseRecord(`${DB_ROOT}subscribedChanel/${migrateTo}`, {
        id: migrateTo,
      });

      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);

      return;
    }

    // якщо користувач заблокував бота / чат недоступний
    if (
      error?.error_code === 403 ||
      error?.description?.includes('bot was blocked') ||
      error?.description?.includes('chat not found')
    ) {
      await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
      return;
    }

    // інші помилки — просто лог, БЕЗ падіння сервера
    console.error('Unhandled telegram error:', error);
  }
};

module.exports = sendTelegramMessageOrUnsubscribe;
