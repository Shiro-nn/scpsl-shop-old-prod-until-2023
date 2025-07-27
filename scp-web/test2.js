
const statsData = require('./base/stats');
const mongoose = require("mongoose");
const config = require("./config");
const locationsData = mongoose.model("locations", new mongoose.Schema({
    player: { type: String, required: true },
    nickname: { type: String, required: true },
    location: { type: String, required: true },
    ip: { type: String, required: true },
    date: { type: Date, required: true },
    server: { type: Number, required: true },
}));

mongoose.connect(config.mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(async() => {
    const locations = await locationsData.find({server: 8});
    for (let location of locations) {
        location.server = 1;
        await location.save();
        console.log(location.nickname);
    }
})