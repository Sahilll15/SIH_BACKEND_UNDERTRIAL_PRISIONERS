const { caseFight } = require('../models/caseFightModel')


const createCaseFightRequest = async (req, res) => {
    const { lawyerId } = req.params;
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




        const newCaseFight = await caseFight.create({
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


