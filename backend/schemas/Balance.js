const { Schema, model } = require("mongoose");

const WithdrawSchema = new Schema({
  amount: { type: Number, required: true },
  status: { type: String, enum: ["SUCCESS", "FAILED"], default: "SUCCESS" },
  withdrawnAt: { type: Date, default: Date.now }
});

const BalanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bal: { type: Number, default: 0 },
  lastAddedAt: { type: Date },
  withdrawHistory: [WithdrawSchema] 
});

module.exports =  BalanceSchema;
