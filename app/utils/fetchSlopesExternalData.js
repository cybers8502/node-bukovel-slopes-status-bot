const axios = require('axios');
const fs = require('fs').promises;
const {SLOPES_STATUS_URL} = require('../configs/consts');
const logger = require('./logger');

async function fetchSlopesExternalData() {
  logger.info('fetchSlopesExternalData utility in progress');
  const response = await axios.get(SLOPES_STATUS_URL);
  return response.data;
}

module.exports = {fetchSlopesDataService: fetchSlopesExternalData};
