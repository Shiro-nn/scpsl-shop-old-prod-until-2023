const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("customize", new Schema({
    owner: { type: String, default: 'fydne' },
    to: { type: Number, default: Date.now() },
    active: { type: Boolean, default: false },
	sum: {
		type: Object,
            default: {
                  ClassD: 0,
                  Scientist: 0,
                  Guard: 0,
                  Mtf: 0,
                  Chaos: 0,
                  Serpents: 0,
		}
	},
	scales: {
		type: Object,
		default: {
                  ClassD: 100,
                  Scientist: 100,
                  Guard: 100,
                  Mtf: 100,
                  Chaos: 100,
                  Serpents: 100,
		}
	},
	genetics: {
		type: Object,
		default: {
                  ClassD: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
                  Scientist: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
                  Guard: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
                  Mtf: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
                  Chaos: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
                  Serpents: {
                        adrenaline_compatible: false,
                        adrenaline_rush: false,
                        native_armor: false,
                  },
		}
	},
}));