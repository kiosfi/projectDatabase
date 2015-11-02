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

  //We are adding a link to the main menu for all authenticated users
  States.menus.add({
    title: 'states example page',
    link: 'states example page',
    roles: ['authenticated'],
    menu: 'main'
  });
  
  States.aggregateAsset('css', 'states.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    States.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    States.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    States.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return States;
});
