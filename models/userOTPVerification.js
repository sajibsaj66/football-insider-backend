const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOTPVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

module.exports.userOTPVerfication = mongoose.model(
    "userOTPVerification",
    userOTPVerificationSchema
)
