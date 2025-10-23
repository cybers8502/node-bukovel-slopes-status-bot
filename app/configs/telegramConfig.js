const { Bot, webhookCallback } = require('grammy');

const token = process.env.TELEGRAM_TOKEN;
if (!token) throw new Error('TELEGRAM_BOT_TOKEN env is required');

const bot = new Bot(token);

bot.catch((err) => {
  console.error('grammY error:', err.error || err);
});

// Middleware для різних фреймворків (Express/Fastify)
function getWebhookMiddleware(framework = 'express', secretToken) {
  return webhookCallback(bot, framework, { secretToken });
}

async function startPolling() {
  await bot.start();
  console.log('Bot started in polling mode');
}

module.exports = { bot, getWebhookMiddleware, startPolling };
