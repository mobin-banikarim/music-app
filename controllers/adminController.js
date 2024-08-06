const session = require('express-session');
let Music = require('../models/Music');
let User = require('../models/User');
let Comment = require('../models/Comment');
let fs = require('fs').promises;

exports.getUploadMusic = (req , res , next) => {
    if (req.user) {
        res.render('uploadMusic' , {
            isLogin : req.session.isLogin,
        });
    }
    else {
        res.redirect('/login');
    }
}

exports.postUploadMusic = (req , res , next) => {
    let title = req.body.title;
    let path = req.file.destination + '/' + req.file.filename;
    console.log(title)

    let music = new Music({
        title : title,
        path : path,
        userId : req.user,
    })

    music.save()
    .then(() => {
        res.redirect('/');
    })
    .catch((err) => {
        console.log(err);
        console.log('Error');
        res.redirect('/admin/upload-music');
    });
}


exports.getDashboard = (req , res , next) => {
    
    if (req.user) {
        Music.find({ userId : req.user._id })
        .then(musics => {
            Comment.find({ _id : musics.userId })
            .then(comments => {
                console.log(comments)
                res.render('dashboard' , {
                    isLogin : req.session.isLogin,
                    musicList : musics,
                });
            })
            
        })
    }
    else {
        res.redirect('/login')
    }
}

exports.postDeleteMusic = (req , res , next) => {
    let musicId = req.body.musicId;

    Music.findOne({_id: musicId , userId: req.user._id})
    .then(result => {
        fs.access(result.path)
        .then(() => {
            return Music.deleteOne({ _id : musicId })
        })
        .then(() => {
            fs.unlink(result.path)
            console.log('Deleted');
            res.redirect('/admin/dashboard');
        })
    })
    .catch( err => {
        res.redirect('/')
    } )
}