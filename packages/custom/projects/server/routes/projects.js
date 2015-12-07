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

module.exports = function (Projects, app, auth) {

    var projects = require('../controllers/projects')(Projects)


    app.route('/api/projects')
            .get(projects.getProjects)
            .put(projects.countProjects)
            .post(auth.requiresLogin, hasPermissions, projects.create);
    app.route('/api/states')
            .get(projects.allStates);
    app.route('/api/projects/:projectId')
            .get(auth.isMongoId, auth.requiresLogin, projects.show)
            .put(auth.isMongoId, auth.requiresLogin, projects.update)
            .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, projects.destroy);
    app.route('/api/projects/rev/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addReview);
    app.route('/api/projects/rej/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addRejected);
    app.route('/api/projects/sign/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addSigned);
    app.route('/api/projects/payment/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addPayment);
    app.route('/api/projects/end/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addEnded);
    app.route('/api/projects/appr/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addApproved);
    app.route('/api/projects/endReport/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addEndReport);
    app.route('/api/projects/intReport/:projectId')
            .put(auth.isMongoId, auth.requiresLogin, projects.addIntReport);
    app.route('/api/projects/byOrg/:organisationId')
            .get(projects.byOrg);

    app.param('params', projects.getProjects);
    app.param('projectId', projects.project);
};
