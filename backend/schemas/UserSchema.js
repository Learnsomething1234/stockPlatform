const {Schema}=require("mongoose");

const Holdings  = require("../model/HoldingsModel");
const Positions  = require("../model/PositionsModel");
const Balance=require("../model/BalanceModel");

const UserSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:{
        type:String,
    },
    holdings:[{
        type:Schema.Types.ObjectId,
        ref:"Holdings"
    }],
    positions:[{
        type:Schema.Types.ObjectId,
        ref:"Positions"
    }],
    Balance:{
        type:Schema.Types.ObjectId,
        ref:"Balance"
    }
})
module.exports=UserSchema;