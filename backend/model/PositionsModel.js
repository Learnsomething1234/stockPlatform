const { model } = require("mongoose");

const  PositionsSchema  = require("../schemas/PositionsSchema");

const Positions = new model("Positions", PositionsSchema);

module.exports =  Positions ;