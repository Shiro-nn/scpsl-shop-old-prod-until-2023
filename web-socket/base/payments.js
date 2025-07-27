const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("payments", new Schema({
    paymentid: { type: Number, default: 1 },
    payments: { type: Array, default: [] }
}));