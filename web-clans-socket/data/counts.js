const mongoose = require('mongoose');
module.exports = mongoose.model('counts', new mongoose.Schema({
    accounts: { type: Number, default: 0 },
    styles: { type: Number, default: 0 },
    boosts: { type: Number, default: 0 },
    emojis: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
}));