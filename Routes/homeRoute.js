let express = require('express');
let router = express.Router();
let Music = require('./../models/Music');
let homeController = require('./../controllers/homeController')

router.get('/' , homeController.getIndex);

router.get('/page' , homeController.loadMore);

router.get('/view/:musicId' , homeController.getDetail);

router.post('/view/:musicId/:comment/:userId' , homeController.addComment)

router.get('/delete-comment/:musicId/:commentId' , homeController.deleteComment);

module.exports = router;