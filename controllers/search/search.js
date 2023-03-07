const _ = require('lodash');
const { NationalTeams } = require('../../models/nationalTeams');
const { Teams } = require('../../models/teams/Teams');
const { Leagues } = require('../../models/leagues/Leagues');
const { Players } = require('../../models/players/Players');
const {PaginationParameters} = require('mongoose-paginate-v2')


module.exports.search = async (req, res) => {
    const search = req.query.key || ""
    
    let teams = []
    const teamResult = await Teams.find({name: { $regex: `^${search}`, $options: "i"}})
    for(let d of teamResult) {
        teams.push(_.pick(d, ["id", "code", "name", "logo"]))
    }

    let leagues = []
    const leagueResult = await Leagues.find({name: { $regex: `^${search}`, $options: "i"}})
    for(let d of leagueResult) [
        leagues.push(_.pick(d, ["id", "name", "logo"]))
    ]

    let players = []
    const playerResult = await Players.find({name: { $regex: `^${search}`, $options: "i"}})
    for(let d of playerResult) {
        players.push(_.pick(d, ["id", "name"]))
    }

    let result = {}
    teams.length != 0 ? result.teams = teams : null
    leagues.length != 0 ? result.leagues = leagues : null
    players.length != 0 ? result.players = players : null

    return res.status(200).send({
        status: true,
        message: "searched result",
        result
    })
}