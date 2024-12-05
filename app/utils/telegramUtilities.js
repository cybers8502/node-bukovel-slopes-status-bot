const bot = require('../configs/telegramConfig');

async function sendTelegramMessage(chatID, message) {
  await bot.sendMessage(chatID, message, {parse_mode: 'HTML'});
}

async function sendTelegramPhoto(chatID, buffer) {
  await bot.sendPhoto(chatID, buffer);
}

module.exports = {sendTelegramMessage, sendTelegramPhoto};
