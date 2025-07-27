const mongoose = require('mongoose');
module.exports = mongoose.model('accounts', new mongoose.Schema({
    id: { type: Number, default: 0 },
    clan: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    steam: { type: String, default: '' },
    discord: { type: String, default: '' },
}));