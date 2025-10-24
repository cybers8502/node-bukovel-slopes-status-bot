require('dotenv').config({path: `.env.${process.env.NODE_ENV}`});
const mtProtoAuthorize = require('../app/services/mtProtoAuthorize');

mtProtoAuthorize().catch((e) => {
  console.error('Auth error:', e);
  process.exit(1);
});
