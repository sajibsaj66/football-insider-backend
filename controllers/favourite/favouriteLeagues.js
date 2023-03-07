const _ = require('lodash');
const jwt_decode = require('jwt-decode')
const { User } = require('../../models/user')
const { Fixtures } = require('../../models/fixtures/Fixtures')
const { default: mongoose } = require('mongoose');
const { default: axios } = require('axios');


module.exports.addFavouriteLeague = async (req, res) => {  

    const leagues = req.body.leagues
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let user = await User.find({_id: userId})
        for(let i = 0; i <leagues.length; i++) {
            if ( user[0].favouriteLeague.includes(leagues[i]) ) return res.status(200).send({status: false, message: "League already followed"})
            await User.updateOne({_id: userId}, {$push:{favouriteLeague: leagues[i]}})
        }
        return res.status(200).send({
            status: true,
            message: "League followed !",
        })
    } catch(err) {
        console.log(err)
    }
}
module.exports.removeFavouriteLeague = async (req, res) => {
    const unfollwoId = req.body.id
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        await User.updateOne({_id: userId}, {$pull:{favouriteLeague: unfollwoId}})
        return res.status(200).send({
            status: true,
            message: "League unfollowed !",
        })
    } catch(err) {
        console.log(err)
    }
}
module.exports.getFavouriteLeague = async (req, res) => {  
    const header = req.headers.authorization
    const token = header.split(" ")

    const decoded = await jwt_decode(token[1]);
    const userId = decoded._id

    try{
        let favLeague = await User.aggregate([
            {
                '$lookup': {
                    'from': 'leagues',
                    'localField': 'favouriteLeague',
                    'foreignField': 'id',
                    'as': 'leagues'
                }
            }, {
                '$match': {
                    '_id': {'$eq': mongoose.Types.ObjectId(userId)},
                }
            }
        ])
        if(favLeague[0].leagues.length != 0) {
            let result = []
            for(item of favLeague[0].leagues) {
                result.push(_.pick(item, ["id", "name", "logo"]))
            }
            return res.status(200).send({
                status: true,
                message: "All favourite leagues !",
                data: result
            })
        } else {
            return res.status(200).send({
                status: false,
                message: "No leagues followed yet !",
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
module.exports.favouriteLeagueMatches = async (req, res) => {
    try {
        const leagueId = parseInt(req.query.leagueId)
        let leagueMatches = await Fixtures.find({ "league.id": leagueId }).limit(4)
        if(leagueMatches.length == 0) {
            let currentSeason = new Date().getFullYear();
            const response = await axios.get(
                `https://api-football-v1.p.rapidapi.com/v3/fixtures?league=${leagueId}&season=${currentSeason}`, 
                    {
                        headers: {
                            "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                            "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                            "Content-type": "application/json",
                            "Accept-Encoding": "application/json"
                        }
                    }
                )
                const leagueMatchesArr = []
                for(item of response.data.response) {
                    leagueMatchesArr.push(_.pick(item, ["fixtureId", "status", "timestamp", "date", "teams", "goals"]))
                }
                return res.status(200).send({
                    status: true,
                    message: "League fixture fetched",
                    data: leagueMatchesArr
                })
        }
        const leagueMatchesArr = []
        for(item of leagueMatches) {
            leagueMatchesArr.push(_.pick(item, ["fixtureId", "status", "timestamp", "date", "teams", "goals"]))
        }
        return res.status(200).send({
            status: true,
            message: "League fixture fetched",
            data: leagueMatchesArr
        })
    } catch (error) {
        console.log(error)
    }

}
