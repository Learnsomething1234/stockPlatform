require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const userRouter=require("./routers/userrouter");
const fetchProduct=require("./routers/fetchproductt");
const buyProduct=require("./routers/buyrouter");
const balance=require("./routers/balance");

const URL = process.env.MONGO_URL;
app.use(cors());
app.use(bodyParser.json());
app.use("",userRouter);
app.use("",fetchProduct);
app.use("",buyProduct)
app.use("",balance);

app.listen(PORT, async() => {
    console.log("app is started",PORT);
    try{
    await mongoose.connect(URL);
    console.log("mongodb connected");
    }catch(e){
      console.log(e.message);
    }
    
})