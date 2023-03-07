const { Schema, model } = require('mongoose')
const pagination = require('mongoose-paginate-v2');

const headToHead = Schema({
    ids : {
        type: String
    },
    headToHead : {
        type: Schema.Types.Mixed
    },
}, { timestamps: true });

headToHead.plugin(pagination);

module.exports.HeadToHead = model('HeadToHead', headToHead);