const {bot} = require('../configs/telegramConfig');
const {InputFile} = require('grammy');

async function sendTelegramMessage(chatID, message) {
  await bot.api.sendMessage(chatID, message, {parse_mode: 'HTML'});
}

async function sendTelegramPhoto(chatID, buffer) {
  console.log('sendTelegramPhoto: ', buffer);
  await bot.api.sendPhoto(chatID, new InputFile(buffer));
}

module.exports = {sendTelegramMessage, sendTelegramPhoto};
