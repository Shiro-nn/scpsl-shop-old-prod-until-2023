const mongoose = require('mongoose');
module.exports = mongoose.model('emoji', new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
    url: { type: String },
}));