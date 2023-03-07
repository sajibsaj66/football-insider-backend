const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const transfers = Schema({
    playerId: {
        type: Schema.Types.ObjectId
    },
    teamIn: Schema.Types.ObjectId,
    teamOut: Schema.Types.ObjectId,
    date : Date,
    type : String,
}, { timestamps: true });

transfers.plugin(pagination);
transfers.plugin(aggregatePaginate);

module.exports.Transfers = model('Transfers', transfers);