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

//var isLoggedIn = function (req, res) {
//
//}

module.exports = function (Projects, app, auth) {

    var projects = require('../controllers/projects')(Projects);

    app.route('/api/projects')
            .get(auth.requiresLogin, projects.getProjects)
            .put(auth.requiresLogin, projects.countProjects)
            .post(auth.requiresLogin, hasPermissions, projects.create);
    app.route('/api/states')
            .get(projects.allStates);
    app.route('/api/projects/:projectID')
            .get(auth.isMongoId, auth.requiresLogin, projects.show)
            .put(auth.isMongoId, auth.requiresLogin, projects.update)
            .delete(auth.isMongoId, auth.requiresLogin, hasAuthorization, projects.destroy);
    app.route('/api/projects/rev/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addReview);
    app.route('/api/projects/rej/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addRejected);
    app.route('/api/projects/sign/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addSigned);
    app.route('/api/projects/payment/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addPayment);
    // TODO: Figure out some way to pass user credentials along with these two
    // requests in order to enable proper access control:
//    app.route('/api/projects/upload')
//            .post(auth.isMongoId, auth.requiresLogin, projects.addAppendix);
//    app.route('/api/projects/data/:projectID')
//            .get(auth.isMongoId, auth.requiresLogin, projects.accessAppendix);
    app.route('/api/projects/upload')
            .post(projects.addAppendix); //     <- Fix this.
    app.route('/api/projects/data/:projectID')
            .get(projects.accessAppendix); //   <- ...and this.
    app.route('/api/projects/end/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addEnded);
    app.route('/api/projects/appr/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addApproved);
    app.route('/api/projects/endReport/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addEndReport);
    app.route('/api/projects/intReport/:projectID')
            .put(auth.isMongoId, auth.requiresLogin, projects.addIntReport);
    app.route('/api/projects/byOrg/:organisationId')
            .get(auth.requiresLogin, projects.byOrg);
    app.route('/api/projects/regRepPDF/:projectID')
            .put(auth.requiresLogin, projects.createRegRep);
    app.route('/api/projects/endRepPDF/:projectID')
            .put(auth.requiresLogin, projects.createEndRep);

    app.param('params', projects.getProjects);
    app.param('projectID', projects.project);
};
