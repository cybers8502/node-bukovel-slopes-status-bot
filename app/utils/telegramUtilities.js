const {bot} = require('../configs/telegramConfig');

async function sendTelegramMessage(chatID, message) {
  await bot.api.sendMessage(chatID, message, {parse_mode: 'HTML'});
}

async function sendTelegramPhoto(chatID, buffer) {
  await bot.api.sendPhoto(chatID, buffer);
}

module.exports = {sendTelegramMessage, sendTelegramPhoto};
