const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['monthly', 'weekly'],
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  reminderDate: {
    type: Date, // Typically 3 days before dueDate
  }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
