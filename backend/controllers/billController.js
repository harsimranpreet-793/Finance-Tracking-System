const Bill = require('../models/Bill');

// @desc    Get bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add bill
// @route   POST /api/bills
// @access  Private
const addBill = async (req, res) => {
  try {
    const { name, amount, dueDate, frequency, reminderDate } = req.body;

    if (!name || !amount || !dueDate || !frequency) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    let defaultReminder = reminderDate;
    if (!defaultReminder) {
      const date = new Date(dueDate);
      date.setDate(date.getDate() - 3); // 3 days before
      defaultReminder = date;
    }

    const bill = await Bill.create({
      userId: req.user.id,
      name,
      amount,
      dueDate,
      frequency,
      reminderDate: defaultReminder
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bill (e.g. mark as paid)
// @route   PUT /api/bills/:id
// @access  Private
const updateBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (bill.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedBill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete bill
// @route   DELETE /api/bills/:id
// @access  Private
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    if (bill.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await bill.deleteOne();

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBills,
  addBill,
  updateBill,
  deleteBill
};
