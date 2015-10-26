'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    //Organisation = mongoose.model('Organisation'),
    //BankAccount = mongoose.model('BankAccount'),
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
            var organisation;
            var bank_account;

            Organisation.findOne({name: req.body.organisation.name}, function(err, obj) {
                if (!obj) {
                  organisation = new Organisation(req.body.organisation);
                  bank_account = new BankAccount(req.body.organisation.bank_account);
                  project.organisation = organisation._id;
                  organisation.bank_account = bank_account._id;
                  organisation.save();
                  bank_account.save();
                } else {
                  project.organisation = obj._id;
                }

                project.save(function(err) {
                  if (err) {
                      return res.status(500).json({
                          error: 'Hanketta ei voi tallentaa'
                      });
                  }
                  res.json(project);
                });

                Projects.events.publish({
                      action: 'created',
                      url: config.hostname + '/projects/' + project._id,
                      name: project.title
                });
            });
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
             var query = Project.find();

             query.sort({project_ref: 'asc'})
             .populate({path: 'organisation', model: 'Organisation'})
             .exec(function(err, projects) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Hankkeita ei voi näyttää'
                     });
                 }
                 res.json(projects)
             });

         },
         destroy: function(req, res) {
             var project = req.project;


             project.remove(function(err) {
                 if (err) {
                     return res.status(500).json({
                         error: 'Hankkeen poistaminen ei onnistu.'
                     });
                 }

                 Projects.events.publish({
                     action: 'deleted',
                     user: {
                         name: req.user.name
                     },
                     name: project.title
                 });

                 res.json(project);
             });
         }
    };
}
