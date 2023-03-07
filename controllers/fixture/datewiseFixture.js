const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { Fixtures } = require('../../models/fixtures/Fixtures');
const { headers } = require('../../api/apiConfig');

module.exports.datewiseFixtures = async (req, res) => {  
    try {
        const date = req.query.date
        const timezone = req.query.timezone
        const page = req.query.page?req.query.page : 1
        const limit = req.query.limit?req.query.limit : 10
    
        let dateTime = moment.tz(date, timezone)
        let toUtc = dateTime.utc().format()
        
        let dateToQuery = toUtc.split("T")[0]
        console.log(dateToQuery)
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        }
    
        const result = await Fixtures.find({date: dateToQuery})
        if(result.length !== 0) {
            return res.status(200).send({
                status: true,
                message: 'fetched successfully',
                data: await Fixtures.paginate({date: dateToQuery}, options)
            })
        } else {
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${dateToQuery}`, headers)
            const data = response.data.response
            for(const d of data) {
                const fixture = await Fixtures.findOne({fixtureId: d.fixture.id})
                if(fixture) {
                    await Fixtures.updateMany(
                        {fixtureId: d.fixture.id}, 
                        {
                            $set: {
                                fixtureId : d.fixture.id,
                                referee : d.fixture.referee,
                                timezone : d.fixture.timezone,
                                status : d.fixture.status.long,
                                statusCode : d.fixture.status.short,
                                elapsed : d.fixture.status.elapsed,
                                date : d.fixture.date.split("T")[0],
                                isoDate : d.fixture.date,
                                timestamp : d.fixture.timestamp,
                                periods : d.fixture.periods,
                                venue : d.fixture.venue,
                                league : d.league,
                                teams : d.teams,
                                goals : d.goals,
                                score : d.score
                            }
                        }
                    )
                    console.log("updated")
                } else {
                    let fixture = new Fixtures();
                    fixture.fixtureId = d.fixture.id
                    fixture.referee = d.fixture.referee
                    fixture.timezone = d.fixture.timezone
                    fixture.status = d.fixture.status.long
                    fixture.statusCode = d.fixture.status.short
                    fixture.elapsed = d.fixture.status.elapsed
                    fixture.date = d.fixture.date.split("T")[0]
                    fixture.isoDate = d.fixture.date
                    fixture.timestamp = d.fixture.timestamp
                    fixture.periods = d.fixture.periods
                    fixture.venue = d.fixture.venue
                    fixture.league = d.league
                    fixture.teams = d.teams
                    fixture.goals = d.goals
                    fixture.score = d.score
                    await fixture.save()
                }
            }
            return res.status(200).send({
                status: true,
                message: 'Data fetched successfully',
                data: await Fixtures.paginate({date: dateToQuery}, options)
            })
        }
        
    } catch (error) {
        return res.status(200).send({
            status: false,
            message: error.message
        })
    }
}