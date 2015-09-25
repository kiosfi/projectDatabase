'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Projects) {

    return {

        create: function(req, res) {
            var project = new Project(req.body);

            project.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hanketta ei voi tallentaa'
                    });
                }

                Projects.events.publish({
                    action: 'created',
                    url: config.hostname + '/projects/' + project._id,
                    name: project.title
                });

                res.json(project);
            });
        },
         all: function(req, res) {
             var query = Project

             query.find(function(err, projects) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Hankkeita ei voi näyttää'
                     });
                 }

                 res.json(projects)
             });

         }
    };
}
