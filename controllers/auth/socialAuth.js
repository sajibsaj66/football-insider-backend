const _ = require('lodash');
const { User } = require('../../models/user');


module.exports = async (req, res) => {  

    const social = req.body.social;
    const image = req.body.image;
    // const name = req.body.name;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    // const nameSplit = name.split(" ")

    // let firstName = ""
    // for(let i = 0; i <nameSplit.length-1; i++) {
    //     firstName += nameSplit[i] + " " 
    // }

    // const lastName = nameSplit.slice(-1)[0]


    let user = {};
    user = await User.findOne({ email: req.body.email });
    
    if (user) {
        if(user.social === social) {
            const token = user.generateJWT();
            return res.status(200).send({
                status: true,
                message: `${social} Sign in Successfull!`,
                token: token,
            })
        } else {
            if(!user.social) {
                user.social = social
                user.image = image
                user.name.firstName = firstName
                user.name.lastName = lastName
                // user.name = name
                user.verified = true
                
                const token = user.generateJWT();
                const result = await user.save()
                return res.status(200).send({
                    status: true,
                    message: `${social} Sign in Successfull!`,
                    token: token,
                })    
            }
            return res.status(200).send({
                status: false,
                message: `This user is signed in with ${user.social}!`,
                result
            })
        }
    };

    user = new User(_.pick(req.body, ['email', 'firstName', 'lastName', 'image', 'social']));
    user.verified = true;

    const token  = user.generateJWT();

    const result = await user.save();

    return res.status(200).send({
        status: true,
        message: "Registration Successfull !",
        token: token,
    })   
}
