const {db} = require('../configs/firebaseConfig');

async function getFirebaseData(path) {
  const snapshot = await db.ref(path).once('value');
  return snapshot.val();
}

async function updateFirebaseRecord(path, info) {
  await db.ref(`${path}`).set(info);
}

async function removeFirebaseRecord(path) {
  await db.ref(`${path}`).remove();
}

module.exports = {getFirebaseData, updateFirebaseRecord, removeFirebaseRecord};
