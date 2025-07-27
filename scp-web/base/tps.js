const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("tps", new Schema({
    id: { type: Number, default: 0 },
    name: { type: String, default: '' },
    tps: { type: Array, default: [] }
}));