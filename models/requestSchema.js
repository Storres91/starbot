const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestID: { type: String, require: true, unique: true },
    prize: { type: String, require: true },
    winners: { type: String, require: true },
    duration: { type: String, require: true },
    extraEntry: { type: String, require: false, default: ' '},

    requirement: { type: String, require: false, default:' ' },
    message: { type: String, require: false, default:' ' },
    host: { type: String, require: true },

    tt: {type: String, require: false},
    template: {type: String, require: false}

})

const model = mongoose.model("requestModel", requestSchema);

module.exports = model;