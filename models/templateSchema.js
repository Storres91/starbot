const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    hostId: { type: String, require: true, unique: true },
    name: { type: String, require: true, unique: true, default:'Miniboss Giveaway' },
    duration: { type: String, require: true, default:'1m' },
    numberOfWinners: { type: Number, require: true, default: 9 },
    autoPing: { type: Boolean, require: true, default: true },
    message: { type: String, require: true, default:''},
    embedColor: { type: String, require: true, default:'826afc' }
})

const model = mongoose.model("templateModel", templateSchema);

module.exports = model;