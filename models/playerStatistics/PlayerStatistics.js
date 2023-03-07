const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const playerStatistics = Schema({
    league : {
        type: Schema.Types.ObjectId
    },
    player : {
        type: Schema.Types.ObjectId
    },
    team : {
        type: Schema.Types.ObjectId
    },
    season: {
        type: String
    },
    cards: {
        type: Schema.Types.Mixed
    },
    dribbles: {
        type: Schema.Types.Mixed
    },
    duels: {
        type: Schema.Types.Mixed
    },
    fouls: {
        type: Schema.Types.Mixed
    },
    games: {
        type: Schema.Types.Mixed
    },
    goals: {
        type: Schema.Types.Mixed
    },
    passes: {
        type: Schema.Types.Mixed
    },
    penalty: {
        type: Schema.Types.Mixed
    },
    shots: {
        type: Schema.Types.Mixed
    },
    substitutes: {
        type: Schema.Types.Mixed
    },
    tackles: {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

playerStatistics.plugin(pagination);

module.exports.PlayerStatistics = model('PlayerStatistics', playerStatistics);