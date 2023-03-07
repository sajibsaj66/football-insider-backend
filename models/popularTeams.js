const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const popularTeamsSchema = Schema({
    name : {
        type: String
    },
    teamId: {
        type: String
    },
    code: {
        type: String
    },
    country: {
        type: String
    },
    founded: {
        type: String
    },
    national: {
        type: String
    },
    logo: {
        type: String
    },
    venue: {
        type: Schema.Types.Mixed
    }
}, { timestamps: true });

popularTeamsSchema.plugin(pagination);

module.exports.PopularTeams = model('PopularTeams', popularTeamsSchema);