const _ = require('lodash');
const axios = require('axios');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { headers } = require('../../api/apiConfig');

const {Standings} = require("../../models/standings/Standings")

module.exports.standings = async (req, res) => {
    const leagueId = req.query.leagueId
    const season = req.query.season
    let year =  new Date().getFullYear();
        
    const standings = await Standings.findOne({
        leagueId,
        season
    })
    
    if(standings) {
        res.status(200).send({
            status: true,
            message: "Standings data fetched",
            data: standings
        })

        if(year == season) {
            try{
                const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`, headers)
                let standingsData = response.data.response[0].standings
                await Standings.updateOne(
                    {
                        leagueId,
                        season 
                    },
                    {
                        $set: {
                            standings: standingsData
                        }
                    },
                    {
                        upsert: true
                    }
                )
            } catch(error) {
                console.log(error)
            }
        }
    } else {
        try{
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/standings?league=${leagueId}&season=${season}`, headers)
           
            if(response.data.response.length == 0) {
                return res.status(200).send({
                    status: false, 
                    message: "No standings found"
                })
            }
            
            let leagueStandingDetails = response.data.response[0].league
            let standings = await Standings()
            standings.leagueId = leagueStandingDetails.id
            standings.name = leagueStandingDetails.name
            standings.country = leagueStandingDetails.country
            standings.logo = leagueStandingDetails.logo
            standings.flag = leagueStandingDetails.flag
            standings.season = leagueStandingDetails.season
            standings.standings = leagueStandingDetails.standings[0]
            standings.save()
    
            return res.status(200).send({
                status: true,
                message: "Standings data fetched",
                data: standings
            })
        }catch(error) {
            console.log(error)
        }
    }
}