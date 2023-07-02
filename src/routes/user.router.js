const { Router } = require('express');
const sessionController = require ('../controller/session.controller');
const saveDocs = require('../utils/middleware/multer');
const passportCustom = require('../utils/passportCall');
const { JWT_STRATEGY } = require('../config/config');
const { admin } = require('../utils/middleware/isUser');


const router = Router()

//user premium
router.post('/premium/:uid',sessionController.roleChange)
router.post('/:uid/documents', passportCustom(JWT_STRATEGY) , saveDocs , sessionController.updateDocuments )
router.get('/getUsers' , sessionController.getUsers)
router.delete('deleteUserInactive' , passportCustom(JWT_STRATEGY) ,admin , sessionController.deleteUserInactive )



module.exports = router