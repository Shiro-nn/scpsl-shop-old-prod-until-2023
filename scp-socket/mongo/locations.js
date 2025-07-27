const mongoose = require("mongoose");
module.exports = mongoose.model("locations", new mongoose.Schema({
    player: { type: String, required: true },
    nickname: { type: String, required: true },
    location: { type: String, required: true },
    ip: { type: String, required: true },
    date: { type: Date, required: true },
    server: { type: Number, required: true },
}));