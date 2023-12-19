const { lawyer } = require('../models/lawyerModels')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require('fs').promises; // Use promises version of fs
const path = require('path');
const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

const s3 = new AWS.S3();

const signupLawyer = async (req, res) => {
    const { name, email, password, phone, address, certificate, LicenseNumber } = req.body;


    try {

        const existingLawyer = await lawyer.findOne({
            email: email
        })

        if (existingLawyer) {
            res.status(401).json({
                message: "lawyer is alraedy existing "
            })
            return
        }

        //add hashed password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newLawyer = new lawyer({
            name,
            email,
            password: hashedPassword,
            phone,
            address,

            LicenseNumber
        })

        if (req.file) {
            const file = req.file;
            const fileKey = Date.now() + '-' + file.originalname;

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: await fs.readFile(file.path),
                ContentType: file.mimetype,
            };

            const uploadCertificate = await s3.upload(params).promise();
            newLawyer.certificate = uploadCertificate.Location;

            console.log('uploadCertificate', uploadCertificate);

        }
        else {
            res.status(401).json({
                message: "certificate is required"
            })
            return
        }
        const savedLawyer = await newLawyer.save()
        console.log(savedLawyer)



        res.status(200).json(savedLawyer)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const loginLawyer = async (req, res) => {

    const { email, password } = req.body;

    try {

        console.log(email)
        const Lawyer = await lawyer.findOne({
            email: email
        })

        if (!Lawyer) {
            res.status(401).json({
                message: "lawyer not found"
            })
            return
        }

        console.log(Lawyer)

        if (!Lawyer.isVerified) {
            res.status(401).json({
                message: "Lawyer is not verified"
            })
            return
        }

        const comparePassword = await bcrypt.compare(password, Lawyer.password);

        if (comparePassword) {
            const token = jwt.sign(
                {
                    userId: Lawyer._id,
                    addharCard: Lawyer.addharCard
                },
                process.env.ACCESS_TOKEN_SECRET
            );
            res.status(200).json({ token: token, lawyer: Lawyer });
        } else {
            res.status(401).json({ message: "Incorrect password" });
        }



    } catch (error) {
        res.status(500).json({ error: error.message })
    }

}


const verifyLawyer = async (req, res) => {
    const { lawyerId } = req.params;

    try {

        const Lawyer = await lawyer.findById(lawyerId);

        if (!Lawyer) {
            res.status(401).json({
                message: "Lawyer not found"
            })
            return
        }

        Lawyer.isVerified = true;

        const savedLawyer = await Lawyer.save();

        res.status(200).json({
            message: "Lawyer verified",
            lawyer: savedLawyer
        })


    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getLawyer = async (req, res) => {
    try {

        const Lawyer = await lawyer.find({
            isVerified: true
        });


        if (!Lawyer) {
            res.status(401).json({
                message: "Lawyer not found"
            })
        }

        res.status(200).json({
            Lawyer: Lawyer
        })

    } catch (error) {
        console.log(error)
        res.status(501).json({
            message: error
        })
    }
}



module.exports = {
    signupLawyer, loginLawyer, getLawyer,
    verifyLawyer
}