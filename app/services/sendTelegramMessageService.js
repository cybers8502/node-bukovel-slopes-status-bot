const axios = require('axios');

const telegramToken = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  const params = {
    chat_id: chatId,
    text: message,
  };

  try {
    await axios.post(url, params);
  } catch (error) {
    console.error('Помилка:', error);
  }
}

module.exports = {sendTelegramMessage};
