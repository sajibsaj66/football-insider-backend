const _ = require('lodash');
const { NationalTeams } = require('../../models/nationalTeams');
const {PaginationParameters} = require('mongoose-paginate-v2')


module.exports.getNationalTeams = async (req, res) => {  
    
    const page = req.query.page?req.query.page : 1
    const limit = req.query.limit?req.query.limit : 10
    const search = req.query.search || ""

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    res.json({
        status: true,
        // data: search == "" ? await NationalTeams.paginate({name: { $regex: search, $options: "i"}}, options) : await NationalTeams.find({name: { $regex: search, $options: "i"}}),
        data: await NationalTeams.paginate({name: { $regex: search, $options: "i"}}, options),
        message: 'Data fetched successfully'
    })
}
