const mongoose = require("mongoose")
config = require("../config.js");
module.exports = mongoose.model("emoji", new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    url: { type: String, default: `${config.dashboard.cdn}/scpsl/emoji/unknow.png` },
}));