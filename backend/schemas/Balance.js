const { Schema, model } = require("mongoose");

const WithdrawSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  withdrawnAt: { type: Date, default: Date.now }
});

const TransactionHistorySchema = new Schema({
  type: { type: String, enum: ["BUY", "SELL"], required: true },
  category: { type: String, enum: ["HOLDING", "POSITION"], required: true },
  symbol: { type: String, required: true },
  qty: { type: Number, required: true },
  buyPrice: Number,
  sellPrice: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

const BalanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bal: { type: Number, default: 0 },
  lastAddedAt: { type: Date },
  withdrawHistory: [WithdrawSchema],
  transactionHistory: [TransactionHistorySchema] 
})
module.exports = BalanceSchema;
