const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt_decode = require('jwt-decode')
const { User } = require('../../models/user');
const { default: mongoose } = require('mongoose');

const fs = require('fs');


module.exports.update = async (req, res) => {
    try {
        let header = req.headers.authorization
        let token = header.split(" ")
        let decoded = await jwt_decode(token[1]);
        let id = decoded._id
        let firstName = req.body.firstName
        let lastName = req.body.lastName
        let image = req.body.image

        let user = await User.findById( id );

        if (user) {
            const file  = req.file
            user.firstName = firstName
            user.lastName = lastName

            if (file) {
                const path = `/images/user/${image}`;
                if(fs.existsSync(path)){
                    fs.rmSync(path);
                }
                user.image = file.path 
                console.log(file.path)
            }

            await user.save()
        }

        return res.status(200).send({
            status: true,
            message: "User updated successfully !",
        })

    } catch(err) {
        console.log(err.message)
        return res.status(200).send({
            status: true,
            message: err.message,
        })
    }
}


module.exports.user = async (req, res) => {
    try {
        let header = req.headers.authorization
        let token = header.split(" ")

        let decoded = await jwt_decode(token[1]);
        let id = decoded._id

        let user = await User.findOne({_id: id})
        if (user) {
            return res.status(200).send({
                status: true,
                message: "User profile",
                data: _.pick(user, ["firstName", "lastName", "email", "image"])
            })
        } else {
            return res.status(200).send({
                status: false,
                message: "user not found",
            })
        }
    } catch (err) {
        console.log(err.message)
    }
}