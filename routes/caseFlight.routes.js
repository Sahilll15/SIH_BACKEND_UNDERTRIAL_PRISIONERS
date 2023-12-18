const express = require('express')

const router = express.Router()

const { createCaseFightRequest, acceptRequest, fetchByLawyer, fetchByUser } = require('../controllers/caseFight.controller')
const { validateToken } = require('../middlewares/validateToken')


router.post('/createCaseFight/:lawyerId', validateToken, createCaseFightRequest)
router.post('/acceptRequest/:caseId', validateToken, acceptRequest)
router.get('/fetchByLawyer', validateToken, fetchByLawyer)
router.get('/fetchByUser', validateToken, fetchByUser)



module.exports = router