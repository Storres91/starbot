const mongoose = require('mongoose');

const remindersSchema = new mongoose.Schema({
    userID:{type:String},
    description: { type: String},
    date:{type:Number}
});

const model = mongoose.model('remindersModel', remindersSchema);

module.exports = model;