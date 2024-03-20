const SLOPES_STATUS_URL = 'https://bukovel.com/api/v1/ski/map/trails/lifts/';
const MAP_URL = 'https://bukovel.com/map-new/?lang=uk&from-site=true';
const DB_ROOT = process.env.NODE_ENV === 'production' ? '/bukovel/' : '/bukovel-test/';
const CRON_JOB_MORNING_SCHEDULE = '0 6 * * *';
const CRON_JOB_MIDDAY_SCHEDULE = '0 10 * * *';
const CRON_JOB_EVENING_SCHEDULE = '0 20 * * *';

module.exports = {
  SLOPES_STATUS_URL,
  MAP_URL,
  DB_ROOT,
  CRON_JOB_MORNING_SCHEDULE,
  CRON_JOB_MIDDAY_SCHEDULE,
  CRON_JOB_EVENING_SCHEDULE,
};
