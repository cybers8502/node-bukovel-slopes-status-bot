require('dotenv').config();
const cron = require('node-cron');
const {CRON_JOB_SCHEDULE} = require('./app/common-consts');
const {compareAndSendMessage} = require('./app/modules/compareAndSendMessage');
const {setupBotCommandsService} = require('./app/modules/setupBotCommands');

cron.schedule(CRON_JOB_SCHEDULE, compareAndSendMessage);

compareAndSendMessage();
setupBotCommandsService();
