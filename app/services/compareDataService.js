const {getExternalData} = require('./fetchSlopesDataService');
const {getFirebaseData} = require('./firebaseService');
const {DB_ROOT} = require('../common-consts');
async function compareAndUpdate() {
  try {
    const externalData = await getExternalData();
    const firebaseData = await getFirebaseData(DB_ROOT);
  } catch (error) {
    console.error('Помилка:', error);
  }
}

module.exports = {compareAndUpdate};
