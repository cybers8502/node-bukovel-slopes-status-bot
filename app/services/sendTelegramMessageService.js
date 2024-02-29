const axios = require('axios');
const telegramToken = process.env.TELEGRAM_TOKEN;
async function sendTelegramMessage(chatID, message) {
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const params = {
    chat_id: chatID,
    text: message,
  };

  try {
    await axios.post(url, params);
  } catch (e) {
    throw new Error('Failed to send Telegram message');
  }
}

module.exports = {sendTelegramMessage};
