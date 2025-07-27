const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("accounts", new Schema({
    id: { type: Number, default: 0 },
    user: { type: String, default: '' },
    name: { type: String, default: '' },
    clan: { type: String, default: '' },
    steam: { type: String, default: '' },
    discord: { type: String, default: '' },
    prefix: { type: String, default: '' },
    time: { type: String, default: 'Нет данных' },
    gradient: {
        type: Object,
        default: {
            fromA: '#000000',
            toA: '#ffffff',
            fromB: '#ffffff',
            toB: '#000000',
            prefix: 'гыг'
        }
    },
}));