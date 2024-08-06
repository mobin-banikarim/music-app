let express = require('express');
let router = express.Router();
const { check, body } = require('express-validator');
let registerController = require('./../controllers/registerController');

router.get('/singup' , registerController.getRegister);

router.post('/singup' ,
body('name')
    .notEmpty().withMessage('نام کاربری نباید خالی باشد')
    .isLength({ min : 5 }).withMessage('نام کاربری حداقل باید پنج کاراکتر باشد'),
body('password')
    .notEmpty().withMessage('پسورد را وارد کنید')
, registerController.postRegister);


router.get('/login' , registerController.getLogin);

router.post('/login' , 
body('name')
    .notEmpty().withMessage('نام کاربری نباید خالی باشد'),
body('password')
    .notEmpty().withMessage('پسورد را وارد کنید')
, registerController.postLogin);


router.get('/logout' , registerController.getLogout);


module.exports = router;