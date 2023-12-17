const { Prisioner } = require('../models/prisionerModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()



const createUser = async (req, res) => {
    const { type, name, id, email, password, phoneNumber } = req.body;
    try {

        if (!type || !name || !id || !email || !password || !phoneNumber) {
            res.status(401).json({
                message: "type,name,id,email,password are required"
            })
            return;
        }

        const existingUser = await Prisioner.findOne({
            email: email
        })

        if (existingUser) {
            res.status(401).json({
                message: "user already exists"
            })
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await new Prisioner({
            type: type,
            name: name,
            id: id,
            email: email,
            phoneNumber: phoneNumber,
            password: hashedPassword

        })

        await newUser.save()

        res.status(200).json({
            user: newUser,
            message: `new ${type} created `
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: err
        })
    }
}



module.exports = {
    createUser
}