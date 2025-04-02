const {db} = require('../configs/firebaseConfig');
const logger = require('./logger');

async function getFirebaseData(path) {
  logger.info('getFirebaseData utility in progress');
  const snapshot = await db.ref(path).once('value');
  return snapshot.val();
}

async function updateFirebaseRecord(path, info) {
  logger.info('updateFirebaseRecord utility in progress');
  await db.ref(`${path}`).set(info);
}

async function removeFirebaseRecord(path) {
  logger.info('removeFirebaseRecord utility in progress');
  await db.ref(`${path}`).remove();
}

module.exports = {getFirebaseData, updateFirebaseRecord, removeFirebaseRecord};
