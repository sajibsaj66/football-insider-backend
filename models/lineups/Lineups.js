const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const lineups = Schema({
    fixtureId : {
        type: String
    },
    lineups : {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

lineups.plugin(pagination);

module.exports.Lineups = model('Lineups', lineups);