const _ = require('lodash');
const moment = require('moment-timezone');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { Fixtures } = require('../../models/fixtures/Fixtures');

module.exports.matchDetails = async (req, res) => {  
    
    const id = req.params.id
    const data = await Fixtures.findOne({"_id" : id})
    
    res.status(200).send({
        status: true,
        message: 'Data fetched successfully',
        data
    })
}
