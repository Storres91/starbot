const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
    confessionID: { type: String, require: true, unique: true },
    confessionMsg: { type: String, require: true},
})

const model = mongoose.model("confessionModel", confessionSchema);

module.exports = model;