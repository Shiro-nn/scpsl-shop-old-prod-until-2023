const mongoose = require("mongoose")
config = require("../config.js");

module.exports = mongoose.model("doubtful", new mongoose.Schema({
    id: { type: String },
    setuped: { type: Boolean },
    banned: { type: Boolean },
    daysSinceLastBan: { type: Number },
    created: { type: Number },
    level: { type: Number },
    gameHours: { type: Number },

    expires: { type: Number },
}));