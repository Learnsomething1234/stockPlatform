const {Schema}=require("mongoose");

const StockSchema = new Schema({
  symbol: String,
  qty: Number,
  currentPrice: Number,
  BuyPrice:Number,
  todayPrice: Number,
  lastPriceUpdate: Date,
  priceHistory: [
    {
      date: String,      // YYYY-MM-DD
      price: Number
    }
  ]
});

const HoldingsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  stocks: [StockSchema]
});

module.exports = HoldingsSchema;
