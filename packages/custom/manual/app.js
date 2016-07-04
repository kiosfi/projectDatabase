'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Manual = new Module('manual');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Manual.register(function(app, auth) {

  //We enable routing. By default the Package Object is passed to the routes
  Manual.routes(app, auth);

  //We are adding a link to the main menu for all authenticated users
  Manual.menus.add({
    title:  'Käyttöohje',
    link:   'manual',
    roles:  ['authenticated']
  });

  Manual.aggregateAsset('css', 'manual.css', {global: false, absolute: false});

  return Manual;
});
