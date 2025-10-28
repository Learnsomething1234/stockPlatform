const { model } = require("mongoose");

const HoldingsSchema  = require("../schemas/HolingsSchema");

const Holdings = new model("Holdings", HoldingsSchema);

module.exports = Holdings ;