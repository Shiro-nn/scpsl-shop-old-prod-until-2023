const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Model = mongoose.model;

module.exports = Model('temps', new Schema({
    email: { type: String, default: '' },
    login: { type: String, default: '' },
    pass: { type: String, default: '' },
    nick: { type: String, default: '' },
    uid: { type: String, default: '' },
    created: { type: Number, default: Date.now() },
}));