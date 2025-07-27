const mongoose = require('mongoose');
module.exports = mongoose.model('wars', new mongoose.Schema({
	date: { type: Number, default: Date.now() },
	type: { type: Number, default: 1 },
	map: { type: Number, default: 1 },
	owner: {
		type: Object,
		default: {
			tag: "",
			role: 1,
			money: 0
		}
	},
	clan: {
		type: Object,
		default: {
			tag: "",
			role: 1,
			money: 0
		}
	},
	treasury: {
		type: Object,
		default: {
			amount: 0,
			coins: true,
			his: true,
		}
	},
	players: { type: Number, default: 0 },
	host: {
		type: Object,
		default: {
			location: 0,
			dedicated: false,
		}
	},
}));