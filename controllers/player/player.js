const _ = require('lodash');
const { Players } = require('../../models/players/Players')
const { PlayerStatistics } = require('../../models/playerStatistics/PlayerStatistics')
const { Teams } = require('../../models/teams/Teams')
const { Leagues } = require('../../models/leagues/Leagues');
const { default: mongoose } = require('mongoose');

module.exports.playerProfile = async (req, res) => {  
    try {
        const id = req.params.playerId
        const careerList = req.query.careerList
        const careerDetails = req.query.careerDetails

        const player = await Players.aggregate([
            {
                '$match': {
                    'id': {'$eq': id},
                }
            },
            {
                '$lookup': {
                    'from': 'playerstatistics',
                    'localField': '_id',
                    'foreignField': 'player',
                    'pipeline': [
                        {
                            '$sort': {"season": -1}
                        },
                        {
                            '$limit': 4
                        }
                    ],
                    'as': 'career'
                  }
            }
        ])
        
        let result = _.pick(player[0], ["_id", "name", "nationality", "age", "birth.date", "photo"])      
        let career = _.pick(player[0], ["career"])
        let careerListArr = []
        let careerDetailsArr = []
        if(careerList || careerDetails) {
            for (item of career.career) {
                if(careerList) {
                    const team = await Teams.findOne({_id: item.team})
                    const league = await Leagues.findOne({_id: item.league})
                    careerListArr.push({ season: item.season, league: _.pick(league, ["id", "name"]) , team: _.pick(team, ["code", "logo", "name", "national"]) })
                }
                if(careerDetails) {
                    const team = await Teams.findOne({_id: item.team})
                    const league = await Leagues.findOne({_id: item.league})
                    careerDetailsArr.push({
                        season: item.season,
                        team: _.pick(team, ["code", "logo", "name", "national"]), 
                        league: _.pick(league, ["id", "logo", "name"]), 
                        cards: item.cards,
                        dribbles: item.dribbles,
                        duels: item.duels,
                        fouls: item.fouls,
                        games: item.games,
                        goals: item.goals,
                        passes: item.passes,
                        penalty: item.penalty,
                        shots: item.shots,
                        substitutes: item.substitutes,
                        tackles: item.tackles,
                    })
                }
            }
        }
        
        if (careerList) result.careerList = careerListArr
        if (careerDetails) result.careerDetails = careerDetailsArr
        
        res.json({
            status: true,
            message: Object.keys(result).length != 0 ? 'Player data fetched successfully' : 'Player data not found',
            data: result
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports.playerMatches = async (req, res) => {
    let id = req.query.id
    const player = await PlayerStatistics.find({player: mongoose.Types.ObjectId(id)}).sort({"season": -1})

    res.status(200).send({
        status: true,
        message: " data fetched",
        data: player
    })
}

