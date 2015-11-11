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
        Rejected = mongoose.model('Rejected'),
        Signed = mongoose.model('Signed'),
        Ended = mongoose.model('Ended'),
        Approved = mongoose.model('Approved'),
        IntReport = mongoose.model('IntReport'),
        EndReport = mongoose.model('EndReport'),
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
        /*
         * Loads a project for display and populates its state fields.
         */
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
            query
                    .populate([{path: 'organisation', model: 'Organisation'}, {path: 'in_review', model: 'InReview'},
                        {path: 'rejected', model: 'Rejected'}, {path: 'signed', model: 'Signed'},
                        {path: 'ended', model: 'Ended'}, {path: 'approved', model: 'Approved'}])
                    .exec(function (err, projects) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Hankkeita ei voi näyttää'
                            });
                        }
                        res.json(projects)
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
        /*
         * Moves a project to review state and saves the state object to
         * its collection.
         */
        addReview: function (req, res) {
            var in_review = new InReview(req.body.in_review);
            in_review.user = req.user.name;
            in_review.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui'
                    });
                }
            });
            var project = req.project;
            project.in_review = in_review._id;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys käsittelytilaan epäonnistui'
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
        /*
         * Updates project to contain data required in approved state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addApproved: function (req, res) {
            var approved = new Approved(req.body.approved);
            approved.user = req.user.name;
            approved.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }

            });
            var project = req.project;
            project.approved = approved._id;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys hyväksytyksi epäonnistui.'
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
        /*
         * Moves a project to rejected state and saves the state object to
         * its collection.
         */
        addRejected: function (req, res) {
            var rejected = new Rejected(req.body.rejected);
            rejected.user = req.user.name;
            rejected.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }
            });
            var project = req.project;
            project.rejected = rejected._id;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys hylätyksi epäonnistui.'
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
        /*
         * Moves a project to signed state and saves the state object to
         * its collection.
         */
        addSigned: function (req, res) {
            var signed = new Signed(req.body.signed);
            signed.user = req.user.name;
            signed.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }
            });
            var project = req.project;
            project.signed = signed._id;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys allekirjoitetuksi epäonnistui.'
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
        /*
         * Moves a project to ended state and saves the state object to
         * its collection.
         */
        addEnded: function (req, res) {
            console.log(req.body);
            var ended = new Ended(req.body.ended);
            ended.user = req.user.name;
            ended.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }
            });
            var project = req.project;
            project.ended = ended._id;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys hyväksytyksi epäonnistui.'
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

                /*
         * Moves a project to IntReport state (or adds another) and saves the state object to
         * its collection.
         */

           addIntReport: function (req, res) {
            var intReport = new IntReport(req.body.intermediary_report);
            intReport.user = req.user.name;
            intReport.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }
            });

            var project = req.project;
            project.intermediary_report.push(intReport._id);
            project.state = req.body.state;

            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Väliraportin lisääminen epäonnistui.'
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
        /*
         * Moves a project to endReport state and saves the state object to
         * its collection.
         */

        addEndReport: function (req, res) {
            var endReport = new EndReport(req.body.end_report);
            endReport.user = req.user.name;
            endReport.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Tilatietojen tallennus epäonnistui.'
                    });
                }
            });

            var project = req.project;
            project.end_report = endReport._id;
            project.state = req.body.state;

            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Loppuraportin lisääminen epäonnistui.'
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
