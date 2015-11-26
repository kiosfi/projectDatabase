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
        searchAll: function (req, res) {
          var title = new RegExp(req.query.title, "i");
          var description = new RegExp(req.query.description, "i");
          var description_en = new RegExp(req.query.description_en, "i");

          var query = Project.find({ $or:[ {'title':title}, {'description':description}, {'description_en': description_en} ]});
          query
          .populate('intermediary_reports payments')
          .populate([
            {path: 'organisation', model: 'Organisation'},
            {path: 'in_review', model: 'InReview'},
            {path: 'approved', model: 'Approved'},
            {path: 'rejected', model: 'Rejected'},
            {path: 'signed', model: 'Signed'},
            {path: 'end_report', model: 'EndReport'},
            {path: 'ended', model: 'Ended'}
          ])
          .exec(function(err, searchResults) {
                console.log(searchResults)
                if (err) {
                    return res.status(500).json({
                        error: 'Virhe hankkeiden hakutoiminnossa'
                    });
                } else {
                    res.json(searchResults);
                }
            });
        },

        all: function (req, res) {
            var query = Project.find();
            query
                .populate([{path: 'organisation', model: 'Organisation'}, {path: 'in_review', model: 'InReview'},
                    {path: 'rejected', model: 'Rejected'}, {path: 'signed', model: 'Signed'},
                    {path: 'ended', model: 'Ended'}, {path: 'approved', model: 'Approved'},
                    {path: 'intermediary_reports.intermediary_report', model: 'IntReport'}])
                .exec(function (err, projects) {
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
