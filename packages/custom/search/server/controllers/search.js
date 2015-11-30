'use strict';


var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Search) {

    var pageSize = 10;

    /**
     * Processes thre request object returning a JSON object containing the
     * fields for ordering, skip and limit.
     *
     * @param {type} req    The request object.
     * @returns {JSON}
     */
    function processRequest(req) {
        var ordering = req.query.ordering;
        var ascending = req.query.ascending;
        var page = req.query.page;
        if (typeof ordering === 'undefined') {
            ordering = 'state';
        }
        if (typeof ascending === 'undefined') {
            ascending = 'true';
        }
        if (typeof page === 'undefined') {
            page = 1;
        }
        var orderingJSON = {};
        orderingJSON[ordering] = ascending === 'true' ? 1 : -1;
        return {"sort": orderingJSON, "skip": (page - 1) * pageSize,
            "limit": pageSize};
    };

    return {
        searchByTitle: function (req, res) {

          var param = new RegExp(req.query.title, 'i');
          Project.find({title: param}, {_id: 1, project_ref: 1, title: 1,
              organisation: 1, description: 1})
          .populate('organisation', {name: 1})
          .exec(function(err, searchResults) {
              if (err) {
                  return res.status(500).json({
                      error: 'Virhe hankkeiden hakutoiminnossa'
                  });
              } else {
                  res.json(searchResults);
              }
          });
        },
        searchByState: function (req, res) {
            var params = processRequest(req);

            Project.find({state: req.query.state}, {_id: 1, project_ref: 1,
                title: 1, organisation: 1, description: 1})
                    .sort(params.sort)
                    .skip(params.skip)
                    .limit(params.limit)
                    .populate('organisation', {_id: 1, name: 1})
                    .exec(function (err, searchResults) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json(searchResults);
                        }
                    });
        },

        searchByOrg: function (req, res) {
            var params = processRequest(req);
            Organisation.find({'name': new RegExp(req.params.tag, 'i')},
            function (err, organisations) {
                if (err) {
                    return res.status(500).json({
                        error: 'Järjestön lataaminen ei onnistu.'
                    });
                }

                organisations = organisations.map(function (organisation) {
                    return organisation._id;
                });

                Project.find({organisation: {$in: organisations}}, {_id: 1,
                    project_ref: 1, title: 1, organisation: 1, description: 1})
                        .populate('organisation', {name: 1})
                        .exec(function (err, projects) {
                            if (err) {
                                return res.status(500).json({
                                    error: 'Järjestön lataaminen ei onnistu.'
                                });
                            }
                            res.json(projects);
                        });
            }).sort(params.sort).skip(params.skip).limit(params.limit);
        },

        searchByRegion: function (req, res) {
            var params = processRequest(req);
            Project.find({region: new RegExp(req.query.region, 'i')},
            {_id: 1, project_ref: 1, title: 1,
                organisation: 1, description: 1})
                    .sort(params.sort)
                    .skip(params.skip)
                    .limit(params.limit)
                    .populate('organisation', {name: 1})
                    .exec(function (err, searchResults) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json(searchResults);
                        }
                    });
        },

        searchByTheme: function (req, res) {
            var params = processRequest(req);
            Project.find({"approved.themes": req.params.tag}, function (err, results) {

                if (err) {
                    return res.status(500).json({
                        error: 'Teemojen lataaminen ei onnistu.'
                    });
                }

                res.json(results);
              }).sort(params.sort).skip(params.skip).limit(params.limit);
        }

    };
}
