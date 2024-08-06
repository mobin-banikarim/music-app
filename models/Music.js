let mongoose = require('mongoose');
let { Schema } = mongoose;

let musicSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    path : {
        type : String,
        required : true,
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Music' , musicSchema);