const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const teamSeasons = Schema({
    team : {
        type: String
    },
    season: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

teamSeasons.plugin(pagination);

module.exports.TeamSeasons = model('TeamSeasons', teamSeasons);