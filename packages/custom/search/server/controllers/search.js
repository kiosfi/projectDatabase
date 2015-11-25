'use strict';



module.exports = function (Search) {

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

