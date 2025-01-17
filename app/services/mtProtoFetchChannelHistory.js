const mtproto = require('../configs/mtProtoConfig');
const errorInform = require('./errorInform');
const logger = require('../utils/logger');

async function mtProtoFetchChannelHistory({channelName, messagesLimit = 1}) {
  try {
    logger.info('Starting mtProtoFetchChannelHistory...');
    const channel = await mtproto.call('contacts.resolveUsername', {
      username: channelName,
    });

    const channelId = channel.chats[0].id;
    const accessHash = channel.chats[0].access_hash;

    return await mtproto.call('messages.getHistory', {
      peer: {
        _: 'inputPeerChannel',
        channel_id: channelId,
        access_hash: accessHash,
      },
      limit: messagesLimit,
    });
  } catch (error) {
    await errorInform(`Error mtProtoFetchChannelHistory: ${error}`);
  }
}

module.exports = mtProtoFetchChannelHistory;
