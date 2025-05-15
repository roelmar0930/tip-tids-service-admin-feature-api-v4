const express = require('express');
const logger = require('../utils/Logger');

const router = express.Router();

router.get('/', (req, res) => {
  // You can perform any checks or logic here to determine the health status
  const isHealthy = true; // Example health check logic

  if (isHealthy) {
    logger.info('Health check OK');
    res.status(200).json({ status: 'ok' });
  } else {
    logger.info('Health check FAILED');
    res.status(500).json({ status: 'error' });
  }
});

module.exports = router;
