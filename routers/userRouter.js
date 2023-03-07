const router = require('express').Router();
const multer = require('multer');
const {userProfilePictureStorage} = require('../storage/multer_storage');
const uploadUserImage = multer({storage: userProfilePictureStorage});
const {update, user} = require('../controllers/user/userController')
const {ContentTypeMiddleware} = require("../middlewares/ContentTypeMiddleware")
const authorize = require('../middlewares/authorize')


router.patch('/update', authorize, ContentTypeMiddleware.formData, uploadUserImage.single('image'), update);
router.get('/profile', authorize, user);


module.exports = router;