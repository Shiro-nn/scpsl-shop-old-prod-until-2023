const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("donate", new Schema({
    owner: { type: String, default: 'fydne' },
    sum: { type: Number, default: 0 },
    promo: { type: Number, default: 0 },
    to: { type: String, default: '01.01.2021 00:00' },
    force: { type: Boolean, default: false },
    give: { type: Boolean, default: false },
    effects: { type: Boolean, default: false },
    players_roles: { type: Boolean, default: false },
    prefix: { type: String, default: 'RA' },
    color: { type: String, default: '#00ff15' },
    server: { type: Number, default: 0 },
}));