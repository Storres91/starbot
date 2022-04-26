const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    channels: {type: Array},
    embed: {type: Boolean, require: true, default: true},

});

const model = mongoose.model("favoritesModel", favoritesSchema);

module.exports = model;