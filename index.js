require('dotenv').config();
const cron = require('node-cron');
const {
  CRON_JOB_MORNING_SCHEDULE,
  CRON_JOB_MIDDAY_SCHEDULE,
  CRON_JOB_EVENING_SCHEDULE,
} = require('./app/common-consts');
const {compareAndSendMessage} = require('./app/modules/compareAndSendMessage');
const {setupBotCommandsService} = require('./app/modules/setupBotCommands');

cron.schedule(CRON_JOB_MORNING_SCHEDULE, compareAndSendMessage);
cron.schedule(CRON_JOB_MIDDAY_SCHEDULE, compareAndSendMessage);
cron.schedule(CRON_JOB_EVENING_SCHEDULE, compareAndSendMessage);

compareAndSendMessage();
setupBotCommandsService();
