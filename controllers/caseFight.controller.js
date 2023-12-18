const { caseFight } = require('../models/caseFightModel')


const createCaseFightRequest = async (req, res) => {
    const { lawyerId } = req.params;
    try {
        const { userId } = req.user;


        const newCaseFight = await new caseFight({
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


module.exports = {
    createCaseFightRequest
}
