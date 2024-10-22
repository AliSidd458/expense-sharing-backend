const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    splitAmount: { type: Number },
    percentage: { type: Number }
  }],
  splitType: { type: String, enum: ['Equal', 'Exact', 'Percentage'], required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
