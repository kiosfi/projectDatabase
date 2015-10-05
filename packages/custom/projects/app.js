'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Projects = new Module('projects');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Projects.register(function(app, auth, database, circles) {

  //We enable routing. By default the Package Object is passed to the routes
  Projects.routes(app, auth, database);

  Projects.aggregateAsset('css', 'projects.css');


  //We are adding a link to the main menu for all authenticated users
  Projects.menus.add({
    'roles': ['authenticated'],
    'title': 'Hankelistaus',
    'link': 'all projects'
  });

  Projects.menus.add({
    'roles': ['authenticated'],
    'title': 'Hankkeiden lisäys',
    'link': 'create project'
  });

  Projects.events.defaultData({
    type: 'post',
    subtype: 'project'
  });


  /*
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Articles.settings({'someSetting':'some value'},function (err, settings) {
      //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Articles.settings({'anotherSettings':'some value'});

    // Get settings. Retrieves latest saved settings
    Articles.settings(function (err, settings) {
      //you now have the settings object
    });
    */

  // Only use swagger.add if /docs and the corresponding files exists
  //swagger.add(__dirname);

  return Projects;
});
