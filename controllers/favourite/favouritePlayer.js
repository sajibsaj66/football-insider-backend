const _ = require('lodash');
const jwt_decode = require('jwt-decode')
const {User} = require('../../models/user')
const {PaginationParameters} = require('mongoose-paginate-v2')


module.exports.addFavouritePlayer = async (req, res) => {  

    const followId = req.body.id
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        await User.updateOne({_id: userId}, {$push:{favouritePlayer: followId}})
        return res.status(200).send({
            status: true,
            message: "Player followed !",
        })
    } catch(err) {
        console.log(err)
    }
}

module.exports.removeFavouritePlayer = async (req, res) => {
    const unfollwoId = req.body.id
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let user = await User.find({_id: userId}) 
        if ( !user[0].favouritePlayer.includes(unfollwoId) ) return res.status(200).send({status: false, message: "Team not found"})
        await User.updateOne({_id: userId}, { $pull:{favouritePlayer: unfollwoId } })
        return res.status(200).send({
            status: true,
            message: "Player unfollowed !",
        })
    } catch(err) {
        console.log(err)
    }
}