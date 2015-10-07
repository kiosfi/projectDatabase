'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Organisation = mongoose.model('Organisation'),
    BankAccount = mongoose.model('BankAccount'),
    config = require('meanio').loadConfig(),
    _ = require('lodash');

module.exports = function(Projects) {

    return {
        project: function(req, res, next, id) {
            Project.load(id, function(err, project) {
                if (err) return next(err);
                if (!project) return next(new Error('Hankkeen ' + id + ' lataus epäonnistui.'));
                req.project = project;
                next();
              });
        },

        create: function(req, res) {

            var project = new Project(req.body);
            var organisation = new Organisation(req.body.organisation);
            var bank_account = new BankAccount(req.body.organisation.bank_account);
            bank_account.save();
            organisation.bank_account = bank_account._id;

            Organisation.findOne({name: organisation.name}, function(err, obj) {
                if (!obj) {
                  project.organisation = organisation._id;
                  organisation.save();
                } else {
                  project.organisation = obj._id;
                }
                project.save(function(err) {
                  if (err) {
                      return res.status(500).json({
                          error: 'Hanketta ei voi tallentaa'
                      });
                  }
                });
            });

              Projects.events.publish({
                  action: 'created',
                  url: config.hostname + '/projects/' + project._id,
                  name: project.title
              });

              res.json(project);
        },

        show: function(req, res) {

            Projects.events.publish({
                action: 'viewed',
                name: req.project.title,
                url: config.hostname + '/projects/' + req.project._id
            });

            res.json(req.project);
        },

         all: function(req, res) {
             var query = Project.find()

             query.populate({path: 'organisation', model: 'Organisation'}).exec(function(err, projects) {
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
