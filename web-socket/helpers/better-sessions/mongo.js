const mongoose = require('mongoose');
module.exports = mongoose.model('sessions', new mongoose.Schema({
    id: { type: String, default: '' },
    account: { type: Number, default: 0 },
    data: { type: String, default: '' },
    browser: { type: String, default: 'Unknow' },
    loc: { type: String, default: 'Unknow' },
    os: { type: String, default: 'Unknow' },
    expires: { type: Number, default: Date.now() },
    last: { type: Number, default: Date.now() }
}));