let User = require('./../models/User');
let bcrypt = require('bcrypt');
let { body, validationResult } = require('express-validator');

exports.getRegister = (req , res , next) => {
    res.render('register/singup' , {
        isLogin : req.session.isLogin,
        errors : [],
    });
}

exports.postRegister = (req , res , next) => {
    let name = req.body.name;
    let password = req.body.password;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register/singup' , {
            isLogin : req.session.isLogin,
            errors : errors.array(),
        });
    }
    User.findOne({ name : name })
    .then((result) => {
        if (result) {
            return res.redirect('/singup');
        }
        bcrypt.hash(password , 10)
        .then((hashPassword) => {
            let user = new User({
                name,
                password : hashPassword,
            })
            user.save();
            res.redirect('/');
        })
    })
    .catch( (err) => console.log(err) );
}

exports.getLogin = (req , res , next) => {
    res.render('register/login' , {
        isLogin : req.session.isLogin,
        errors : []
    });
}

exports.postLogin = (req , res , next) => {
    let name = req.body.name;
    let password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('register/login' , {
            isLogin : req.session.isLogin,
            errors : errors.array(),
        });
    }
    User.findOne({ name : name })
        .then((user => {
            if (!user) {
                return res.redirect('/login');
            }
            bcrypt.compare(password , user.password)
                .then(hashPassword => {
                    if (hashPassword) {
                        req.session.isLogin = true;
                        req.session.user = user;
                        return req.session.save(() => {
                            res.redirect('/');
                        })
                    }
                    else {
                        res.redirect('/login');
                    }
                })
        }))
        .catch(err => {
            console.log(err)
            return res.redirect('/login')
        })
}


exports.getLogout = (req , res , next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}