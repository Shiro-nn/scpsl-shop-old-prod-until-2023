const mongoose = require("mongoose"),
Schema = mongoose.Schema,
config = require("../config.js");
module.exports = mongoose.model("accounts", new Schema({
    id: { type: Number, default: 0 },
    email: { type: String, default: '' },
    user: { type: String, default: '' }, // login
    pass: { type: String, default: '' },

    date: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    avatar: { type: String, default: `${config.dashboard.cdn}/scpsl/users/avatars/unknow.png` },
    banner: { type: String, default: '' },
    name: { type: String, default: '' },
    
    clan: { type: String, default: '' },
    style: { type: Number, default: 0 },
    steam: { type: String, default: '' },
    discord: { type: String, default: '' },
    prefix: { type: String, default: '' },
    achievements: { type: Array, default: [] },
    ips: { type: Array, default: [] },

    time: { type: String, default: 'Нет данных' },
    last_active: { type: Number, default: 0 },
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