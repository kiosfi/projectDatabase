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

    return {
        /**
         * @param {type} req    The request object.
         * @returns {JSON}
         */
        searchProjects: function (req, res) {
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
            var queries = _.map(JSON.parse(req.query.searchBy), function (query) {
                var search = {};
                if (typeof query.value === 'string') {
                    query.value = new RegExp(query.value, 'i');
                }
                search[query.field] = query.value;
                return search;
            });

            Project.find({$and: queries})
                    .sort(ordering)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
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
        }

    };
}
