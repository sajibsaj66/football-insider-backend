const _ = require('lodash');
const { Transfers } = require('../../models/transfers/Transfers');
const {PaginationParameters} = require('mongoose-paginate-v2');
const { default: mongoose } = require('mongoose');


module.exports.transfers = async (req, res) => {  
    const playerId = req.query.id
    const transferIn = req.query.in
    const transferOut = req.query.out
    const all = req.query.all

    
    const inData = await Transfers.aggregate([
        {
            $match: {
                playerId: mongoose.Types.ObjectId(playerId)
            }
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'teamIn',
                foreignField: '_id',
                as: 'in'
            }
        }
    ])

    const inResult = []
    for (let d of inData) {
        const transferData = _.pick(d.in[0], ["id", "name", "logo"])
        transferData.date = d.date
        transferData.type = d.type
        inResult.push(transferData)
    }


    const outData = await Transfers.aggregate([
        {
            $match: {
                playerId: mongoose.Types.ObjectId(playerId)
            }
        },
        {
            $lookup: {
                from: 'teams',
                localField: 'teamOut',
                foreignField: '_id',
                as: 'out'
            }
        },
    ])

    const outResult = []
    for (let d of outData) {
        const transferData = _.pick(d.out[0], ["id", "name", "logo"])
        transferData.date = d.date
        transferData.type = d.type
        outResult.push(transferData)
    }



    return res.status(200).send({
        status: true,
        message: "transfer data fetched",
        data: req.query.in ? {"arrival": inResult} : req.query.out ? {"deperture": outResult} : {"arrival": inResult, "deperture": outResult}
    })
}
