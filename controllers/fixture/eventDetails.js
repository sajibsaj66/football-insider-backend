const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const {Events} = require('../../models/events/Events')
const { headers } = require('../../api/apiConfig');

module.exports.eventDetails = async (req, res) => {
    const fixtureId = req.params.fixtureId
    const events = await Events.findOne({fixtureId})

    if(events) {
        res.status(200).send({
            status: true,
            message: "Events fetched",
            data: events
        })
            try{
                const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/events?fixture=${fixtureId}`, headers)
                data = response.data.response
                await Events.updateOne(
                    {fixtureId},
                    {
                        $set: {
                            fixtureId,
                            events: data
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
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/events?fixture=${fixtureId}`, headers)
            data = response.data.response
            const result = await Events({
                fixtureId,
                events: data
            })
            result.save()
    
            return res.status(200).send({
                status: true,
                message: "Events fetched",
                data: result
            })
        }catch(error) {
            console.log(error)
        }
    }
}