const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const leagues = Schema({
    id : {
        type: Number
    },
    name : {
        type: String
    },
    type : {
        type: String
    },
    logo : {
        type: String
    },
    seasons: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

leagues.plugin(pagination);

module.exports.Leagues = model('Leagues', leagues);