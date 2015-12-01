'use strict';
var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

var StatesSchema = new Schema({
    current_state: {
        type: String,
        required: true
    },
    next_states: {
        type: Array
    }
});

StatesSchema.statics.load = function (current_state, cb) {
    this.findOne({
        current_state: current_state
    }).exec(cb);
};

module.exports = mongoose.model('States', StatesSchema);
