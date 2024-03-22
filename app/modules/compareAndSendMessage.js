const {DB_ROOT, MAP_URL} = require('../common-consts');
const {getExternalData} = require('../services/fetchSlopesDataService');
const {getFirebaseData, removeFirebaseRecord, updateFirebaseRecord} = require('../services/firebaseService');
const {sendTelegramMessage, sendTelegramPhoto} = require('../services/sendTelegramMessageService');
const {takeWebpageScreenshotService} = require('../services/takeWebpageScreenshotService');
const {updateRecordAndPrepareMessage} = require('./updateRecordAndPrepareMessage');
const {compareWaitingTracksData} = require('../modules/compareWaitingTracksData');

const customCSSForMapPage = `
  .react-transform-element {
    transform: scale(1)!important;
  }
  .legend, .map-controls {
    display: none!important;
  }`;
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

    if (collectMessages) {
      const buffer = await takeWebpageScreenshotService({
        url: MAP_URL,
        selector: '#mapObject',
        customCSS: customCSSForMapPage,
        customViewport: {width: 2865, height: 1648},
      });
      const sendMessages = async (chatID) => {
        try {
          await sendTelegramMessage(chatID, collectMessages);
          buffer && (await sendTelegramPhoto(chatID, buffer));
        } catch {
          await removeFirebaseRecord(`${DB_ROOT}subscribedChanel/${chatID}`);
        }
      };

      if (process.env.NODE_ENV === 'production') {
        await Promise.all(Object.keys(chatsID).map(sendMessages));
      } else {
        await sendMessages(process.env.TELEGRAM_CHAT_ID);
      }
    }
  } catch (e) {
    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, `Error: ${e.message}`);
  }
};

module.exports = {compareAndSendMessage};
