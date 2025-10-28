const { Schema } = require("mongoose");
const User=require("../model/UserModel");

const PositionsSchema = new Schema({
    stocks: [
    {
      symbol: String,
      dayHigh: Number,
      dayLow: Number,
      qty:Number,
      currentPrice: Number,
      total:Number,
},
  ],
  lastSoldDate:{
    type:String
  },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }


});
module.exports = PositionsSchema ;