const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { Lineups } = require('../../models/lineups/Lineups');
const { headers } = require('../../api/apiConfig');

module.exports.lineupDetails = async (req, res) => {
    const fixtureId = req.params.fixtureId
    const lineups = await Lineups.findOne({fixtureId})
    if(lineups) {
        res.status(200).send({
            status: true,
            message: "Lineups fetched",
            data: lineups
        })
        try {
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups?fixture=${fixtureId}`,headers)
                let lineupData = response.data.response
                await Lineups.updateOne(
                            {fixtureId},
                            {
                                $set: {
                                    fixtureId,
                                    lineups: lineupData
                                }
                            },
                            {
                                upsert: true
                            }
                        )
        } catch(err) {
            console.log(err)
        }
    } else {
        try{
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups?fixture=${fixtureId}`,headers)
                let lineupData = response.data.response
                const result = await Lineups({
                    fixtureId,
                    lineups: lineupData
                })
                result.save()
    
                res.status(200).send({
                    status: true,
                    message: "Lineups fetched",
                    data: result
                })
        }catch(error) {
            console.log(error)
        }
    }   
}