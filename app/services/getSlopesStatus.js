const { getFirebaseData } = require('../utils/firebaseUtilities');
const { DB_ROOT } = require('../configs/consts');

const DIFFICULTY_EMOJI = {
  red: '🔴',
  blue: '🔵',
  black: '⚫',
};

const DIFFICULTY_LABEL = {
  red: 'Червоні',
  blue: 'Сині',
  black: 'Чорні',
};

async function getSlopesStatus(difficulty = null) {
  const tracksData = await getFirebaseData(`${DB_ROOT}tracksData`);

  if (!tracksData) {
    return 'Дані про траси відсутні.';
  }

  const openTracks = Object.values(tracksData).filter(
    (track) =>
      track.status === 'open' &&
      (difficulty === null || track.difficulty === difficulty),
  );

  if (openTracks.length === 0) {
    const label = difficulty
      ? `${DIFFICULTY_LABEL[difficulty].toLowerCase()} траси`
      : 'траси';
    return `Наразі відкритих трас немає${difficulty ? ` (${DIFFICULTY_EMOJI[difficulty]} ${label})` : ''}.`;
  }

  if (difficulty) {
    const header = `${DIFFICULTY_EMOJI[difficulty]} Відкриті ${DIFFICULTY_LABEL[difficulty].toLowerCase()} траси (${openTracks.length}):`;
    const lines = openTracks
      .sort((a, b) => a.info.name.localeCompare(b.info.name, 'uk'))
      .map((track) => `• ${track.info.name}`);
    return `${header}\n${lines.join('\n')}`;
  }

  const grouped = { red: [], blue: [], black: [] };
  for (const track of openTracks) {
    grouped[track.difficulty]?.push(track.info.name);
  }
  for (const names of Object.values(grouped)) {
    names.sort((a, b) => a.localeCompare(b, 'uk'));
  }

  const lines = Object.entries(grouped)
    .filter(([, names]) => names.length > 0)
    .map(([diff, names]) => `${DIFFICULTY_EMOJI[diff]} ${names.join(', ')}`);

  return `⛷️ Відкриті траси (${openTracks.length}):\n${lines.join('\n')}`;
}

module.exports = getSlopesStatus;
