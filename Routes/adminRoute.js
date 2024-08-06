let express = require('express');
let router = express.Router();
const { check, body } = require('express-validator');
let adminController = require('../controllers/adminController');
let { mkdirp } = require('mkdirp');
let multer = require('multer');

let getDir = './public/mp3';

let storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb(null , getDir);
    },
    filename : (req , file , cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
})
let upload = multer({ storage: storage });



router.get('/upload-music' , adminController.getUploadMusic);

router.post('/upload-music' ,
body('title')
.notEmpty().withMessage('تایتل نباید خالی باشد'),
upload.single('music') , adminController.postUploadMusic);


router.get('/dashboard' , adminController.getDashboard);

router.post('/delete' , adminController.postDeleteMusic);


module.exports = router;