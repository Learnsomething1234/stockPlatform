const express=require("express");
const router=express.Router();
const mongoose = require("mongoose");

const Balance=require("../model/BalanceModel");
const User=require("../model/UserModel");
  router.get("/balance/:userId",async(req,res)=>{
       const {userId}=req.params;
       try{
        const user=await User.findById(userId).populate("Balance");
         if(!user) return res.json({message:"User not found"});
         return res.json(user.Balance.bal);
       }catch(e){
        console.log("error during fetch balance",e.message);
       }
  })

//   router.post("/addBalance/:userId", async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const balance = await Balance.findOne({ userId: user._id });
//     if (!balance) return res.status(404).json({ message: "Balance record not found" });

  
//     const lastAdded = balance.lastAddedAt;
//     const today = new Date();

//     if (lastAdded) {
//       const lastDate = new Date(lastAdded);
//       const sameDay =
//         lastDate.getDate() === today.getDate() &&
//         lastDate.getMonth() === today.getMonth() &&
//         lastDate.getFullYear() === today.getFullYear();

//       if (sameDay) {
//         return res.status(400).json({ message: "Balance already added today" });
//       }
//     }

  
//     balance.bal += 2000;
//     balance.lastAddedAt = new Date();

//     await balance.save();

//     return res.json({
//       message: "Balance added successfully",
//       newBalance: balance.bal,
//     });
//   } catch (e) {
//     console.error("Error during balance update:", e.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.patch("/withdraw/:userId", async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const balance = await Balance.findOne({ userId: user._id });
    if (!balance) return res.status(404).json({ message: "Balance record not found" });

    if (balance.bal < amount) {
      // Record failed withdraw attempt
      balance.withdrawHistory.push({
        amount,
        status: "FAILED",
      });
      await balance.save();
      return res.json({
        message: `Insufficient balance. Your balance is ${balance.bal}`,
        withdrawHistory: balance.withdrawHistory
      });
    }

    // Deduct balance and add to withdraw history
    balance.bal -= amount;
    balance.withdrawHistory.push({
      amount,
      status: "SUCCESS",
    });

    await balance.save();

    return res.json({
      message: "Withdraw successful",
      newBalance: balance.bal,
      withdrawHistory: balance.withdrawHistory
    });

  } catch (e) {
    console.error("Error during balance update:", e.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/withdraw-history/:userId", async (req, res) => {
  try {
    const balance = await Balance.findOne({ userId: req.params.userId });

    if (!balance) {
      return res.status(404).json({ message: "User balance not found" });
    }

    res.json({
      withdrawHistory: balance.withdrawHistory
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;
  