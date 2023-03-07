const _ = require('lodash');
const jwt_decode = require('jwt-decode')
const {User} = require('../../models/user')
const {Teams} = require('../../models/teams/Teams')
const { default: mongoose } = require('mongoose');


module.exports.addFavouriteTeam = async (req, res) => {  

    const teams = req.body.teams
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let user = await User.find({_id: userId})

        for(let i = 0; i <teams.length; i++) {
            
            if ( user[0].favouriteTeam.includes(teams[i]) ) return res.status(200).send({status: false, message: "Team already followed"})

            await User.updateOne({_id: userId}, { $push:{favouriteTeam: teams[i] } })
        }
        return res.status(200).send({
            status: true,
            message: "Teams followed !",
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports.removeFavouriteTeam = async (req, res) => {
    const unfollwoId = req.body.id
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let user = await User.find({_id: userId}) 
        if ( !user[0].favouriteTeam.includes(unfollwoId) ) return res.status(200).send({status: false, message: "Team not found"})
        await User.updateOne({_id: userId}, { $pull:{favouriteTeam: unfollwoId } })
        return res.status(200).send({
            status: true,
            message: "Team unfollowed !",
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports.getFavouriteTeams = async (req, res) => {  
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let favTeams = await User.aggregate([
            {
                '$lookup': {
                    'from': 'teams',
                    'localField': 'favouriteTeam',
                    'foreignField': 'id',
                    'as': 'teams'
                }
            }, {
                '$match': {
                    '_id': {'$eq': mongoose.Types.ObjectId(userId)},
                }
            }
        ])
        if (favTeams) {
            return res.status(200).send({
                status: true,
                message: "All favourite teams !",
                data: favTeams[0].teams
            })
        } else {
            return res.status(200).send({
                status: false,
                message: "No favourite teams data !",
            })
        }
        
    } catch(err) {
        console.log(err)
        return res.status(502).send({
            status: true,
            message: "We are working on our database, please try again later !",
        })
    }
}

