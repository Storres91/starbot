const mongoose = require('mongoose');

const confessionSchema = new mongoose.Schema({
    confessionID: { type: String, require: true, unique: true },
    confessionUserID: { type: String, require: true, unique: false },
    confessionMsg: { type: String, require: true},
    confessionTag: { type: String, require: true},
    confessionAvatar: { type: String, require: false}
})

const model = mongoose.model("confessionModel", confessionSchema);

module.exports = model;