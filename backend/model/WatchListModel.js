const mongoose=require("mongoose");
const WatchListSchema=require("../schemas/WatchListSchema");
const WatchList=new mongoose.model("WatchList",WatchListSchema);
module.exports=WatchList;