const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const {HeadToHead} = require('../../models/headToHead/HeadToHead')
const { headers } = require('../../api/apiConfig');

module.exports.headToHead = async (req, res) => {
    const ids = req.query.h2h
    const headToHead = await HeadToHead.findOne({ids})
    if(headToHead) {
        res.status(200).send({
            status: true,
            message: "Head to head fetched",
            data: headToHead
        })
        try{
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead?h2h=${ids}`, headers)
            let h2h = response.data.response
            await HeadToHead.updateOne(
                {ids},
                {
                    $set: {
                        ids,
                        headToHead: h2h
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
            const response = await axios.get(`https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead?h2h=${ids}`, headers)
            let h2h = response.data.response
            const result = await HeadToHead({
                ids,
                headToHead: h2h
            })
            result.save()
    
            res.status(200).send({
                status: true,
                message: "Head to head fetched",
                data: result
            })
        }catch(error) {
            console.log(error)
        }
    }
}