const {db} = require('../configs/firebaseConfig');
async function getFirebaseData(path) {
  const snapshot = await db.ref(path).once('value');
  return snapshot.val();
}
async function updateFirebaseStatus(path, status) {
  await db.ref(`${path}`).set(status);
}

module.exports = {getFirebaseData, updateFirebaseStatus};
