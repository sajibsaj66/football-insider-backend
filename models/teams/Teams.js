const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const teams = Schema({
    id : {
        type: String
    },
    code : {
        type: String
    },
    country: {
        type: String
    },
    founded : {
        type: String
    },
    logo : {
        type: String
    },
    name : {
        type: String
    },
    national : {
        type: Boolean
    }
}, { timestamps: true });

teams.plugin(pagination);

module.exports.Teams = model('Teams', teams);