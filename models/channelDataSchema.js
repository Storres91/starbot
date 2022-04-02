const mongoose = require('mongoose');

const channelDataSchema = new mongoose.Schema({
    channelID: { type: String, require: true, unique: true },
    owners: {type: Array, require: true},

});

const model = mongoose.model("channelDataModel", channelDataSchema);

module.exports = model;