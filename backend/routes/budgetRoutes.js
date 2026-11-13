const express = require('express');
const router = express.Router();
const { getBudgets, addBudget } = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBudgets)
  .post(protect, addBudget);

module.exports = router;
