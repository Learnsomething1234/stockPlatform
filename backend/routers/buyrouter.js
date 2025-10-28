const express=require("express");
const mongoose = require("mongoose");
const router=express.Router();
const Balance=require("../model/BalanceModel");
const  Holdings  = require('../model/HoldingsModel');
const WatchList= require('../model/WatchListModel');
const  Positions  = require('../model/PositionsModel');
const Orders = require("../model/OrdersModel");
const User=require("../model/UserModel");

router.post("/buy/:userId/:id", async (req, res) => {
  const { userId, id } = req.params;
  const { quantity } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.json({ message: "User not found" });
    const balance=await Balance.findOne({userId:userId});

    
    let stockData = null;
    let source = "";

    const orderDoc = await Orders.findOne({ "stocks._id": id });
    if (orderDoc) {
      stockData = orderDoc.stocks.id(id);
      source = "order";
    } else {
      const watchlistDoc = await WatchList.findOne({ "stocks._id": id });
      if (watchlistDoc) {
        stockData = watchlistDoc.stocks.id(id);
        source = "watchlist";
      }
    }

    if (!stockData) {
      return res.json({ message: "Stock not found in order or watchlist" });
    }

    const { symbol, currentPrice, type1 } = stockData;
    const totalCost = currentPrice * quantity;

    
    if (balance.bal < totalCost) {
      return res.json({
        message: `Balance is not enough to buy. Available: ${balance.bal}`,
      });
    }


    balance.bal -= totalCost;
    await balance.save();

    
    if (type1 === "NORMAL") {
      const holdings = await Holdings.findOne({ userId });
      if (!holdings) {
        return res.json({ message: "Holdings not found for user" });
      }

      holdings.stocks.push({
        symbol,
        currentPrice,
        qty:quantity,
        total: totalCost,
      });

      await holdings.save();
     
    } else {
      const positions = await Positions.findOne({ userId });
      if (!positions) {
        return res.json({ message: "Positions not found for user" });
      }

      positions.stocks.push({
        symbol,
        currentPrice,
        qty:quantity,
        total: totalCost,
      });

      await positions.save();
      
    }

    return res.json({
      message: `You successfully bought ${quantity} of ${symbol} from ${source}`,
      remainingBalance: user.Balance.bal,
    });
  } catch (e) {
    console.error("Error during buy operation:", e.message);
    return res.status(500).json({ message: "Server error", error: e.message });
  }
});
module.exports=router;