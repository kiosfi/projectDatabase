'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var States = new Module('states');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
States.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  States.routes(app, auth, database);

  return States;
});
