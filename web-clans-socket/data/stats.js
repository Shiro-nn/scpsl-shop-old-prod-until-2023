const mongoose = require('mongoose');
module.exports = mongoose.model('stats', new mongoose.Schema({
    steam: { type: String, default: '' },
    discord: { type: String, default: '' },
    money: { type: Number, default: 0 },
}));