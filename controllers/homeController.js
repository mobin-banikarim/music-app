let Music = require('./../models/Music');
let Comment = require('./../models/Comment');
let User = require('./../models/User');

exports.getIndex = (req , res, next) => {
    let page = 1;

    Music.find().limit(7)
    .then(musicList => {
        res.render('index' , {
            title : 'Mobin Music',
            isLogin : req.session.isLogin,
            musicList,
            page : page,
        });
    })
}

exports.loadMore = (req , res , next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 7;
    const skip = page * limit;

    Music.find().skip(skip).limit(limit)
    .then(musicList => {
        res.json(musicList);
    })
}

exports.getDetail = (req , res , next) => {
    let musicId = req.params.musicId;
    let allowComment = false;

    Music.findById(musicId)
    .then(music => {
        Comment.find({musicId})
        .then(comments => {
            res.render('musicPage' , {
                user : req.user,
                isLogin : req.session.isLogin,
                music,
                comments,
            });
        })
    })
}

exports.addComment = (req , res , next) => {
    let musicId = req.params.musicId;
    let content = req.body.comment;

    if (!content) {
        return res.redirect(`/view/${musicId}`)
    }
    User.findById(req.user._id)
    .then(user => {
        let comment = new Comment({
            musicId,
            author : user.name,
            authorId : user._id,
            content,
        })
        return comment.save();
    })
    .then(() => {
        res.redirect(`/view/${musicId}`);
    })
}

exports.deleteComment = (req , res, next) => {
    let commentId = req.params.commentId;
    let musicId = req.params.musicId;

    Comment.findById(commentId)
    .then(comment => {
        if (comment.authorId.toString() === req.user._id.toString()) {
            Comment.deleteOne({ _id : commentId })
            .then(() => {
                res.redirect(`/view/${musicId}`);
            })
        }
        else {
            res.redirect(`/view/${musicId}`);
        }
    })
    .catch(err => console.log(err));
}