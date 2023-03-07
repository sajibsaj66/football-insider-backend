const bcrypt = require('bcrypt');
const {userOTPVerfication} = require('../../models/userOTPVerification')
const {User} = require('../../models/user')
const jwt_decode = require('jwt-decode')

module.exports.verifyOTP = async (req, res) => {
    try {
        const userId = req.body.userId
        const otp = req.body.otp

        if(!userId || !otp ) {
            return res.status(400).send({
                status: false,
                message: "OTP is required"
            })
        } else {
            const userOTPVerificationRecords = await userOTPVerfication.find({userId})
            if(userOTPVerificationRecords.length <= 0) {
                return res.status(400).send({
                    status: false,
                    message: "OTP has been verified already or its expired. Please sign in or request for OTP again to continue."
                })
            } else {
                const {expiresAt} = userOTPVerificationRecords[0]
                const hashedOTP = userOTPVerificationRecords[0].otp

                if(expiresAt < Date.now()) {
                    await userOTPVerfication.deleteMany({ userId })
                    return res.status(400).send({
                        status:"false",
                        message: "OTP has expired. Please request for OTP again."
                    })
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP)
                    if(!validOTP) return res.status(400).send({status: false, message: "Invalid OTP passed."})

                    let user = {}
                    user = await User.findOne({_id: userId})
                    if(user) {
                        const {verifiedAt} = user.verifiedAt
                        const {verified} = user.verified
                            if(verifiedAt < Date.now()) {
                                if(!verified) await User.deleteMany({_id: userId})
                                return res.status(400).send({
                                    status:"false",
                                    message: "User session expried ! Please register again."
                                })
                            }
                        user.verified = true
                        user.verifiedAt = Date.now()
                        const token  = user.generateJWT();
                        const result = await user.save();

                        await userOTPVerfication.deleteMany({userId})

                        return res.status(201).send({
                            status: true,
                            message: "Email verified! User created successfully!",
                            token
                        })
                    }
                    return res.status(200).send({
                        status: true,
                        message: "User does not exists!",
                    })
                }
            }
        }
    } catch(error) {
        return res.status(200).send({
            status: false,
            message: error.message
        })
    }
}