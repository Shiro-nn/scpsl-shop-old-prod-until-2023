const mongoose = require("mongoose"),
config = require("../config.js");
module.exports = mongoose.model("achievements", new mongoose.Schema({
    name: { type: String },
    img: { type: String, default: `${config.dashboard.cdn}/scpsl/img/achievements/unknow.png` },
    desc: { type: String },
}));