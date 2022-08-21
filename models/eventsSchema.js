const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    channelID: { type: String, require: true, unique: true },
    trigger: {type: Boolean, require: true, default: true},

});

const model = mongoose.model("eventsModel", eventsSchema);

module.exports = model;