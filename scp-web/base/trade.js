const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("trade", new Schema({
    id: { type: Number },
    owner: { type: Number, default: 0 },
    sum: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
}));