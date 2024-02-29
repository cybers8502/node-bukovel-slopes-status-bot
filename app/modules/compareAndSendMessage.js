const {getExternalData} = require('../services/fetchSlopesDataService');
const {getFirebaseData, removeFirebaseRecord} = require('../services/firebaseService');
const {DB_ROOT, SLOPES_STATUS_URL} = require('../common-consts');
const {sendTelegramMessage} = require('../services/sendTelegramMessageService');
const {updateRecordAndPrepareMessage} = require('./updateRecordAndPrepareMessage');
const compareAndSendMessage = async () => {
  try {
    const externalData = await getExternalData();
    const firebaseData = await getFirebaseData(DB_ROOT);
    const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

    let collectMessages = '';

    for (const [key, track] of Object.entries(externalData.tracksData)) {
      if (track.date_modified !== firebaseData.tracksData[key]?.date_modified) {
        collectMessages +=
          (await updateRecordAndPrepareMessage('tracks', key, track, firebaseData.tracksData[key])) + '\n\n';
      }
    }

    for (const [key, lift] of Object.entries(externalData.liftsData)) {
      if (lift.date_modified !== firebaseData.liftsData[key]?.date_modified) {
        collectMessages +=
          (await updateRecordAndPrepareMessage('lifts', key, lift, firebaseData.liftsData[key])) + '\n\n';
      }
    }

    if (externalData.waitingTracksData.length > 0) {
      await sendTelegramMessage(
        process.env.TELEGRAM_CHAT_ID,
        `Оновлено waitingTracksData ${SLOPES_STATUS_URL}`,
      );
    }

    if (collectMessages) {
      const sendMessages = async (chatID) => {
        try {
          await sendTelegramMessage(chatID, collectMessages);
        } catch {
          await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
        }
      };

      if (process.env.NODE_ENV === 'production') {
        await Promise.all(Object.keys(chatsID).map(sendMessages));
      } else {
        await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, collectMessages);
      }
    }
  } catch (e) {
    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, `Error: ${e.message}`);
  }
};

module.exports = {compareAndSendMessage};
