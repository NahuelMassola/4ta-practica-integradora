const { Router } = require('express');
const sessionController = require ('../controller/session.controller');
const multer = require('../utils/middleware/multer');


const router = Router()

//user premium
router.post('/premium/:uid',sessionController.roleChange)
router.get('/:uid/documents', multer.single('file') , sessionController.uploadDocuments)

module.exports = router