
const { Fir } = require('../models/FirModel')

const createFir = async (req, res) => {
    try {


        const { accusedName, accusedAge, accusedAddharCard, firDate, firPlace, firDescription, PoliceStation, policeName, sections, informer, informerAddress, firStatus } = req.body;

        const newFir = await Fir.create({
            firDate: firDate,
            firPlace: firPlace,
            accusedAddharCard: accusedAddharCard,
            accusedAge: accusedAge,
            accusedName: accusedName,
            firDescription: firDescription,
            PoliceStation: PoliceStation,
            policeName: policeName,
            sections: sections,
            informer: informer,
            informerAddress: informerAddress,
            firStatus: firStatus
        })

        res.status(200).json({
            fir: newFir,
            message: "new fir created "
        })



    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}

const getFir = async (req, res) => {
    try {
        const fir = await Fir.find({})

        res.status(200).json({
            fir: fir,
            message: "fir fetched"
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}

//get fir by the user


const getFirByUser = async (req, res) => {
    try {
        const user = req.user;

        console.log('user', user)

        const fir = await Fir.find({
            accusedAddharCard: user.addharCard
        })


        res.status(200).json({
            Fir: fir
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}



const getFirById = async (req, res) => {
    const { firId } = req.params;
    try {
        const fir = await Fir.findById(firId);


        if (!fir) {
            res.status(401).json({
                message: "FIr not found"
            })
        }


        res.status(200).json({
            Fir: fir
        })


    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}



module.exports = {
    createFir,
    getFir,
    getFirById,
    getFirByUser
}