const {bot} = require('../configs/telegramConfig');
const telegramToken = process.env.TELEGRAM_TOKEN;
async function sendTelegramMessage(chatID, message) {
  await bot.sendMessage(chatID, message);
}
async function sendTelegramPhoto(chatID, buffer) {
  await bot.sendPhoto(chatID, buffer);
}

module.exports = {sendTelegramMessage, sendTelegramPhoto};
