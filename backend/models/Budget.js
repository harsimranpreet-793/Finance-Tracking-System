const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Other'],
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true, // 1-12
  },
  year: {
    type: Number, 
    required: true, // 2026, 2027
  }
}, { timestamps: true });

// Ensure one budget per category per month/year for a user
budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
