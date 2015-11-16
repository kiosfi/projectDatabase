'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        InReview = mongoose.model('InReview'),
        User = mongoose.model('InReview'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Projects) {

    return {
        project: function (req, res, next, id) {
            Project.load(id, function (err, project) {
                if (err)
                    return next(err);
                if (!project)
                    return next(new Error('Hankkeen ' + id + ' lataus epäonnistui.'));

                req.project = project;

                next();
            });
        },
        in_review: function (req, res, next, id) {
            InReview.load(id, function (err, inrev) {
                if (err)
                    return next(err);
                if (!inrev)
                    return next(new Error('Tilan ' + id + ' lataus epäonnistui.'));

                req.in_review = inrev;

                next();
            });
        },
        showReview: function (req, res) {
            res.json(req.in_review);
        },
        create: function (req, res) {

            var project = new Project(req.body);
            var organisation;
            var bank_account;

            Organisation.findOne({name: req.body.organisation.name}, function (err, obj) {
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

                project.save(function (err) {
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
        show: function (req, res) {

            Projects.events.publish({
                action: 'viewed',
                name: req.project.title,
                url: config.hostname + '/projects/' + req.project._id
            });

            res.json(req.project);
        },
        all: function (req, res) {
            var query = Project.find();

            query.populate([{path: 'organisation', model: 'Organisation'},
                {path: 'in_review', model: 'InReview'}])
                    .exec(function (err, projects) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Hankkeita ei voi näyttää'
                            });
                        }
                        res.json(projects)
                    });
        },
        /**
         * Writes a cursor to JSON objects containing _id, project_ref, title,
         * state and organisation fields of the matching project documents into
         * the given response object. This function is used by the project list
         * view.
         *
         * @param {type} req The request object for the transaction (dummy
         * parameter).
         * @param {type} res The response object where the results will be
         * written into as JSON data.
         * @param {json} criterion  A MongoDB query document. Only documents
         * matching this criterion will be processed. Examples:
         * All projects having reference number greater than 15000:
         * "{project_ref : {$gt : 15000}}". All projects whose name ends with
         * "rights": "{title : {$regex: /\w*rights$/i}}" (case insensitive).
         * Empty document selects all projects.
         * @param {json} ordering   A MongoDB sort document. It is a JSON object
         * of the form {X_1 : Y_1, X_2 : Y_2, X_3 : Y_3, ... , X_n : Y_n} where
         * X_1 .. X_n are the names of the attributes used for sorting and
         * Y_1 .. Y_n are either 1 for ascending or -1 for descending ordering
         * by the corresponding attribute. Example:
         * "{project_ref : 1, project_title : 1}".
         * @param {Number} offset     Offset index i.e. the index of the first
         * matching document to be included. Used for paging the results.
         * @param {Number} count      Maximum count of results.
         *
         * @returns {undefined} This function has no return value.
         *
         * @see https://docs.mongodb.org/manual/core/crud-introduction/
         */
        getProjects: function (req, res) {
            var criterion = req.query.criterion;
            var ordering = req.query.ordering;
            var offset = req.query.offset;
            var count = req.query.count;
            res.json(Project.find(criterion, {_id: 1, project_ref: 1,
                title: 1, state: 1, organisation: 1}).sort(ordering).
                    skip(offset).limit(count));
        },

        allStates: function (req, res) {
            var query = States.find();
            query.exec(function (err, states) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tiloja ei voi näyttää'
                    });
                }
                res.json(states)
            });
        },
        addReview: function (req, res) {
            var project = req.project;
            var in_review = new InReview(req.body.in_review);
            in_review.user = req.user;
            project.in_review = in_review._id;
            project.state = req.body.state;

            in_review.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui'
                    });
                }
            });

            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys epäonnistui'
                    });
                }

                Projects.events.publish({
                    action: 'updated',
                    name: project.title,
                    url: config.hostname + '/projects/' + project._id
                });

                res.json(project);
            });

        },
        destroy: function (req, res) {
            var project = req.project;


            project.remove(function (err) {
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
        },
        /*
         * Finds projects by organisationId and returns list of projects in json
         */
        byOrg: function (req, res) {
            Project.find({organisation: req.organisation})
                    .exec(function (err, projects) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Järjestön hankkeiden lataaminen ei onnistu.'
                            });
                        }
                        res.json(projects);
                    });
        }


    };
}
