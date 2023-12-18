
const { Fir } = require('../models/FirModel')

function generateRandomNumber() {
    const min = 1000;
    const max = 9999;
    return Math.floor(Math.random() * (max - min + 1) + min);
}


const createFir = async (req, res) => {
    try {


        const { accusedGender, accusedAddress, accusedName, accusedAge, accusedAddharCard, firDate, firPlace, firDescription, PoliceStation, policeName, sections, informer, informerAddress, firStatus } = req.body;

        const newFir = await Fir.create({
            FirNumber: generateRandomNumber(),
            firDate: firDate,
            firPlace: firPlace,
            accusedAddharCard: accusedAddharCard,
            accusedAge: accusedAge,
            accusedName: accusedName,
            accusedAddress: accusedAddress,
            accusedGender: accusedGender,
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


const getFirByNumber = async (req, res) => {
    const { FirNumber
    } = req.params;
    try {
        const fir = await Fir.find({
            FirNumber: FirNumber
        })

        if (fir.length === 0) {
            res.status(401).json({
                message: "Fir Not Created"
            })
            return
        }

        console.log('fir', fir)

        res.status(200).json({
            message: "fir created",
            fir: fir
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
    getFirByUser,
    getFirByNumber
}