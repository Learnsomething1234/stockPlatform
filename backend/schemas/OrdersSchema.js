const { Schema, model } = require("mongoose");

const stockSchema = new Schema({
  symbol: String,
  dayHigh: Number,
  dayLow: Number,
  currentPrice: Number,
  
  previousPrices: [
    {
      price: Number,
      recordedAt: { type: Date, default: Date.now },
    },
  ],
  type1: String,
  lastUpdated: { type: Date, default: Date.now },
});

const OrdersSchema = new Schema({
  stocks: [stockSchema],
  createdAt: { type: Date, default: Date.now },
  lastFetchedAt: { type: Date, default: Date.now },
});

module.exports =  OrdersSchema;
