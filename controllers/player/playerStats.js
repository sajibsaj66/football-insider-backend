const _ = require('lodash');
const { Players } = require('../../models/players/Players')
const { Teams } = require('../../models/teams/Teams')
const { Leagues } = require('../../models/leagues/Leagues');

module.exports.playerStats = async (req, res) => {
    const id = req.query.id
    const season = req.query.season
    const leagueId = req.query.leagueId
   
    if(!id) return res.status(200).send({status: false, message: "Players id is required"})
    
    try {
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
                        }
                    ],
                    'as': 'career'
                  }
            }
        ])    
        let playerStats = _.pick(player[0], ["career"])

        let careerDetailsArr = []
        let seasons = []
        let leagues = []
        for( item of playerStats.career){
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
                    seasons.push(item.season)
                    leagues.push(_.pick(league, ["id", "logo", "name"]))
        }

        if(season) {
            let filteredStat = []
            if(leagueId) {
                for (item of careerDetailsArr) {
                    if(item.season == season && item.league.id == leagueId) {
                        filteredStat.push(item)
                    }
                }
                return res.status(200).send({
                    status: true,
                    message: filteredStat.length == 0 ? "No player statistics found for this league or in the season" : `Players statistics fetched for the season ${season}`,
                    seasonList: [...new Set(seasons)],
                    leagueList: [...new Map(leagues.map((m) => [m.id, m])).values()],
                    data: filteredStat
                })
            }

            return res.status(200).send({
                message: "'leagueId' required to fetch statistics data",
                seasonList: [...new Set(seasons)],
                leagueList: [...new Map(leagues.map((m) => [m.id, m])).values()],
            })
        } else {
            if(leagueId) {
                return res.status(200).send({
                    status: false,
                    message:"'season' required to fetch statistics data",
                    seasonList: [...new Set(seasons)],
                    leagueList: [...new Map(leagues.map((m) => [m.id, m])).values()],
                })
            }
        }

        return res.status(200).send({
            status: true,
            message: "Both 'leagueId' and 'season' required to fetch satatistics data!",
            seasonList: [...new Set(seasons)],
            leagueList: [...new Map(leagues.map((m) => [m.id, m])).values()]
        })

    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}
