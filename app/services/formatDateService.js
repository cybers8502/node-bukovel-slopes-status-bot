const dateFormat = function (date) {
  const objDate = new Date(date);
  const options = {day: '2-digit', month: 'long', year: 'numeric'};
  return objDate.toLocaleDateString('uk-UA', options);
};

module.exports = {dateFormat};
