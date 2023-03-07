const bcrypt = require('bcrypt');
const {userOTPVerfication} = require('../../models/userOTPVerification')
const emailTransporter = require('../../helpers/email')

module.exports.sendOTPVerificationEmail = async ({_id, email}, res ) => {
    try{
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: email,
            subject: "DO NOT REPLY: Verify your email with Football insider",
            html: `
                    <p>Enter <strong>${otp}</strong> in the app to verify your email address.</p>
                    <p>This <strong>OTP will be expired in five minitues</strong>
                    <p>THIS IS AN AUTO GENERATED MAIL. DO NOT REPLY!!</p>
                `
        }
        const saltRounds = 10
        const hashedOTP = await bcrypt.hash(otp, saltRounds)

        const isExists = await userOTPVerfication.findOne({userId: _id})
        
        if(isExists != null) {
            await userOTPVerfication.updateMany(
                {userId: _id},
                {
                   $set: {
                        otp: hashedOTP,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 300000,
                   } 
                }
            )
                console.log("updating OTP")
            await emailTransporter.sendMail(mailOptions)
            return res.status(200).send({
                status: true,
                message: "Verification OTP sent to email",
                data: {
                    userId: _id,
                    email,
                    otp
                }
            })
        } else {
            const newOTPVerification = new userOTPVerfication({
                userId:_id,
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 300000,
            })
            await newOTPVerification.save()
            await emailTransporter.sendMail(mailOptions)
            return res.status(200).send({
                status: true,
                message: "Verification OTP sent to email",
                data: {
                    userId: _id,
                    email,
                    otp
                }
            })
        }
        res.end()
    } catch(error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
}