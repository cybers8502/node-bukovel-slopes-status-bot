const {getExternalData} = require('./fetchSlopesDataService');
const {getFirebaseData, updateFirebaseStatus} = require('./firebaseService');
const {DB_ROOT} = require('../common-consts');
const {dateFormat} = require('./formatDateService');
const {sendTelegramMessage} = require('./sendTelegramMessageService');
async function compareAndUpdate() {
  try {
    const externalData = await getExternalData();
    const firebaseData = await getFirebaseData(DB_ROOT);

    for (const key in externalData.tracksData) {
      if (
        externalData.tracksData.hasOwnProperty(key) &&
        firebaseData.tracksData[key] &&
        externalData.tracksData[key].date_modified !== firebaseData.tracksData[key].date_modified
      ) {
        const externalTrack = externalData.tracksData[key];
        const firebaseTrack = firebaseData.tracksData[key];

        let userMessage = `Оновлено схил ${externalTrack.info.name}.`;

        if (externalTrack.info.text) {
          userMessage = `${userMessage} ${externalTrack.info.text}.`;
        }

        if (externalTrack.status !== firebaseTrack.status) {
          userMessage = `${userMessage}\nСтатус змінено на ${externalTrack.status === 'open' ? 'відкрито' : 'зачинено'}.`;
        }

        if (externalTrack.start_date !== firebaseTrack.start_date) {
          if (externalTrack.start_date) {
            userMessage = `${userMessage}\nДата відкриття ${dateFormat(externalTrack.start_date)}`;
          } else {
            userMessage = `${userMessage}\nДату відкриття видалено`;
          }

          externalTrack.history = externalTrack.history || [];

          if (externalTrack.status === 'open') {
            externalTrack.history.push({open: externalTrack.start_date});
          }
          if (externalTrack.status === 'close') {
            externalTrack.history.push({close: new Date().toString()});
          }
        }

        if (externalTrack.stop_date && externalTrack.stop_date !== firebaseTrack.stop_date) {
          if (externalTrack.stop_date) {
            userMessage = `${userMessage}\nДата закриття ${dateFormat(externalTrack.stop_date)}`;
          } else {
            userMessage = `${userMessage}\nДату закриття видалено`;
          }
        }

        await updateFirebaseStatus(`${DB_ROOT}new/tracksData/${key}`, externalTrack);
      }
    }
  } catch (error) {
    console.error('Помилка:', error);
  }
}

module.exports = {compareAndUpdate};
