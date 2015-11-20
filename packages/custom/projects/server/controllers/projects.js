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
         * Gets all projects.
         *
         * @param {type} req    The request object. It should contain the
         * following GET-parameters: <tt>ordering</tt>, <tt>ascending</tt>, and
         * <tt>page</tt>. The results will be sorted primarily by
         * <tt>ordering</tt> and in ascending order if <tt>ascending</tt> was
         * "true". Additionally, this function will take care of paging the
         * results and only displaying the page requested with <tt>page</tt>.
         * @param {type} res    The response object. The results of this query
         * will be stored as JSON objects consisting of the form
         * {_id: X_1, project_ref: X_2, organisation: {_id: Y_1, name: Y_2},
         * title: X_3, state: X_4}, where X_1 .. X_4 are values from from
         * Project schema and Y_1, Y_2 are from Organisation schema.
         * @returns {undefined}
         */
        getProjects: function (req, res) {
            var ordering = req.query.ordering;
            var ascending = req.query.ascending;
            var page = req.query.page;
            if (typeof ordering === 'undefined') {
                ordering = 'project_ref';
            }
            if (typeof ascending === 'undefined') {
                ascending = true;
            }
            if (typeof page === 'undefined') {
                page = 1;
            }

            var pageSize = 10;

            // We want to sort organisations by title, not by _id:
            if (ordering === 'organisation') {
                ordering = 'organisation.title';
            }
            var orderingJSON = {};
            orderingJSON[ordering] = ascending === "true" ? 1 : -1;

            // Secondary sorting predicate will be title, except for when the
            // primary was.
            if (ordering !== 'title') {
                orderingJSON["title"] = 1;
            } else {
                orderingJSON["project_ref"] = 1;
            }
            console.log(JSON.stringify(orderingJSON));

            Project.find({}, {_id: 1, project_ref: 1, title: 1, state: 1,
                organisation: 1}
            ).sort(orderingJSON)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .populate('organisation', {_id: 1, name : 1})
            .exec(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeita ei voi näyttää'
                    });
                }
                res.json(result);
            });
        },
        /**
         * Writes the number of projects present at the database as a json
         * object {projectCount : &lt;n&gt;}, where &lt;n&gt; is the number of
         * projects.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        countProjects: function (req, res) {
            Project.count({}, function(error, result) {
                res.json({projectCount: result});
            });
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
