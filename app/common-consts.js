const SLOPES_STATUS_URL = 'https://bukovel.com/api/v1/ski/map/trails/lifts/';
const MAP_URL = 'https://bukovel.com/map-new/?lang=uk&from-site=true';
const DB_ROOT = process.env.NODE_ENV === 'production' ? '/bukovel/' : '/bukovel-test/';
const CRON_JOB_SCHEDULE = '0 6 * * *';

module.exports = {SLOPES_STATUS_URL, MAP_URL, DB_ROOT, CRON_JOB_SCHEDULE};
