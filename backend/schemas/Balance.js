const { Schema } = require("mongoose");
const User=require("../model/UserModel");
const BalanceSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    bal:{
        type:Number,
        default:0,
    },
    lastAddedAt:{
        type:Date
    }
})
module.exports=BalanceSchema;