const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("roles", new Schema({
    owner: { type: Number, default: 0 },
    sum: { type: Number, default: 0 },
    id: { type: Number, default: 0 },
    expires: { type: Number, default: Date.now() },
    server: { type: Number, default: 0 },
    freezed: { type: Boolean, default: false },
    freeze_start: { type: Number, default: 0 },
    freeze_last: { type: Number, default: 0 },
}));