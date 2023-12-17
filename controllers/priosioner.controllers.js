const { Prisioner } = require('../models/prisionerModels')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const SignupPriosioner = async (req, res) => {
    const { email, password, name, phoneNumber } = req.body;
    try {
        if (!email || !password || !name) {
            res.status(401).json({
                messaeg: "email,pass and name are required"
            })
            return
        }
        const existingPriosioner = await Prisioner.findOne({
            email: email
        })
        if (existingPriosioner) {
            res.status(401).json({
                message: "user already exists"
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await Prisioner.create({
            email: email,
            name: name,
            password: hashedPassword,
            phoneNumber: phoneNumber
        })

        res.status(200).json({
            user: newUser,
            message: "new user created "
        })


    } catch (error) {
        console.log(error)
        res.status(401).json({
            error: error
        })
    }
}


const loginPrisoner = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Prisioner.findOne({
            email: email
        });

        if (!user) {
            res.status(401).json({ message: "User does not exist" });
            return;
        }

        const comparePassword = await bcrypt.compare(password, user.password);

        if (comparePassword) {
            const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ token: token, user: user });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const getLoggedInUser = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await Prisioner.findById(userId);

        if (!user) {
            res.status(401).json({ message: "user not found" })
            return
        }

        res.status(200).json({
            message: "user verified",
            user: user
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: "error ", error: error })
    }
}


const setUserType = async (req, res) => {
    const { userId } = req.params;
    const { type } = req.body;

    try {
        const user = await Prisioner.findById(userId)

        if (!user) {
            res.status(401).json({ message: "user not found" })
            return
        }

        user.type = type;

        await user.save();

        res.status(200).json({ message: "user type updated", user: user })
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error, error: error })
    }

}


const fetchLawyers = async (req, res) => {

    try {
        const lawyers = await Prisioner.find({
            type: "Lawyer"
        })

        res.status(200).json({
            message: "lawyers fetched",
            lawyers: lawyers
        })
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error, error: error })
    }

}











module.exports = {
    SignupPriosioner,
    loginPrisoner,
    getLoggedInUser,
    setUserType,
    fetchLawyers
}