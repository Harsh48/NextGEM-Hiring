const mongoose = require('mongoose');

  const transactionSchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['buy', 'sell'] },
    txid: { type: String, required: true },
    value_usd: { type: Number, required: true },
    value_weth: { type: Number, required: true },
    value_gemai: { type: Number, required: true },
    author: { type: String, required: true },
  }, { timestamps: true });

module.exports = mongoose.model('transactions', transactionSchema);