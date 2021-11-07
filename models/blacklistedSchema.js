const mongoose = require('mongoose');

const blacklistedSchema = new mongoose.Schema({
    blUserID: { type: String, require: true, unique: true },
    blStatus: { type: Boolean, require: false, default: false},
})

const model = mongoose.model("blacklistedModel", blacklistedSchema);

module.exports = model;