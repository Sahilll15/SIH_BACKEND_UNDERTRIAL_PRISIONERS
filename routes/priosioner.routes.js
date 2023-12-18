const express = require('express')
const router = express.Router()
const { SignupPriosioner, setUserType, loginPrisoner, getLoggedInUser, fetchLawyers } = require('../controllers/priosioner.controllers')
const { validateToken } = require('../middlewares/validateToken')



router.post('/signup', SignupPriosioner)
router.post('/login', loginPrisoner)
router.post('/getLoggedInUser', validateToken, getLoggedInUser)
router.post('/setUserType/:userId', setUserType)
router.get('/fetchLawyers', fetchLawyers)



module.exports = router