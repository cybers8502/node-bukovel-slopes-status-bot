const path = require('path');
const MTProto = require('@mtproto/core');

const config = {
  api_id: process.env.TELEGRAM_MTPROTO_API_ID,
  api_hash: process.env.TELEGRAM_MTPROTO_API_HASH,
  storageOptions: {
    path: path.resolve(process.cwd(), 'mtprotoSession.json'),
  },
};

const mtproto = new MTProto(config);

module.exports = mtproto;
