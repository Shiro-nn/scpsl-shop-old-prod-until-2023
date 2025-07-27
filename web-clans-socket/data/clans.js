const mongoose = require('mongoose');
module.exports = mongoose.model('clans', new mongoose.Schema({
    name: { type: String },
    tag: { type: String },
    color: { type: String },
    public: { type: Boolean, default: true },
    img: { type: String },
    desc: { type: String, default: '' },
    users: { type: Array, default: [] },
    news: { type: Array, default: [] },
    notifications: { type: Array, default: [] },
    boosts: { type: Array, default: [] },
    money: { type: Number, default: 10000 },
    balance: { type: Number, default: 0 },
}));