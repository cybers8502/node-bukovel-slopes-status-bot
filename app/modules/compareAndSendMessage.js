const {DB_ROOT, MAP_URL} = require('../configs/consts');
const logger = require('../utils/logger');
const {fetchSlopesDataService} = require('../utils/fetchSlopesExternalData');
const {getFirebaseData} = require('../utils/firebaseUtilities');
const {takeWebpageScreenshotService} = require('../utils/takeWebpageScreenshot');
const updateRecordAndPrepareMessage = require('./updateRecordAndPrepareMessage');
const errorInform = require('../services/errorInform');
const sendDigest = require('../services/sendDigest');

const customCSSForMapPage = `
  .react-transform-element {
    transform: scale(1)!important;
  }
  .legend, .map-controls {
    display: none!important;
  }`;

const compareAndSendMessage = async () => {
  const startTime = Date.now();

  try {
    logger.info('Starting compareAndSendMessage...');

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
      /*const buffer = await takeWebpageScreenshotService({
        url: MAP_URL,
        selector: '#mapObject',
        customCSS: customCSSForMapPage,
        customViewport: {width: 2865, height: 1648},
      });*/

      await sendDigest(collectMessages);
      logger.info('compareAndSendMessage completed successfully.');
    }
  } catch (e) {
    await errorInform(`Error: ${e.message}`);
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    logger.info(`compareAndSendMessage executed in ${duration}ms`);
  }
};

module.exports = compareAndSendMessage;
