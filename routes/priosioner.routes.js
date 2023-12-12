const express = require('express')
const router = express.Router()
const { SignupPriosioner, setUserType, loginPrisoner, getLoggedInUser } = require('../controllers/priosioner.controllers')
const { validateToken } = require('../middlewares/validateToken')



router.post('/signup', SignupPriosioner)
router.post('/login', loginPrisoner)
router.post('/getLoggedInUser', validateToken, getLoggedInUser)
router.post('/setUserType/:userId', setUserType)


module.exports = router