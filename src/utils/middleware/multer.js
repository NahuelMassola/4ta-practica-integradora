const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null , path.join(`${__dirname}/../../../public/documents`));
    },
    filename : function(req,file,cb){
        cb(null , `${Date.now()}-${file.originalname}`);
    }
})

const uploader = multer ({
    storage, 
    //limits:{ fileSize: 1024 * 1024 *5},
    onError: function( err , next) {
        console.log("Error",err);
        next();
    }
})


module.exports = uploader