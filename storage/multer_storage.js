const multer = require('multer');
const fs = require('fs');
const path = require('path');

module.exports = {
    userProfilePictureStorage:multer.diskStorage({
        destination:(req,file,cb)=>{
            const userPath = './public/images/user/';
            if(!fs.existsSync(userPath)) {
                fs.mkdirSync(userPath, {recursive: true});
            }
            cb(null,userPath);
        },
        filename:(req,file,cb)=>{
            cb(null, Date.now() + path.extname(file.originalname))
        }
    }),
}