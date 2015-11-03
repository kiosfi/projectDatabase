'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    States = mongoose.model('States'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Statechanges) {

    return {
        state: function(req, res, next, current_state) {
            States.load(current_state, function(err, state) {
                if (err) return next(err);
                if (!state) return next(new Error('Tilan ' + current_state + ' lataus epäonnistui.'));
                req.state = state;
                next();
              });
        },

         all: function(req, res) {
             var query = States.find();

             query.exec(function(err, states) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Tiloja ei voi näyttää'
                     });
                 }
                 res.json(states)
             });

         },

         show: function(req, res) {

             Statechanges.events.publish({
                 action: 'viewed',
                 name: req.state.current_state,
                 url: config.hostname + '/states/' + req.state.current_state
             });

             res.json(req.state);
         }
    };
}
