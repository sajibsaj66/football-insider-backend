const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const players = Schema({
    id : {
        type: String
    },
    name : {
        type: String
    },
    age: {
        type: String
    },
    birth: {
        type: Schema.Types.Mixed
    },
    firstname : {
        type: String
    },
    lastname : {
        type: String
    },
    height : {
        type: String
    },
    injured : {
        type: Boolean
    },
    nationality : {
        type: String
    },
    photo : {
        type: String
    },
    weight : {
        type: String
    }
}, { timestamps: true });

players.plugin(pagination);

module.exports.Players = model('Players', players);