'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
        Organisation = mongoose.model('Organisation'),
        BankAccount = mongoose.model('BankAccount'),
        config = require('meanio').loadConfig(),
        _ = require('lodash');

module.exports = function (Organisations) {

    return {
        organisation: function (req, res, next, id) {
            Organisation.load(id, function (err, organisation) {
                if (err) {
                    return next(err);
                }
                if (!organisation) {
                    if (err === null) {
                        return res.status(404).json(
                                {status: 404, message: 'Pyydettyä järjestöä ei ole.'}
                        );
                    }
                    return res.status(500).json(
                            {status: 500, message: 'Järjestön lataus epäonnistui.'}
                    );
                }

                req.organisation = organisation;
                next();
            });
        },
        show: function (req, res) {

            Organisations.events.publish({
                action: 'viewed',
                name: req.organisation.name,
                url: config.hostname + '/organisations/' + req.organisation._id
            });

            res.json(req.organisation);
        },
        create: function (req, res) {
            var organisation = new Organisation(req.body);
            var bank_account = new BankAccount(req.body.bank_account);
            organisation.bank_account = bank_account._id;
            bank_account.save();
            organisation.save(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Järjestöä ei voi tallentaa'
                    });
                }
                res.json(organisation);
            });
        },
        all: function (req, res) {
            var query = Organisation.find();

            query
                    .sort({name: 'asc'})
                    .populate({path: 'bank_account', model: 'BankAccount'})
                    .exec(function (err, organisations) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Järjestöjä ei voi näyttää'
                            });
                        }
                        res.json(organisations)
                    });

        },
        /**
         * Gets all organisations.
         *
         * @param {type} req    The request object. It should contain the
         * following GET-parameters: <tt>ordering</tt>, <tt>ascending</tt>, and
         * <tt>page</tt>. The results will be sorted primarily by
         * <tt>ordering</tt> and in ascending order if <tt>ascending</tt> was
         * "true". Additionally, this function will take care of paging the
         * results and only displaying the page requested with <tt>page</tt>.
         * @param {type} res
         * @returns {undefined}
         */
        getOrganisations: function(req, res) {
            var ordering = req.query.ordering;
            var ascending = req.query.ascending;
            var page = req.query.page;
            if (typeof ordering === 'undefined') {
                ordering = 'name';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }

            var pageSize = 10;

            var orderingJSON = {};
            orderingJSON[ordering] = ascending === 'true' ? 1 : -1;

            // Secondary sorting predicate will be "representative" if first was
            // "name", and "name" otherwise.
            if (ordering === 'name') {
                orderingJSON["representative"] = 1;
            } else {
                orderingJSON["name"] = 1;
            }

            Organisation.find({}, {_id: 1, name: 1, representative: 1}
            ).sort(orderingJSON)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec(function (err, result) {
                        if (err) {
                            return res.status(500).json({
                                error: 'Järjestöjä ei voi näyttää'
                            });
                        }
                        res.json(result);
                    });
        },
        /**
         * Writes the number of organisations present at the database as a json
         * object {orgCount : &lt;n&gt;}, where &lt;n&gt; is the number of
         * organisations.
         *
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        countOrganisations: function (req, res) {
            Organisation.count({}, function (error, result) {
                res.json({orgCount: result});
            });
        },

        /**
         * Deletes requested organisation from organisations collection.
         * object {orgCount : &lt;n&gt;}, where &lt;n&gt; is the number of
         * @param {type} req Request object.
         * @param {type} res Response object.
         */
        destroy: function (req, res) {
            var organisation = req.organisation;
            organisation.remove(function (err) {
                if (err) {
                    return res.status(500).json({
                        error: 'Järjestön poistaminen ei onnistu.'
                    });
                }

                Organisations.events.publish({
                    action: 'deleted',
                    user: {
                        name: req.user.name
                    },
                    name: organisation.name
                });
                res.json(organisation);
            });
        },
    };
}
