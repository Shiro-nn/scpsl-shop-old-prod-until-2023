const mongoose = require("mongoose")
config = require("../config.js");
module.exports = mongoose.model("geoip", new mongoose.Schema({
    ip: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    loc: { type: String },
    org: { type: String },
    postal: { type: String },
    timezone: { type: String },
}));