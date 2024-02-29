const {updateFirebaseRecord} = require('../services/firebaseService');
const {DB_ROOT} = require('../common-consts');
const {dateFormat} = require('../services/formatDateService');
const updateRecordAndPrepareMessage = async (type, key, externalData, firebaseData) => {
  let userMessage = `Оновлено ${type === 'tracks' ? 'схил' : 'витяг'} ${externalData.info.name}.`;

  if (externalData?.status !== firebaseData?.status) {
    userMessage += `\nСтатус змінено на ${externalData.status === 'open' ? 'відкрито' : 'зачинено'}.`;
  }
  if (externalData?.isOpen !== firebaseData?.isOpen) {
    userMessage += `\nСтатус змінено на ${externalData.isOpen ? 'відкрито' : 'зачинено'}.`;
  }

  if (externalData.start_date !== firebaseData.start_date) {
    userMessage += externalData.start_date
      ? `\nДата відкриття ${dateFormat(externalData.start_date)}`
      : '\nДату відкриття видалено';

    externalData.history = firebaseData.history || [];
    type === 'tracks'
      ? externalData.history.push({[externalData.status]: externalData.start_date || new Date().toString()})
      : externalData.history.push({
          [externalData.isOpen ? 'open' : 'close']: externalData.start_date || new Date().toString(),
        });
  }

  if (externalData.stop_date && externalData.stop_date !== firebaseData.stop_date) {
    userMessage += externalData.stop_date
      ? `\nДата закриття ${dateFormat(externalData.stop_date)}`
      : '\nДату закриття видалено';
  }

  await updateFirebaseRecord(`${DB_ROOT}${type}Data/${key}`, externalData);

  return userMessage;
};

module.exports = {updateRecordAndPrepareMessage};
