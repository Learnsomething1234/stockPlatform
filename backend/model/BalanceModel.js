const { model } = require("mongoose");

const BalanceSchema  = require("../schemas/Balance");

const Balance = new model("Balance", BalanceSchema);

module.exports = Balance ;