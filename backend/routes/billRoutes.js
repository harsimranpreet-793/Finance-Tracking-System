const express = require('express');
const router = express.Router();
const { getBills, addBill, updateBill, deleteBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getBills)
  .post(protect, addBill);

router.route('/:id')
  .put(protect, updateBill)
  .delete(protect, deleteBill);

module.exports = router;
