const mongoose = require('mongoose')
const { Case } = require('../models/caseModel')


const createCase = async (req, res) => {
    const obj = req.body;
    console.log(obj)

    const newCase = new Case(obj);

    try {
        await newCase.save();
        res.status(201).json(newCase);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


const updateCase = async (req, res) => {
    const { cnr_number } = req.params;
    const { obj } = req.body;

    try {
        const casee = await Case.findOne({ cnr_number: cnr_number });

        if (!casee) {
            res.status(404).json({ message: "Case not found" });
            return;
        }



        const updatedCase = await Case.findOneAndUpdate(
            { cnr_number: cnr_number },
            obj,
            { new: true }
        );

        res.status(200).json({ case: updatedCase, message: 'Case updated' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateCase };

const getAllCase = async (req, res) => {
    try {
        const cases = await Case.find()

        if (cases.length === 0) {
            res.status(404).json({ message: "No cases found" })
            return
        }

        res.status(200).json({ "cases": cases })


    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}


const getCaseByCnr = async (req, res) => {
    const { cnr_number } = req.params;
    try {

        if (!cnr_number) {
            res.status(401).json({ message: "CNR number not found" })
            return
        }

        const casee = await Case.findOne(
            {
                cnr_number: cnr_number

            }
        )

        res.status(200).json({ case: casee, message: 'case found' })
    }
    catch
    (error) {
        res.status(404).json({ message: error.message })
    }


}



module.exports = {
    createCase,
    getAllCase,
    getCaseByCnr
}