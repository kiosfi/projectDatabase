'use strict';


var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Search) {

    /**
     * Maximum number of search results to be displayed when using paginated
     * search function.
     */
    var pageSize = 10;

    /**
     *
     * @param {JSON} searchBy
     * @returns {JSON}
     */
    function processQuery(searchBy) {
        return _.map(JSON.parse(searchBy), function (query) {
            var search = {};
            if (typeof query.value === 'string') {
                query.value = new RegExp(query.value, 'i');
            }
            search[query.field] = query.value;
            return search;
        });
    }

    return {
        /**
         * Searches for projects. The results are ordered and paginated
         * according to the given HTTP GET parameters in the request object.
         *
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
            var queries = processQuery(req.query.searchBy);
            console.log(queries);

            Project.find({$and: queries})
                    .sort(ordering)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .populate('organisation', {name: 1})
                    .exec(function (err, results) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json(results);
                        }
                    });
        },
        /**
         * Returns all projects matching the given search query in the HTTP GET
         * parameter <tt>searchBy</tt>.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        searchAllProjects: function (req, res) {
            var queries = processQuery(req.query.searchBy);

            Project.find({$and: queries})
                    .populate('organisation', {name: 1})
                    .exec(function (err, results) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json(results);
                        }
                    });
        },
        /**
         * Returns the number of all projects matching the search query given by
         * the HTTP GET parameter <tt>searchBy</tt>.
         *
         * @param {type} req
         * @param {type} res
         * @returns {undefined}
         */
        countSearchResults: function (req, res) {
            var queries = processQuery(req.query.searchBy);

            Project.count({$and: queries})
                    .populate('organisation', {name: 1})
                    .exec(function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json({projectCount: result});
                        }
                    });
        }

    };
}
