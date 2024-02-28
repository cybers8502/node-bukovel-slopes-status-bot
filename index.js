require('dotenv').config();
const cron = require('node-cron');
const {CRON_JOB_SCHEDULE} = require('./app/common-consts');
const {compareAndUpdate} = require('./app/services/compareDataService');

cron.schedule(CRON_JOB_SCHEDULE, compareAndUpdate);
