const mongoose = require('mongoose');
module.exports = mongoose.model('invites', new mongoose.Schema({
    code: { type: String },
    clan: { type: String },
    expires: { type: Number },
    by: { type: Number, default: 0 },
}));