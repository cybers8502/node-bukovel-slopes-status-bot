const SLOPES_STATUS_URL = 'https://bukovel.com/api/v1/ski/map/trails/lifts/';
const MAP_URL = 'https://bukovel.com/map-new/?lang=uk&from-site=true';
const NEWS_URL = 'https://bukovel.com/news';
const DB_ROOT = process.env.NODE_ENV === 'production' ? '/bukovel/' : '/bukovel-test/';

module.exports = {
  SLOPES_STATUS_URL,
  MAP_URL,
  NEWS_URL,
  DB_ROOT,
};
