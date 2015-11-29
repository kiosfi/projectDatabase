'use strict';


var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        InReview = mongoose.model('InReview'),
        Rejected = mongoose.model('Rejected'),
        Signed = mongoose.model('Signed'),
        Payment = mongoose.model('Payment'),
        Ended = mongoose.model('Ended'),
        Approved = mongoose.model('Approved'),
        IntReport = mongoose.model('IntReport'),
        EndReport = mongoose.model('EndReport'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Search) {

    return {
        searchByState: function (req, res) {

            Project.find({state: req.query.state})
            .populate({path: 'organisation', model: 'Organisation'})
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

        searchByOrg: function (req, res) {

            var param = new RegExp(req.params.tag, 'i');

            Organisation.find({'name': param}, function (err, organisations) {
                if (err) {
                    return res.status(500).json({
                        error: 'Järjestön lataaminen ei onnistu.'
                    });
                }

                organisations = organisations.map(function(organisation) {
                      return organisation._id;
                });

                Project.find({organisation: {$in: organisations}})
                .populate({path: 'organisation', model: 'Organisation'})
                .exec(function(err, projects) {
                    if (err) {
                        return res.status(500).json({
                            error: 'Järjestön lataaminen ei onnistu.'
                        });
                    }
                    res.json(projects)
                });
            });
        },

        searchByRegion: function (req, res) {

            var param = new RegExp(req.query.region, 'i');

            Project.find({region: param})
            .populate({path: 'organisation', model: 'Organisation'})
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

        searchByTheme: function (req, res) {

            Approved.find({themes: req.params.tag}, function(err, results) {

              if (err) {
                  return res.status(500).json({
                      error: 'Teemojen lataaminen ei onnistu.'
                    });
              }

              results = results.map(function(result) {
                  return result._id
              });

              Project.find({approved: {$in: results}})
              .populate({path: 'organisation', model: 'Organisation'})
              .exec(function(err, projects) {
                  if (err) {
                      return res.status(500).json({
                          error: 'Teemojen lataaminen ei onnistu.'
                      });
                  }

                  res.json(projects);
              });
          });
        }

    };
}
