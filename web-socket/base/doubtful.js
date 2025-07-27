const mongoose = require("mongoose")
config = require("../config.js");
module.exports = mongoose.model("doubtful", new mongoose.Schema({
    id: { type: String },
    banned: { type: Boolean },
    created: { type: Number },
}));