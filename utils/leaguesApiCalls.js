const axios = require('axios')
const _ = require('lodash');
const {Leagues} = require('../models/leagues/Leagues')

module.exports.fetchLeagues = async (req, res) => {  
    let data = []
    const params = req.query
    try {
        const response = await axios.get(
            "https://api-football-v1.p.rapidapi.com/v3/leagues", 
                {
                    params,
                    headers: {
                        "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                        "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                        "Content-type": "application/json",
                        "Accept-Encoding": "application/json"
                    }
                }
            )
            data = response.data.response
            for(let i = 0; i <data.length; i++) {
                let leagues = {}
                leagues = new Leagues(_.pick(data[i].league, ["name", "type", "logo"]));
                leagues.id = data[i].league.id
                leagues.seasons = data[i].seasons
                const result = await leagues.save()
            }

            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "All leagues fetch successful",
                data
            })
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }       
}