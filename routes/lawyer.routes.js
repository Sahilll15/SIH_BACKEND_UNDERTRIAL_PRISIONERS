const { loginLawyer, signupLawyer, getLawyer, verifyLawyer } = require('../controllers/lawyer.controllers')
const { upload } = require('../middlewares/upload')

const router = require('express').Router()


router.post('/signupLawyer', upload.single('certificate'), signupLawyer)
router.post('/loginLawyer', loginLawyer)
router.get('/getAllLawyers', getLawyer)
router.post('/verifyLawyer/:lawyerId', verifyLawyer)

module.exports = router
