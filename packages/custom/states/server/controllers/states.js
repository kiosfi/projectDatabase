'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    States = mongoose.model('States'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Projects) {

    return {

         all: function(req, res) {
             var query = States.find();

             query.exec(function(err, projects) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Tiloja'
                     });
                 }
                 res.json(states)
             });

         }
    };
}
