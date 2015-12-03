'use strict';


var mongoose = require('mongoose'),
        Project = mongoose.model('Project'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        States = mongoose.model('States'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Search) {

    return {


      /**
       * @param {type} req    The request object.
       * @returns {JSON}
       */
        searchProjects: function (req, res) {
          var params = _.map(req.query, function(param) {
            return JSON.parse(param);
          });
          var queries = _.map(params, function(query) {
            var search = {};
            if (typeof query.value === 'string') {
              query.value = new RegExp(query.value, 'i');
            }
            search[query.field] = query.value;
            return search;
          });
          Project.find({$and: queries})
          .populate('organisation', {name: 1})
          .exec(function(err, searchResults) {
              if (err) {
                  return res.status(500).json({
                      error: 'Virhe hankkeiden hakutoiminnossa'
                  });
              } else {
                  console.log(searchResults);
                  res.json(searchResults);
                  
              }
          });
        }


    };
}
