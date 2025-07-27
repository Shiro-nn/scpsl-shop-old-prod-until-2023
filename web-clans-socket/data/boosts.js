const mongoose = require('mongoose');
module.exports = mongoose.model('boosts', new mongoose.Schema({
    name: { type: String },
    id: { type: Number },
    sum: { type: Number },
    img: { type: String },
}));