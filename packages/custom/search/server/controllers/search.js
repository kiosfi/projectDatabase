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
     * Formulates received search query depending on the type of
     * data searched
     * @param {JSON}
     * @returns {JSON}
     */

    function prepareQueries(searchBy) {

        /**
        * Formats queries to correct form
        */

      return _.map(JSON.parse(searchBy), function (query) {
            var search = {};

            if (query.value === 'payments') {
              query.field = 'payments';
                query.value = {$exists: true, $gt: {$size: 0}};
            }
            if (query.value === 'approved.granted_sum_eur') {
              query.field = 'approved.granted_sum_eur';
              query.value =  {$exists: true};
            }
            if (query.dateField) {
              if (query.startYear && !query.endYear) {
                query.field = query.dateField;
                query.value = {
                  $gte: new Date(query.startYear, query.startMonth - 1, query.startDay + 1)
                  .toISOString()
                };
              }
              if (query.endYear && !query.startYear) {
                query.field = query.dateField;
                query.value = {
                  $lte: new Date(query.endYear, query.endMonth - 1, query.endDay + 1)
                  .toISOString()
                };
              }
              if (query.startYear && query.endYear) {
                query.field = query.dateField;
                query.value = {
                  $gte: new Date(query.startYear, query.startMonth - 1, query.startDay + 1)
                  .toISOString(),
                  $lte: new Date(query.endYear, query.endMonth - 1, query.endDay + 1)
                  .toISOString()
                };
              }
            }
            if (query.value === 'Käynnissä olevat hankkeet') {
              query.value = {$in: ["allekirjoitettu", "väliraportti", "loppuraportti"]};
            }
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

            var queries = prepareQueries(req.query.searchBy);
            var orderingJSON = {};
            orderingJSON[ordering] = ascending === 'true' ? 1 : -1;

            /**
            * Format search query when search involves organisations
            * collection, and perform search using Organisation model.
            */

            var params = _.map(JSON.parse(req.query.searchBy), function(query) {
              var search = {};
              if (typeof query.orgField !== 'undefined') {
                search[query.orgField] = new RegExp(query.orgValue, 'i');
              }
              return search;
            })

            Organisation.find({$and: params}, function(err, orgs) {

                /**
                * Map found organisations to an array of ids
                */
                orgs = orgs.map(function(org) {
                  return org._id;
                });

                /**
                * Combine organisation and project parameters in one query
                * and query the projects collection
                */
                queries = _.filter(queries, function(query) {
                  return typeof query.org_fields === 'undefined';
                })

                queries.push({organisation: {$in: orgs}});

                Project.find({$and: queries}, {_id: 1, project_ref: 1, title: 1,
                  organisation: 1, description: 1})
                    .populate('organisation', {_id: 1, name: 1})
                    .sort(orderingJSON)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec(function (err, results) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Virhe hankkeiden hakutoiminnossa'
                            });
                        } else {
                            res.json(results);
                        }
                    });
                });
        },
        /**
         * Returns all projects matching the given search query in the HTTP POST
         * parameter <tt>searchBy</tt>.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        searchAllProjects: function (req, res) {
            var queries = prepareQueries(req.query.searchBy);

            var params = _.map(JSON.parse(req.query.searchBy), function(query) {
              var search = {};
              if (typeof query.orgField !== 'undefined') {
                search[query.orgField] = new RegExp(query.orgValue, 'i');
              }
              return search;
            });

            Organisation.find({$and: params}, function(err, orgs) {

                orgs = orgs.map(function(org) {
                  return org._id;
                });

                queries = _.filter(queries, function(query) {
                  return typeof query.orgField === 'undefined';
                })

                queries.push({organisation: {$in: orgs}});

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
              });
        },

        /**
         * Returns all payments matching the given search query in the HTTP POST
         * parameter <tt>searchPay</tt>.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        searchPayments: function (req, res) {

            var choice = _.values(JSON.parse(req.query.choice))

            var queries = prepareQueries(req.query.searchPay);

            /**
            * Query paid sums
            */

          if (choice.indexOf('payments') > -1) {
              queries.push({"payments": {$exists: true, $gt: {$size: 0}}});

              Project.find({$and: queries}, function(err, projects) {
                if (err) {
                    return res.status(500).json({
                        error: 'Virhe maksujen hakutoiminnossa'
                    });
                } else {
                  projects = _.flattenDeep(_.map(projects, function(project) {
                      var payments = _.map(project.payments, function(payment) {
                        return {"sum": payment.sum_eur,
                              "date": payment.payment_date,
                              "ref": project.project_ref,
                              "title": project.title,
                              "coordinator": project.coordinator,
                              "region": project.region,
                              "id": project._id};
                      });
                      return payments;
                  }));
                  res.json(projects);
                }
              });

            }

            if (choice.indexOf('approved.granted_sum_eur') > -1) {
                queries.push({"approved.granted_sum_eur": {$exists: true}});

                Project.find({$and: queries}, function(err, projects) {
                  if (err) {
                      return res.status(500).json({
                          error: 'Virhe maksujen hakutoiminnossa'
                      });
                  } else {
                    projects = _.map(projects, function(project) {


                        return {"sum": project.approved.granted_sum_eur,
                                "date": project.approved.approved_date,
                                "ref": project.project_ref,
                                "title": project.title,
                                "id": project._id}
                    });
                    res.json(projects);
                  }
                });

              }

        },

        /**
         * Returns all organisations matching the given search query in the HTTP POST
         * parameter <tt>searchOrg</tt>.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */

        searchOrgs: function (req, res) {

            var queries = prepareQueries(req.query.searchOrg);

            Organisation.find({$and: queries}, function (err, orgs) {
              if (err) {
                  return res.status(500).json({
                      error: 'Virhe järjestöjen hakutoiminnossa'
                  });
              } else {
                  orgs = _.map(orgs, function(org) {
                    return {"_id": org._id,
                            "name": org.name,
                            "representative": org.representative.name + ", " +
                            org.representative.email + ", " + org.representative.phone,
                            "exec_manager": org.exec_manager,
                            "communications_rep": org.communications_rep,
                            "address": org.address.street + ", " + org.address.postal_code +
                            " " + org.address.city + ", " + org.address.country,
                           "tel": org.tel, "email": org.email, "website": org.website,
                           "legal_status": org.legal_status, "description": org.description,
                           "int_links": org.int_links, "nat_local_links": org.nat_local_links,
                           "other_funding_budget": org.other_funding_budget,
                           "accounting_audit": org.accounting_audit}
                  })
                  res.json(orgs);
              }

            });

        },

        /**
         * Returns the number of all projects matching the search query given by
         * the HTTP POST parameter <tt>searchBy</tt>.
         *
         * @param {type} req
         * @param {type} res
         * @returns {undefined}
         */
        countSearchResults: function (req, res) {
            var queries = prepareQueries(req.body.searchBy);

            var params = _.map(JSON.parse(req.body.searchBy), function(query) {
              var search = {};
              if (typeof query.orgField !== 'undefined') {
                search[query.orgField] = new RegExp(query.orgValue, 'i');
              }
              return search;
            })

            Organisation.find({$and: params}, function(err, orgs) {

                orgs = orgs.map(function(org) {
                  return org._id;
                });

                queries = _.filter(queries, function(query) {
                  return typeof query.orgField === 'undefined';
                })

                queries.push({organisation: {$in: orgs}});

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
               });
        }

    };
}
