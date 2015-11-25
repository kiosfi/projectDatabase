'use strict';



module.exports = function (Search) {

    return {
        searchAll: function (req, res) {
            Search.find({'tag': req.params.tag}).sort('-project_ref').populate('title').exec(function(err, searchResults) {
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

