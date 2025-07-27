const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("payments", new Schema({
    user: { type: String, default: '' },
    
    yookassa: { type: String, default: '' },

    sum: { type: Number, default: 0 },
    
    payId: { type: Number, default: 0 },

    isQiwi: { type: Boolean, default: false },
    qiwiTag: { type: String, default: '' },
    qiwiExpires: { type: Number, default: 0 },

    isDP: { type: Boolean, default: false },
    DPExpires: { type: Number, default: 0 },

    isDA: { type: Boolean, default: false },
    DAExpires: { type: Number, default: 0 },

    isCard: { type: Boolean, default: false },
    CardExpires: { type: Number, default: 0 },
    CardTag: { type: String, default: '' },
    CardBank: { type: String, default: '' },
    CardYkCheck: { type: String, default: '' },
}));