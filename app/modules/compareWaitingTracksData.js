const {dateFormat} = require('../services/formatDateService');
const compareWaitingTracksData = (externalData, firebaseData) => {
  if (externalData.length === 0 && firebaseData) {
    return 'Лист очікування очищено';
  }

  let changes = '';
  for (let i = 0; i < externalData.length; i++) {
    const externalTrack = externalData[i];
    const firebaseTrack = firebaseData ? firebaseData[i] : undefined;

    if (!firebaseTrack) {
      if (externalTrack.tracks.length > 0) {
        externalTrack.tracks.forEach((track) => {
          const trackInfo = Object.values(track)[0];
          changes += `Схил ${trackInfo.info.name} відкриється ${dateFormat(trackInfo.start_date)}\n`;
        });
      }
      continue;
    }

    if (
      externalTrack.date !== firebaseTrack.date ||
      externalTrack.tracks.length !== firebaseTrack.tracks.length
    ) {
      continue;
    }

    for (let j = 0; j < externalTrack.tracks.length; j++) {
      const trackInfo1 = Object.values(externalTrack.tracks[j])[0];
      const trackInfo2 = Object.values(firebaseTrack.tracks[j])[0];

      if (trackInfo1.date_modified !== trackInfo2.date_modified) {
        changes += `Схил ${trackInfo1.info.name} відкриється ${dateFormat(trackInfo1.start_date)}\n`;
      }
    }
  }

  return changes ? `Оновлено лист очікування схилів:\n\n${changes}` : '';
};

module.exports = {compareWaitingTracksData};
