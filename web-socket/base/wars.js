const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("wars", new Schema({
    id: { type: String },
	date: { type: Number, default: Date.now() },
	type: { type: Number, default: 1 },
	map: { type: Number, default: 1 },
	owner: {
		type: Object,
		default: {
			tag: "",
			role: 1
		}
	},
	clan: {
		type: Object,
		default: {
			tag: "",
			role: 1
		}
	},
	winning: {
		type: Object,
		default: {
			amount: 0,
			coins: true
		}
	},
}));