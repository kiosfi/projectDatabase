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
    /*function processRequest(req) {
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
    };*/

    return {
        twoParamsSearch: function (req, res) {
          console.log(req.query);
          Project.find(req.query)
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
        }

    };
}
