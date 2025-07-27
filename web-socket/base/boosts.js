const mongoose = require("mongoose"),
config = require("../config.js");
module.exports = mongoose.model("boosts", new mongoose.Schema({
    name: { type: String },
    id: { type: Number },
    sum: { type: Number },
    img: { type: String, default: `${config.dashboard.cdn}/scpsl/clans/boosts/unknow.png` },
}));