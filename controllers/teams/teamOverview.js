const _ = require('lodash');
const axios = require('axios');
const { headers } = require('../../api/apiConfig');
const jwt_decode = require('jwt-decode')
const {User} = require('../../models/user')
const { Fixtures } = require('../../models/fixtures/Fixtures')
const {Teams} = require('../../models/teams/Teams')
const { default: mongoose } = require('mongoose');

module.exports.teamNextMatch = async (req, res) => {
    const teamId = parseInt(req.query.id)
    const result = await Fixtures.aggregate([
        {
            "$match": {
                "$and": [
                    {
                        "$or": [
                            {"teams.home.id": teamId},
                            {"teams.away.id": teamId}
                        ]
                    },
                    {"statusCode": "NS"}
                ]
            }
        }
    ])

    if (result.length != 0) {
        return res.status(200).send({
            status: true,
            message: "Team overview fetched",
            data: result
        })
    } else {
        const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?next=1&team=${teamId}`, headers)
        const data = response.data.response[0]
        let fixture = new Fixtures();
            fixture.fixtureId = data.fixture.id
            fixture.referee = data.fixture.referee
            fixture.timezone = data.fixture.timezone
            fixture.status = data.fixture.status.long
            fixture.statusCode = data.fixture.status.short
            fixture.elapsed = data.fixture.status.elapsed
            fixture.date = data.fixture.date.split("T")[0]
            fixture.isoDate = data.fixture.date
            fixture.timestamp = data.fixture.timestamp
            fixture.periods = data.fixture.periods
            fixture.venue = data.fixture.venue
            fixture.league = data.league
            fixture.teams = data.teams
            fixture.goals = data.goals
            fixture.score = data.score
        const result = await fixture.save()
        return res.status(200).send({
            status: true,
            message: "Team overview fetched",
            result
        })
        // try {
            
        // } catch (error) {
        //     return res.status(400).send({status: false, message: error.message})
        // }
    }
}

module.exports.teamPreviousMatch = async (req, res) => {
    const teamId = parseInt(req.query.id)
    const page = req.query.page?req.query.page : 1
    const limit = req.query.limit?req.query.limit : 10

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
    }

    try{
        const aggregate = await Fixtures.aggregate([
            {
                "$match": {
                    "$and": [
                        {
                            "$or": [
                                {"teams.home.id": teamId},
                                {"teams.away.id": teamId}
                            ]
                        },
                        {"statusCode": {"$in": ["SUSP", "FT", "AET", "PEN", "PST", "CANC", "ABD", "WO"]}}
                    ]
                }
            }
        ])
        const result = await Fixtures.aggregatePaginate(aggregate, options)
        if(aggregate.length != 0) {
            return res.status(200).send({
                status: true,
                message: "Previous matches fetched",
                data: result
            })
        } else {
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures?last=5&team=${teamId}`, headers)
            const data = response.data.response
            for (let d of data) {
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
            return res.status(200).send({
                status: true,
                message: "Previous matches fetched",
                data : await Fixtures.aggregatePaginate(aggregate, options)
            })
            // return res.status(200).send({
            //     status: false,
            //     message: "No previous matches data found",
            //     data
            // })
        }
    } catch( error ) {
        res.send({message: error.message})
    }
}