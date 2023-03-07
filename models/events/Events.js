const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const events = Schema({
    fixtureId : {
        type: String
    },
    events : {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

events.plugin(pagination);

module.exports.Events = model('Events', events);