const mongoose = require('mongoose');

const countersSchema = new mongoose.Schema({
    counterID:{type:Number, default:1},
    confessionSeq: { type: Number, default: 1 },
    bansSeq:{type:Number, default:1}
});

const model = mongoose.model('countersModel', countersSchema);

module.exports = model;