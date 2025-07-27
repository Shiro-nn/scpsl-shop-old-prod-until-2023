const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

module.exports = Model('resets', new Schema({
    account: { type: Number, default: 0 },
    code: { type: String, default: '' },
    created: { type: Number, default: Date.now() },
}));