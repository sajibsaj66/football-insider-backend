const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../../models/user');
const {sendOTPVerificationEmail} = require('./sendOTPVerificationEmail')


module.exports.register = async (req, res) => {  
    
    let user = {};
    user = await User.findOne({ email: req.body.email });
    
    if (user) {
        if(user.social) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
            const token  = user.generateJWT();
            const result = await user.save();
            return res.status(201).send({
                status: true,
                message: "Registration Successfull !",
                token: token
            })   
        } else if (!user.verified) {
            sendOTPVerificationEmail(user, res)
        }
        else {
            return res.status(200).send({
                status: false,
                message: "User already registered!"
            })
        }
    } else {
        user = new User(_.pick(req.body, ['email', 'password']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.verified = false;
        user.verifiedAt = Date.now() + 300000
        
        const result = await user.save();
    
        sendOTPVerificationEmail(result, res)   
    }  
}

module.exports.login = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if(!user) {
        return res.status(200).send({
            status: false,
            message: "User not found"
        })
    } else {
        if(user.social) {
            if (user.password) {
                const token = user.generateJWT();
                return res.status(200).send({
                    status: true,
                    message: "Sign in Successfull !",
                    token: token
                })
            }
            return res.status(200).send({
                status: false,
                message: `User has already signed up with ${user.social} account!!`
            })
        }
            
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if(!validUser) return res.status(200).send({
            status: false,
            message: "Please enter correct password"
        });
        
        const token = user.generateJWT();
        return res.status(200).send({
            status: true,
            message: "Sign in Successfull !",
            token: token
        })
    
    }

}