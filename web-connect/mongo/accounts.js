const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("accounts", new Schema({
    id: { type: Number, default: 0 },
    steam: { type: String, default: '' },
    discord: { type: String, default: '' },
    avatar: { type: String },
}));