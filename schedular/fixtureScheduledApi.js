const axios = require('axios')
const _ = require('lodash');
const {Fixtures} = require('../models/fixtures/Fixtures')
const {Events} = require('../models/events/Events')

const {todayYYMMDD} = require('../helpers/date/dateHelper')


module.exports.fetchLive = async (req, res) => {  
    let data = []
    try {
        const response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/fixtures", 
                {
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                        "Content-type": "application/json",
                        "Accept-Encoding": "application/json"
                    },
                    params:{
                        live:'all'
                    }
                }
            )

            data = response.data.response

            console.log("number of live data : ",data.length)
            for(const d of data) {
                let isDataExists = await Fixtures.findOne({ fixtureId: d.fixture.id });
                if(isDataExists != null) {
                    await Fixtures.updateMany(
                        {fixtureId: d.fixture.id}, 
                        {$set: {
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
                            score : d.score,
                            live: true
                        }}
                    )
                    // updating events
                    const events = d.events
                    const fixtureId = d.fixture.id
                    const eventsLocal = await Events.find({fixtureId})
                    if (events && eventsLocal) {
                        await Events.updateOne(
                            { fixtureId: fixtureId},
                            {$set: {
                                events : events
                            }}
                        )
                    }
                } else {
                    let fixture = {}
                    fixture = new Fixtures();
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
                    fixture.live = true
                    const result = await fixture.save()
                    const events = d.events 
                    // storing events
                    const fixtureId = d.fixture.id
                    const eventsLocal = await Events.find({fixtureId})
        
                    if (events && eventsLocal != null) {
                        let event = new Events()
                        event.fixtureId = fixtureId
                        event.events = events
                        await event.save()
                    }
                }
            }
    } catch(err) {
        console.log(err.message)
    }       
}

module.exports.fetchToday = async (req, res) => {
    let data = []
    try {
        const response = await axios.get(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${todayYYMMDD}`, 
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
            console.log("number of today's data : ",data.length)

            for(const d of data) {
                let isDataExists = await Fixtures.findOne({ fixtureId: d.fixture.id });
                if(isDataExists) {
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
                } else {
                    let fixture = {}
                    fixture = new Fixtures();
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

    } catch(error) {
        console.log(error.message)
    }
}

