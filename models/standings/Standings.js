const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const standings = Schema({
    leagueId : {
        type: String
    },
    name : {
        type: String
    },
    country : {
        type: String
    },
    logo : {
        type: String
    },
    flag : {
        type: String
    },
    season : {
        type: String
    },
    standings : {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

standings.plugin(pagination);

module.exports.Standings = model('Standings', standings);