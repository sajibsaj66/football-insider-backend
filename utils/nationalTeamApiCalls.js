const axios = require('axios')
const _ = require('lodash');
const {NationalTeams} = require('../models/nationalTeams')

module.exports.fetchNationalTeams = async (req, res) => {  
    let data = []
    try {
        const response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/countries", 
                {
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                        "X-RapidAPI-Host": process.env.RAPID_API_HOST
                    }
                }
            )
            data = response.data.response
            for(let i = 0; i <data.length; i++) {
                let teams = {}
                teams = new NationalTeams(data[i]);
                const result = await teams.save()
            }

            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "All teams fetch successful",
            })
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }       
}