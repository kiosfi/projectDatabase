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
Manual.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Manual.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Manual.menus.add({
    title:  'Käyttöohje',
    link:   'manual',
    roles:  ['authenticated']
  });

  Manual.aggregateAsset('css', 'manual.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Manual.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Manual.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Manual.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Manual;
});
