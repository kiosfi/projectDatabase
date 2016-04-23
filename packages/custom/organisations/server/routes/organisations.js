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
        ;
    }
    ;

    next();
};

module.exports = function (Organisations, app, auth) {

    var organisations = require('../controllers/organisations')(Organisations);

    app.route('/api/organisations')
            .get(auth.requiresLogin, organisations.getOrganisations)
            .put(auth.requiresLogin, organisations.countOrganisations)
            .post(auth.requiresLogin, hasPermissions, organisations.create);
    app.route('/api/organisations/names')
            .get(organisations.getOrganisationNames);
    app.route('/api/organisations/:organisationId')
            .get(auth.requiresLogin, auth.isMongoId, organisations.show)
            .put(auth.isMongoId, auth.requiresLogin, organisations.update)
            .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, organisations.destroy);
    app.param('organisationId', organisations.organisation);
    app.param('orgName', organisations.organisation);
};
