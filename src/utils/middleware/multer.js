const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: path.join(`${__dirname}/../../public/documents`),
    filename : function(req,file,cb){
        cb(null , `${Date.now()}-${file.originalname}`);
    }
}
)
const uploader = multer ({
    storage, 
    destination: path.join(`${__dirname}/../../public/documents`),
    limits:{ fileSize: 1024 * 1024 }, // max file
    }).single('file')


module.exports = uploader