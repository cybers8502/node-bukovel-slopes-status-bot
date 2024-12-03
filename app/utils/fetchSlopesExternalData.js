const axios = require('axios');
const fs = require('fs').promises;
const {SLOPES_STATUS_URL} = require('../configs/consts');

async function fetchSlopesExternalData() {
  if (process.env.NODE_ENV === 'production') {
    const response = await axios.get(SLOPES_STATUS_URL);
    return response.data;
  } else {
    const data = await fs.readFile('mockups/slopesData.json', 'utf-8');
    return JSON.parse(data);
  }
}

module.exports = {fetchSlopesDataService: fetchSlopesExternalData};
