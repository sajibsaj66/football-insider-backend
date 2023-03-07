const axios = require('axios')
const _ = require('lodash');
const {Fixtures} = require('../models/fixtures/Fixtures')
const {Lineups} = require('../models/lineups/Lineups')
const {todayYYMMDD} = require('../helpers/date/dateHelper')

module.exports.fetchLineups = async (req, res) => {
    let fixture = await Fixtures.find()
    try{

        for(let i = 0; i <fixture.length; i++) {
            console.log(fixture[i].fixtureId)
            const response = await axios.get(
                    `https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups?fixture=${fixture[i].fixtureId}`, 
                        {
                            headers: {
                                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                                "Content-type": "application/json",
                                "Accept-Encoding": "application/json"
                            }
                        }
                    )
            let data = response.data.response
            // console.log(data)
            let lineups = new Lineups()
            lineups.fixtureId = fixture[i].fixtureId
            lineups.lineups = data
            await lineups.save()
            console.log(i+1, "done")
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
