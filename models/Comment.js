let mongoose = require('mongoose');
let { Schema } = mongoose;

let commentSchema = new Schema({
    musicId : {
        type: Schema.Types.ObjectId,
        ref : 'Music',
        required : true,
    },
    author : {
        type: String,
        required : true,
    },
    authorId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('Comment', commentSchema);