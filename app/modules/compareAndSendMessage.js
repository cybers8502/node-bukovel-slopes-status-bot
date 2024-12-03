const {DB_ROOT, MAP_URL} = require('../configs/consts');
const {fetchSlopesDataService} = require('../utils/fetchSlopesExternalData');
const {getFirebaseData, removeFirebaseRecord} = require('../utils/firebaseUtilities');
const {sendTelegramMessage, sendTelegramPhoto} = require('../utils/telegramUtilities');
const {takeWebpageScreenshotService} = require('../utils/takeWebpageScreenshot');
const {updateRecordAndPrepareMessage} = require('./updateRecordAndPrepareMessage');
const {sendTelegramMessageOrUnsubscribe} = require('./sendTelegramMessageOrUnsubscribe');

const customCSSForMapPage = `
  .react-transform-element {
    transform: scale(1)!important;
  }
  .legend, .map-controls {
    display: none!important;
  }`;

const compareAndSendMessage = async () => {
  try {
    const externalData = await fetchSlopesDataService();
    const firebaseData = await getFirebaseData(DB_ROOT);

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

      if (process.env.NODE_ENV === 'production') {
        const chatsID = await getFirebaseData(`${DB_ROOT}subscribedChanel`);

        await Promise.all(
          Object.keys(chatsID).map((chatID) =>
            sendTelegramMessageOrUnsubscribe({chatID, message: collectMessages, buffer}),
          ),
        );
      } else {
        await sendTelegramMessageOrUnsubscribe({
          chatID: process.env.TELEGRAM_CHAT_ID,
          message: collectMessages,
          buffer,
        });
      }
    }
  } catch (e) {
    await sendTelegramMessage(process.env.TELEGRAM_CHAT_ID, `Error: ${e.message}`);
  }
};

module.exports = {compareAndSendMessage};
