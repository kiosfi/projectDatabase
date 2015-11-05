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
        };
    };

    next();
};

module.exports = function (Projects, app, auth) {

    var projects = require('../controllers/projects')(Projects);

    app.route('/api/projects')
            .get(projects.all)
            .post(auth.requiresLogin, hasPermissions, projects.create);
    app.route('/api/states')
            .get(projects.allStates);
    app.route('/api/projects/:projectId')
            .get(auth.isMongoId, auth.requiresLogin, projects.show)
            .get(auth.isMongoId, auth.requiresLogin, projects.showReview)
            .put(auth.isMongoId, auth.requiresLogin, projects.addReview)
            .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, projects.destroy);
    app.route('/api/projects/byOrg/:organisationId')
            .get(projects.byOrg);


    app.param('projectId', projects.project);
};
