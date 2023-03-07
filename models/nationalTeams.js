const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const nationalTeamsSchema = Schema({
    name : {
        type: String
    },
    code : {
        type: String
    },
    flag : {
        type: String
    },
}, { timestamps: true });

nationalTeamsSchema.plugin(pagination);

module.exports.NationalTeams = model('NationalTeams', nationalTeamsSchema);