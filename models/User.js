let mongoose = require('mongoose');
const { schema } = require('./Music');
let { Schema } = mongoose;

let userSchema = new Schema({
    name : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    }
});

module.exports = mongoose.model('User' , userSchema);