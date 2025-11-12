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
    const externalData = await fetchSlopesDataService();
    const firebaseData = await getFirebaseData(DB_ROOT);

    let collectMessages = '';

    for (const [key, track] of Object.entries(externalData.tracksData)) {
      if (!firebaseData?.tracksData?.[key]) {
        firebaseData.tracksData ??= {};
        firebaseData.tracksData[key] = {
          ...track,
          date_modified: Date.now(),
        };
      }

      /*if (track.date_modified !== firebaseData.tracksData?.[key]?.date_modified) {
        collectMessages +=
          (await updateRecordAndPrepareMessage('tracks', key, track, firebaseData.tracksData[key])) + '\n\n';
      }*/
    }

    for (const [key, lift] of Object.entries(externalData.liftsData)) {
      if (!firebaseData?.liftsData?.[key]) {
        firebaseData.liftsData ??= {};
        firebaseData.liftsData[key] = {
          ...lift,
          date_modified: Date.now(),
        };
      }

      if (lift.date_modified !== firebaseData.liftsData?.[key]?.date_modified) {
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
      await sendDigest(collectMessages, buffer);
    }
  } catch (e) {
    await errorInform(`Error: ${e}`);
  } finally {
    const endTime = Date.now();
    const duration = endTime - startTime;
    logger.info(`compareAndSendMessage executed in ${duration}ms`);
  }
};

module.exports = compareAndSendMessage;
