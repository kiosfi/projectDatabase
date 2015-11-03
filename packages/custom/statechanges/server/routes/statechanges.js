'use strict';

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(Statechanges, app, auth, database) {

    var statechanges = require('../controllers/statechanges')(Statechanges);

    app.route('/api/states')
      .get(statechanges.all);

    app.param('current_state', statechanges.state);      
};
