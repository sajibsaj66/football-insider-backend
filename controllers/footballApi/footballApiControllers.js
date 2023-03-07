const _ = require('lodash');
const { User } = require('../../models/user');
const axios = require('axios')


module.exports.getTeams = async (req, res) => {  
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
            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "All teams fetch successful",
                data: response.data
            })
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }       
}

// module.exports.getLeagues = async (req, res) => {  
//     const params = req.query
//     try {
//         const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/leagues`, {
//             params,
//             headers: {
//                 "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//                 "X-RapidAPI-Host": process.env.RAPID_API_HOST,
//                 "Content-type": "application/json",
//                 "Accept-Encoding": "application/json"
//             },
//         })
//             res.status(200).set('Content-Type', 'application/json').send({
//                 status: true,
//                 message: "All teams fetch successful",
//                 data: response.data
//             })
            
//     } catch(err) {
//         res.status(200).send({
//             status: false,
//             message: "Something went wrong, please try again!!",
//         })
//     } 
   
// }

module.exports.fixtures = async (req, res) => {
    const params = req.query
    try {
        const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures`, {
            params,
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                "Content-type": "application/json",
                "Accept-Encoding": "application/json"
            },
        })

        res.status(200).set('Content-Type', 'application/json').send({
            status: true,
            message: "Live match data fetch successful",
            data: response.data
        })
    
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!"
        })
    }       
}

// module.exports.headToHead = async (req, res) => {
//     const params = req.query
//     try {
//         const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead`, {
//             params,
//             headers: {
//                 "X-RapidAPI-Key": process.env.RAPID_API_KEY,
//                 "X-RapidAPI-Host": process.env.RAPID_API_HOST
//             },
//         })

//         res.status(200).set('Content-Type', 'application/json').send({
//             status: true,
//             message: "Head to head data fetch successful",
//             data: response.data
//         })
    
//     } catch(err) {
//         res.status(200).send({
//             status: false,
//             message: "Something went wrong, please try again!!"
//         })
//     }       
// }

module.exports.liveBet = async (req, res) => {
    const params = req.query
    try {
        const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/odds/live`, {
            params,
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                "Content-type": "application/json",
                "Accept-Encoding": "application/json"
            },
        })
            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "All live bet fetch successful",
                data: response.data
            })
            
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }  
}

module.exports.lineup = async (req, res) => {
    const params = req.query
    try {
        const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups`, {
            params,
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                "Content-type": "application/json",
                "Accept-Encoding": "application/json"
            },
        })
            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "All players and lineups fetch successful",
                data: response.data
            })
            
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }  
}

module.exports.statistics = async (req, res) => {
    const params = req.query
    try {
        const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/statistics`, {
            params,
            headers: {
                "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                "X-RapidAPI-Host": process.env.RAPID_API_HOST,
                "Content-type": "application/json",
                "Accept-Encoding": "application/json"
            },
        })
            res.status(200).set('Content-Type', 'application/json').send({
                status: true,
                message: "Team statistics fetch successful",
                data: response.data
            })
            
    } catch(err) {
        res.status(200).send({
            status: false,
            message: "Something went wrong, please try again!!",
        })
    }  
}
