const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  amount: {
    type: Number,
  },
  paymentId: {
    type: String,
    trim: true,
  },
  orderId: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['created', 'success', 'failed'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
