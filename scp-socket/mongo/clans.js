const mongoose = require("mongoose");
module.exports = mongoose.model("clans", new mongoose.Schema({
    name: { type: String },
    tag: { type: String },
    color: { type: String },
    desc: { type: String },
}));