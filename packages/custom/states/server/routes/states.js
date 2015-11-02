'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(States, app, auth, database) {

  var states = require('../controllers/states')(States);

  app.route('/api/states')
    .get(states.all);
};
