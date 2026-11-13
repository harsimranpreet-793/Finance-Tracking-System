const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

// @desc    Get dashboard analytics
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Total income, expenses, current balance
    const totals = await Transaction.aggregate([
      { $match: { userId: userId } },
      { $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpense = 0;
    
    totals.forEach(t => {
      if (t._id === 'income') totalIncome = t.total;
      if (t._id === 'expense') totalExpense = t.total;
    });

    const currentBalance = totalIncome - totalExpense;

    // Expense breakdown by category
    const categoryBreakdown = await Transaction.aggregate([
      { $match: { userId: userId, type: 'expense' } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]);

    // Monthly spending trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrends = await Transaction.aggregate([
      { 
        $match: { 
          userId: userId, 
          date: { $gte: sixMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { 
            month: { $month: "$date" }, 
            year: { $year: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format trends for frontend (array of { name: 'Month', income, expense })
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let trendsMap = {};
    
    monthlyTrends.forEach(item => {
      const { month, year, type } = item._id;
      const key = `${monthNames[month - 1]} ${year}`;
      
      if (!trendsMap[key]) {
        trendsMap[key] = { name: key, income: 0, expense: 0 };
      }
      trendsMap[key][type] = item.total;
    });

    res.status(200).json({
      totals: { income: totalIncome, expense: totalExpense, balance: currentBalance },
      categoryBreakdown,
      monthlyTrends: Object.values(trendsMap)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardData
};
