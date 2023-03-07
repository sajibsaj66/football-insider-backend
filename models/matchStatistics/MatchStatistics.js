const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const matchStatistics = Schema({
    fixtureId : {
        type: String
    },
    stats : {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

matchStatistics.plugin(pagination);

module.exports.MatchStatistics = model('MatchStatistics', matchStatistics);