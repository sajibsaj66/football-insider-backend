const _ = require('lodash');
const { Leagues } = require('../../models/leagues/Leagues');
const {PaginationParameters} = require('mongoose-paginate-v2')


module.exports.leagueDetails = async (req, res) => {  
    const id = parseInt(req.params.leagueId)
    console.log("the id",id)
    try {
        const leagueDetails = await Leagues.findOne({id})
        return  res.status(200).send({
                    status: true,
                    data: leagueDetails,
                    message: leagueDetails ? 'Data fetched successfully' : 'No league data available'
                })   
    } catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
}

module.exports.getLeagues = async (req, res) => {  
    
    const page = req.query.page?req.query.page : 1
    const limit = req.query.limit?req.query.limit : 10
    const search = req.query.search || ""

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }
    res.json({
        status: true,
        data: await Leagues.paginate({name: { $regex: search, $options: "i"}}, options),
        message: 'Data fetched successfully'
    })
}

module.exports.leaguesSuggestions = async (req, res) => {
    const data = await Leagues.aggregate([ { $sample : { size: 4} } ])
    let result = []
    for( d of data ) {
        result.push(_.pick(d, ["id", "name", "logo"]))
    }
    res.status(200).send({
        status: true,
        message : "Leagues suggestions fetched",
        data : result
    })
}
