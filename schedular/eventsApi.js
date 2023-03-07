const axios = require('axios')
const _ = require('lodash');
const {Fixtures} = require('../models/fixtures/Fixtures')
const {Events} = require('../models/events/Events')

module.exports.fetchEvents = async (req, res) => {
    let fixture = await Fixtures.find()
    try{
        for(let i = 0; i <fixture.length; i++) {
            const response = await axios.get(
                    `https://api-football-v1.p.rapidapi.com/v3/fixtures/events?fixture=${fixture[i].fixtureId}`, 
                        {
                            headers: {
                                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                                "Content-type": "application/json",
                                "Accept-Encoding": "application/json"
                            }
                        }
                    )
            data = response.data.response
            let event = new Events()
            event.fixtureId = fixture[i].fixtureId
            event.events = data
            await event.save()
        }
    
        res.status(200).send({
            status: true,
            message: "event data fetched!"
        })

    } catch(err) {
        res.status(200).send({
           error: err.message
        })
    }

}
