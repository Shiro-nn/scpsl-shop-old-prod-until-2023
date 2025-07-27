const mongoose = require('mongoose');
module.exports = mongoose.model('chat', new mongoose.Schema({
    clan: { type: String },
    messages: { type: Array, default: [] },
}));