const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const fixtures = Schema({
    fixtureId : {
        type: String
    },
    referee : {
        type: String
    },
    timezone : {
        type: String
    },
    date : {
        type: String
    },
    isoDate : {
        type: String
    },
    timestamp: {
        type: String
    },
    status: {
        type: String
    },
    statusCode: {
        type: String
    },
    elapsed: {
        type: String
    },
    periods: {
        type: Schema.Types.Mixed
    },
    venue: {
        type: Schema.Types.Mixed
    },
    league: {
        type: Schema.Types.Mixed
    },
    teams: {
        type: Schema.Types.Mixed
    },
    goals: {
        type: Schema.Types.Mixed
    },
    score: {
        type: Schema.Types.Mixed
    },
    events: {
        type: Schema.Types.Mixed
    },
    live: {
        type: Boolean
    },
}, { timestamps: true });

fixtures.plugin(pagination);
fixtures.plugin(aggregatePaginate);

module.exports.Fixtures = model('Fixtures', fixtures);