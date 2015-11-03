'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Statechanges = new Module('statechanges');

Statechanges.register(function(app, auth, database, circles) {

  //We enable routing. By default the Package Object is passed to the routes
  Statechanges.routes(app, auth, database);

  return Statechanges;
});
