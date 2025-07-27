const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("styles", new Schema({
    id: { type: Number },
    author: { type: Number, default: 0 },
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    link: { type: String },
    public: { type: Boolean, default: false },
    link_access: { type: Boolean, default: false },
    code: { type: String, default: '' },
    imgs: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    use: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    official: { type: Boolean, default: false },
}));