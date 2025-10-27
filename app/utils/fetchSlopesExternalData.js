const axios = require('axios');
const {SLOPES_STATUS_URL} = require('../configs/consts');

async function fetchSlopesExternalData() {
  const response = await axios.get(SLOPES_STATUS_URL);
  return response.data;
}

module.exports = {fetchSlopesDataService: fetchSlopesExternalData};
