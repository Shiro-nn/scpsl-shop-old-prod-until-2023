const mongoose = require("mongoose"),
Schema = mongoose.Schema;

module.exports = mongoose.model("actions", new Schema({
    userid: { type: String, default: '' },
    server: { type: Number, default: 0 },
    seconds: { type: Number, default: 0 },
}));