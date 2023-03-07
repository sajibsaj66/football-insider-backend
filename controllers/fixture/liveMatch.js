const _ = require('lodash');
const axios = require('axios');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { Fixtures } = require('../../models/fixtures/Fixtures');
const { todayYYMMDD } = require('../../helpers/date/dateHelper');

module.exports.getLives = async (req, res) => {     
    let data = []
    try {
        data = await Fixtures.find({"live" : true})
        const result = []
        for(let i = 0; i < data.length; i++) {
            if( Date.parse(data[i].updatedAt) + 300000 < Date.now() ) {
                    await Fixtures.updateOne(
                        {fixtureId: data[i].fixtureId},
                        {$set: {
                            "statusCode": "FT",
                            "status": "Match Finished",
                            "live": false
                        }}
                    )
            } else {
                let pick = _.pick(data[i], ["_id", "fixtureId", "status", "elapsed", "league.name", "teams", "goals", "date" ])
                result.push(pick)
            }
        }
        return res.status(200).send({
            status: true,
            message: 'Data fetched successfully',
            data: result
        }) 
    } catch(err) {
        console.log(err.message)
    }  
}
// module.exports.getLives = async (req, res) => {     
//     let data = []
//     try {
//         data = await Fixtures.find({"statusCode" : {"$in": ["1H", "HT", "2H", "ET", "BT", "P"]}})
//         const result = []
//         for(let i = 0; i < data.length; i++) {
//             let pick = _.pick(data[i], ["_id", "fixtureId", "status", "elapsed", "league.name", "teams", "goals" ])
//             result.push(pick)
//         }
//         return res.status(200).send({
//             status: true,
//             message: 'Data fetched successfully',
//             data: result
//         }) 
//     } catch(err) {
//         console.log(err.message)
//     }  
// }