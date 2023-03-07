const axios = require('axios')
const _ = require('lodash');
const { PopularTeams } = require('../models/popularTeams')

const id = [33, 34, 36, 39, 40, 42, 45, 47, 48, 49, 50, 63, 66, 85, 157, 489, 496, 529, 541]

module.exports.fetchClubTeams = async (req, res) => {  
    let teams = {}
    for(let i = 0; i <id.length; i++) {
        try {
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/teams/?id=${id[i]}`, {
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                    "Content-type": "application/json",
                    "Accept-Encoding": "application/json"
                }
            })
            teams = new PopularTeams(_.pick(response.data.response[0].team, ['name', 'code', 'country', 'founded', 'national', 'logo']));
            teams.teamId = response.data.response[0].team.id
            teams.venue = response.data.response[0].venue
            const result = await teams.save()
        } catch(err) {
            console.log(err)
            return res.status(400).send(err)
        }
    }
    return res.status(200).send("Popular team fetch successful")
}