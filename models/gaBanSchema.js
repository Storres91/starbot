const mongoose = require('mongoose');

const gaBanSchema = new mongoose.Schema({
    bannedUserID: { type: String, require: true, unique: true },
    banCounter: { type: String, require: true, default: '1' },
})

const model = mongoose.model("gaBanModel", gaBanSchema);

module.exports = model;