const express=require("express");
const mongoose = require("mongoose");
const crypto=require("crypto");
const bcrypt=require("bcrypt");
const router=express.Router();
const Balance=require("../model/BalanceModel");
const  Holdings  = require('../model/HoldingsModel');

const  Positions  = require('../model/PositionsModel');

const User=require("../model/UserModel");



router.post("/signup",async(req,res)=>{
    const {name,username,password}=req.body;
    try{
    let user=await User.findOne({username:username});
    if(user){
        return res.json({message:"User already exists"})
    }
    hashedPassword=await bcrypt.hash(password,10);
    const newUser=await new User({
        name,
        password:hashedPassword,
        username,
    });
    await newUser.save();
      const balance=await new Balance({
          userId:newUser._id,
          bal:2000
        });
        await balance.save();
        await User.findByIdAndUpdate(newUser._id,{$push:{Balance:balance}});
       const positions= await new Positions({
          userId:newUser._id
        })
        positions.save();
      const holdings=await new Holdings({
        userId:newUser._id
      })
      holdings.save();

    return res.json({message:"User Register Succesfull"})
}catch(e){
    console.log("eror register",e.message);
    return res.json({error:e.message});
}
     
});

router.post("/login",async(req,res)=>{
    const {username,password}=req.body;
    try{
        const user1=await User.findOne({username:username});
        if(!user1){
            return res.json({message:"User not found"});
        }
        const matching=await bcrypt.compare(password,user1.password);
        if(!matching){
            return res.json({message:"Invalid Password"});
        }
        const token=crypto.randomBytes(16).toString("hex");
        const userup=await User.findOneAndUpdate({username:username,token:token});
        const user=await User.findOne({username:username});
        return res.json({token:token,message:"User Logged",userId:user._id});

    }catch(e){
    console.log("eror register",e.message);
    return res.json({error:e.message});
}
});

router.get("/User/:id",async(req,res)=>{
      const {id}=req.params;
      try{
        const user=await User.findById(id);
        if(!user){
          return res.json({message:"User not Found"});
          }
          console.log(user);
          return res.json(user);
      }catch(e){
        return res.json({error:e.message});
      }
})

module.exports=router;