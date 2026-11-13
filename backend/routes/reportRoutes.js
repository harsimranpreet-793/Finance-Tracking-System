const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardData);

module.exports = router;
