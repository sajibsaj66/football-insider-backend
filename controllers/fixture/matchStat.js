const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const {MatchStatistics} = require('../../models/matchStatistics/MatchStatistics')
const { headers } = require('../../api/apiConfig');

module.exports.matchStats = async (req, res) => {
    const fixtureId = req.params.fixtureId
    const stats = await MatchStatistics.findOne({fixtureId})
    if(stats) {
        res.status(200).send({
            status: true,
            message: "Match stats fetched",
            data: stats
        })
        try{
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics?fixture=${fixtureId}`, headers)
            let matchStats = response.data.response
            await MatchStatistics.updateOne(
                {fixtureId},
                {
                    $set: {
                        fixtureId,
                        stats: matchStats
                    }
                },
                {
                    upsert: true
                }
            )

        } catch(error) {
            console.log(error)
        }
    } else {
        try{
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics?fixture=${fixtureId}`, headers)
                let matchStats = response.data.response
                const result = await MatchStatistics({
                    fixtureId,
                    stats: matchStats
                })
                result.save()
    
                res.status(200).send({
                    status: true,
                    message: "Match Statistics fetched",
                    data: result
                })
        }catch(error) {
            console.log(error)
        }
    }
}