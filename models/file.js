const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const fileSchema = new Schema({
    filename: {type: String, require: true},
    path: {type: String, require: true},
    size: {type: Number, require: true},
    uuid: {type: String, require: true},
    sender: {type: String, require: false},
    reciver: {type: String, require: false}
}, {timestamps: true});


module.exports = new mongoose.model('File', fileSchema);