const mongoose = require('mongoose');

const gbanSchema = new mongoose.Schema({
    gbanUserID: { type: String, require: true, unique: true },
    gbanID:{type: Number, require: true, unique: true},
    gunbanDate: { type: Number, require: true},
    gbannedCounter: {type: Number, require: true, default: 2} 
})

const model = mongoose.model("gbanModel", gbanSchema);

module.exports = model;