'use strict';

// Project authorization helpers
var hasAuthorization = function (req, res, next) {
    if (!req.user.isAdmin) {
        return res.status(401).send('User is not authorized');
    }
    next();
};

var hasPermissions = function (req, res, next) {

    req.body.permissions = req.body.permissions || ['authenticated'];

    for (var i = 0; i < req.body.permissions.length; i++) {
        var permission = req.body.permissions[i];
        if (req.acl.user.allowed.indexOf(permission) === -1) {
            return res.status(401).send('User not allowed to assign ' + permission + ' permission.');
        }
    }
    next();
};
/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function (Search, app, auth) {

    var search = require('../controllers/search')(Search)

    /*app.route('/api/search')
     .get(search.all)
     .post(auth.requiresLogin, hasPermissions, search.all);*/


    app.route('/api/search')
            .get(search.searchProjects);
    app.route('/api/search/count')
            .post(search.countSearchResults);
    app.route('/api/search/export')
            .get(search.searchAllProjects);
    app.route('/api/search/payments')
            .get(search.searchPayments);
};
