const mongoose = require('mongoose');

const countersSchema = new mongoose.Schema({
    confessionSeq: { type: Number, default: 1 }
});

const model = mongoose.model('countersModel', countersSchema);

module.exports = model;