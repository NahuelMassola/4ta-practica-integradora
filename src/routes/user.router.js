const { Router } = require('express');
const sessionController = require ('../controller/session.controller');
const uploader = require('../utils/middleware/multer');


const router = Router()

//user premium
router.post('/premium/:uid',sessionController.roleChange)
router.post('/:uid/documents', uploader )



module.exports = router