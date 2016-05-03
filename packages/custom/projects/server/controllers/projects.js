
'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        config = require('meanio').loadConfig(),
        multiparty = require('multiparty'),
        util = require('util'),
        fs = require('fs'),
        mkdirp = require('mkdirp'),
        mime = require('mime'),
        _ = require('lodash');

module.exports = function (Projects) {

    return {
        project: function (req, res, next, id) {
            Project.load(id, function (err, project) {
                if (err) {
                    return next(err);
                }
                if (!project) {
                    if (err === null) {
                        return res.status(404).json({
                            status: 404,
                            message: 'Pyydettyä hanketta ei ole.'
                        });
                    }
                    return res.status(500).json({
                        status: 500,
                        message: 'Hankkeen lataus epäonnistui.'
                    });
                }
                req.project = project;
                next();
            });
        },
        create: function (req, res) {
            var project = new Project(req.body);

            var prefix = new Date(project.reg_date).getFullYear().toString().slice(-2);


            Project.find({project_ref: new RegExp('^' + prefix)}).count(function (err, count) {
                function pad(n) {
                    if (n < 10) {
                        return "00" + n
                    } else if (n >= 10 && n < 100) {
                        return "0" + n
                    } else {
                        return n
                    }
                }

                project.schema_version = 2;

                project.project_ref = prefix + pad(count + 1);
                project.organisation = req.body.organisation;

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
        /**
         * Loads a project for display.
         */
        show: function (req, res) {

            Projects.events.publish({
                action: 'viewed',
                name: req.project.title,
                url: config.hostname + '/projects/' + req.project._id
            });
            res.json(req.project);
        },
        /**
         * Update a project
         */
        update: function (req, res) {
            var project = req.project;

            project = _.extend(project, req.body);

            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hanketta ei voi päivittää'
                    });
                }

                Projects.events.publish({
                    action: 'updated',
                    user: {
                        name: req.user.name
                    },
                    name: project.title,
                    url: config.hostname + '/projects/' + project._id
                });

                res.json(project);
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
                return res.status(500).json({
                    error: 'Kyselystä puuttuu kenttä "ordering"!'
                });
            }
            if (typeof ascending === 'undefined') {
                return res.status(500).json({
                    error: 'Kyselystä puuttuu kenttä "ascending"!'
                });
            }
            if (typeof page === 'undefined') {
                return res.status(500).json({
                    error: 'Kyselystä puuttuu kenttä "page"!'
                });
            }

            var pageSize = 10;

            // We want to sort organisations by title, not by _id:
            if (ordering === 'organisation') {
                ordering = 'organisation.title';
            }
            var orderingJSON = {};
            orderingJSON[ordering] = ascending === 'true' ? 1 : -1;

            // Secondary sorting predicate will be "title", except for when the
            // primary was.
            if (ordering !== 'title') {
                orderingJSON["title"] = 1;
            } else {
                orderingJSON["project_ref"] = 1;
            }

            Project.find({}, {_id: 1, project_ref: 1, title: 1, state: 1,
                organisation: 1, intermediary_reports: 1}
            ).populate('organisation', {_id: 1, name: 1})
                    .sort(orderingJSON)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
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
            Project.count({}, function (error, result) {
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
                res.json(states);
            });
        },
        /**
         * Updates project to contain data required in review state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addReview: function (req, res) {
            var in_review = req.body.in_review;
            in_review.user = req.user.name;
            var project = req.project;
            project.in_review = in_review;
            project.state = req.body.state;
            project.required_appendices = req.body.required_appendices;
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
        /**
         * Updates project to contain data required in approved state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addApproved: function (req, res) {
            var approved = req.body.approved;
            approved.user = req.user.name;
            var project = req.project;
            project.approved = approved;
            project.state = req.body.state;
            project.funding.left_eur = approved.granted_sum_eur;
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
        /**
         * Updates project to contain data required in rejected state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addRejected: function (req, res) {
            var rejected = req.body.rejected;
            rejected.user = req.user.name;
            var project = req.project;
            project.rejected = rejected;
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
        /**
         * Updates project to contain data required in signed state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addSigned: function (req, res) {
            var signed = req.body.signed;
            signed.user = req.user.name;
            var project = req.project;
            project.signed = signed;
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
        /**
         * Updates project to contain payment data
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addPayment: function (req, res) {
            var payment = req.body.payment;
            var project = req.project;
            project.payments.push(payment);
            project.funding.paid_eur = project.funding.paid_eur +
                    payment.sum_eur;
            project.funding.left_eur = project.funding.left_eur -
                    payment.sum_eur;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Maksatuksen lisääminen epäonnistui.'
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

        /**
         * Updates project to contain a new appendix. The file will be written
         * in a data directory under "/packages/custom/projects/data". The
         * project document in the database will be updated to contain one extra
         * appendix entry in the field "appendices". The format for appendices
         * is: {"category": &lt;category of appendix as a string&gt;,
         * "custom_category": &lt;a custom category (only used when type is
         * 'Muu...')&gt;, "mime_type": &ltMIME type of the appendix file&gt,
         * "date": &lt;date when the appendix was added&gt;; "url": &lt;URL of
         * appendix file&gt; "number": &lt;(ordinal) number of the appendix&gt;}.
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addAppendix: function (req, res) {
            var tmpdir = "packages/custom/projects/data";
            var form = new multiparty.Form({uploadDir: tmpdir});
            form.parse(req, function(err, fields, files) {
                var now = new Date();
                var file = files.appendix_file[0];
                var appendix = {category: fields.appendix_category[0],
                    custom_category: fields.appendix_custom_category[0],
                    mime_type: file.headers["content-type"],
                    date: now.toISOString(),
                    original_name: file.originalFilename};
                Project.findOne({_id: fields.project_id}).
                        exec(function (err, project) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Hanketta ei voitu hakea tietokannasta.'
                        });
                    }
                    var newDir = tmpdir + "/" + project._id;
                    var pathParts = file.path.split("/");
                    var newFilename = pathParts[pathParts.length - 1];
                    mkdirp.sync(newDir);
                    fs.renameSync(file.path, newDir + "/" + newFilename);
                    appendix.url = "/api/projects/data/" + project._id +
                            "?appendix=" + newFilename;
                    if (project.appendices === undefined) {
                        project.appendices = [];
                    }
                    appendix.number = project.appendices.length === 0 ?
                            1 : project.appendices.length + 1;
                    project.appendices.push(appendix);
                    project.save(function (err) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Liitteen lisäys epäonnistui.'
                            });
                        }
                        Projects.events.publish({
                            action: 'updated',
                            name: project.title,
                            url: config.hostname + '/projects/' + project._id
                        });
                    });
                    res.writeHead(302, {'Location': '/projects/' +
                                fields.project_id});
                    res.end(util.inspect({fields: fields, files: files}));
                });
            });
        },

        /**
         * Accesses the requested appendix. The request URL should be in the
         * following format: "/projecs/data/" &lt;projectId&gt; "?appendix="
         * &lt;appendixId&gt; "&action=" &lt;download | delete&gt, where
         * &lt;projectId&gt; identifies the project and &lt;appendixId&gt; is
         * the name of the file being requested. The <tt>action</tt> variable
         * specifies the desired action. If the action is "download", the file
         * in question will be sent to the user, and if the action is "delete"
         * the file will be removed from the database and filesystem
         * immediately.
         *
         * @param {type} req    The request object (GET request).
         * @param {type} res    The response object.
         * @returns {undefined}
         */
        accessAppendix: function (req, res) {
            var path = "packages/custom" + req.url.replace("/api", "").
                    replace("?appendix=", "/").
                    replace("&action=download", "").
                    replace("&action=delete", "");
            if (req.url.match(/action=delete/)) {
                var projectID = path.split("/")[4];
                Project.findOne({_id: projectID}).exec(function (err, project) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Liitteen poisto epäonnistui.'
                        });
                    }
                    if (project.appendices.length === 1) {
                        // This is the special case where we're deleting the
                        // only appendix.
                        project.appendices = undefined;
                    } else {
                        var newAppendices = [];
                        var newNumber = 1;
                        var url = req.url.replace("&action=download", "").
                                replace("&action=delete", "");
                        project.appendices.forEach(function (item, index) {
                            if (item.url !== url) {
                                item.number = newNumber++;
                                newAppendices.push(item);
                            }
                        });
                        project.appendices = newAppendices;
                    }
                    project.save(function (err) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Liitteen poisto epäonnistui.'
                            });
                        }
                    });
                    fs.unlinkSync(path);
                    res.writeHead(302, {'Location': '/projects/' + projectID});
                    res.end();
                });
            } else {
                var mime_type = mime.lookup(path);
                fs.stat(path, function(error, stats) {
                    fs.open(path, "r", function(err, fd) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Liitteen haku epäonnistui.'
                            });
                        }
                        var buffer = new Buffer(stats.size);
                        fs.read(fd, buffer, 0, buffer.length, null, function(
                                error, bytesRead, buffer) {
                            res.writeHead(200, {
                                "Content-Type": mime_type,
                                "Content-Length": stats.size
                            });
                            res.end(buffer);
                            fs.close(fd);
                        });
                    });
                });
            }
        },

        /**
         * Updates project to contain data required in intermediary report state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addIntReport: function (req, res) {
            var intReport = req.body.intermediary_report;
            intReport.user = req.user.name;
            intReport.reportNumber = req.body.intermediary_report.reportNumber;

            var project = req.project;
            project.intermediary_reports.push(intReport);
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
        /**
         * Updates project to contain data required in end report state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addEndReport: function (req, res) {
            var endReport = req.body.end_report;
            endReport.user = req.user.name;

            var project = req.project;
            project.end_report = endReport;
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
        /**
         * Updates project to contain data required in ended state
         * @param {type} req project object to be updated, sent from frontend
         * @param {type} res project object after update
         * @returns updated project object in json to frontend, or error if
         *  updating not possible
         */
        addEnded: function (req, res) {
            var ended = req.body.ended;
            ended.user = req.user.name;
            var project = req.project;
            project.ended = ended;
            project.state = req.body.state;
            project.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Hankkeen päivitys päätetyksi epäonnistui.'
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
        /**
         * Deletes requested project from projects collection.
         * object {orgCount : &lt;n&gt;}, where &lt;n&gt; is the number of
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
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
        /**
         * Finds projects by organisationId and returns list of projects in json
         */
        byOrg: function (req, res) {
            Project.find({organisation: req.organisation})
                    .populate({path: 'organisation', model: 'Organisation'})
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
