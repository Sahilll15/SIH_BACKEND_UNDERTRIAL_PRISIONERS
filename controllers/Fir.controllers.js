
const { Fir } = require('../models/FirModel')

const createFir = async (req, res) => {
    try {


        const { firDate, firPlace, firDescription, PoliceStation, policeName, sections, informer, informerAddress, firStatus } = req.body;

        const newFir = await Fir.create({
            firDate: firDate,
            firPlace: firPlace,
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