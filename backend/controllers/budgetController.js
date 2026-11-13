const Budget = require('../models/Budget');

// @desc    Get budgets
// @route   GET /api/budgets
// @access  Private
const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    let query = { userId: req.user.id };
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const budgets = await Budget.find(query);
    res.status(200).json(budgets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add or Update budget
// @route   POST /api/budgets
// @access  Private
const addBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    if (!category || !limit || !month || !year) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find if budget exists for this category/month/year
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category,
      month,
      year
    });

    if (existingBudget) {
      existingBudget.limit = limit;
      const updatedBudget = await existingBudget.save();
      return res.status(200).json(updatedBudget);
    }

    const budget = await Budget.create({
      userId: req.user.id,
      category,
      limit,
      month,
      year
    });

    res.status(201).json(budget);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBudgets,
  addBudget
};
