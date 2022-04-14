const mongoose = require('mongoose');

const favoritesSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    channels: {type: Array},

});

const model = mongoose.model("favoritesModel", favoritesSchema);

module.exports = model;