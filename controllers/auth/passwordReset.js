const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../../models/user');
const {userOTPVerfication} = require('../../models/userOTPVerification');
const {sendOTPVerificationEmail} = require('./sendOTPVerificationEmail');


module.exports.resetPasswordOTP = async (req, res) => {

    let user = {};
    user = await User.findOne({ email: req.body.email });

    if (user) {
        sendOTPVerificationEmail(user, res)
    } else {
        return res.status(200).send({
            status: false,
            message: "The email is not registered with the App."
        })
    }

}

module.exports.resetPassword = async (req, res) => {
    const password = req.body.password
    const confirmPassword = req.body.confirmPassword

    if( !password || !confirmPassword ) return res.status(200).send({status: false, message: "Please fill up the password fields"})

    if (password != confirmPassword) {
        return res.status(200).send({status: false, message: "Confirm password is not mached with new password"})
    } else {


        return res.status(200).send({status: true, message: "Password changed"})
    }
}