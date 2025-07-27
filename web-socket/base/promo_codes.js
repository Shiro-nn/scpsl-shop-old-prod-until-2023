const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("promo_codes", new Schema({
    owner: { type: String, default: 'fydne' },
    code: { type: String, default: 'fydne' },
    to_owner: { type: Number, default: 5 },
    to_user: { type: Number, default: 5 }
}));