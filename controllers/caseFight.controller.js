const { Fir } = require('../models/FirModel');
const { caseFight } = require('../models/caseFightModel');
const { lawyer } = require('../models/lawyerModels');
const { Prisioner } = require('../models/prisionerModels');


const createCaseFightRequest = async (req, res) => {
    const { lawyerId } = req.params;
    const { FirNumber } = req.body;
    try {
        const { userId } = req.user;

        // if (userId === lawyerId) {
        //     res.status(401).json({
        //         message: 'user and lawyer cant be same'
        //     })
        //     return
        // }

        //todo://
        //add furture validation

        if (!FirNumber || !lawyer || !userId) {
            res.status(401).json({
                message: 'FirNumber or lawyer or user not found'
            })
            return
        }

        const CaseFightALreadyExists = await caseFight.findOne({
            FirNumber: FirNumber
        })

        if (CaseFightALreadyExists) {
            res.status(401).json({
                message: 'CaseFight already exists'
            })
            return
        }

        const Lawyer = await lawyer.findById(lawyerId);

        if (!Lawyer) {
            res.status(401).json({
                message: 'lawyer not found'
            })
            return
        }


        const user = await Prisioner.findById(userId)

        console.log(user)

        //find the user and weathher the prisioners has the mentioned FirNumber
        if (!user) {
            res.status(401).json({
                message: 'user not found'
            })
            return
        }

        //check if the user has the FirNumber
        const firs = await Fir.find({
            accusedAddharCard: user.addharCard
        })



        console.log('firs', firs)

        let hasCase = false;

        firs.forEach(fir => {
            if (fir.FirNumber === Number(FirNumber)) {
                hasCase = true;
            }
        }

        )

        if (!hasCase) {
            res.status(401).json({
                message: 'user does not have the case'
            })
            return
        }

        const newCaseFight = await caseFight.create({
            FirNumber: FirNumber,
            accused: userId,
            lawyer: lawyerId
        })


        res.status(200).json({
            caseFight: newCaseFight
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}


const fetchByLawyer = async (req, res) => {

    try {

        const { userId } = req.user;
        const cases = await caseFight.find({
            lawyer: userId
        })

        res.status(200).json({
            cases: cases
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}

const fetchByUser = async (req, res) => {
    try {

        const { userId } = req.user;
        const cases = await caseFight.find({
            accused: userId
        })

        res.status(200).json({
            cases: cases
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}


const acceptRequest = async (req, res) => {
    const { caseId } = req.params
    try {
        console.log(caseId)

        const casee = await caseFight.findById(caseId);

        console.log('case', casee)
        casee.Accepted = true;

        await casee.save()


        res.status(200).json({
            message: "case fight accpted"
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}





module.exports = {
    createCaseFightRequest,
    fetchByLawyer,
    fetchByUser,
    acceptRequest
}


