const mongoose = require("mongoose"),
Schema = mongoose.Schema;
module.exports = mongoose.model("visuals", new Schema({
    owner: { type: Number, default: 0 },
    sum: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    expires: { type: Number, default: Date.now() },

    root: {
        type: Object,
        default: {
            nimb: false,
            light: false,
            doctor: false,
            flasher: false,
        }
    },
    ClassD: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
    Scientist: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
    Guard: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
    MTF: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
    Chaos: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
    Hand: {
        type: Object,
        default: {
            nimb: true,
            light: {
                buy: true,
                color: { r: 255, g: 0, b: 0 }
            },
            doctor: true,
            flasher: true,
        }
    },
}));