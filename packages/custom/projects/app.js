'use strict';

/**
 * Defining the Package
 */
var Module = require('meanio').Module;

var Projects = new Module('projects');

/**
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */

Projects.register(function(app, auth, database, circles, organisations) {

  //We enable routing. By default the Package Object is passed to the routes
  Projects.routes(app, auth, database, organisations);

  Projects.aggregateAsset('css', 'projects.css');
  Projects.aggregateAsset('js', 'view.js', {global:true,  absolute: false});


  //We are adding a link to the main menu for all authenticated users
  Projects.menus.add({
    'roles': ['authenticated'],
    'title': 'Hankelistaus',
    'link': 'all projects'
  });

  Projects.menus.add({
    'roles': ['authenticated'],
    'title': 'Hankkeen lisäys',
    'link': 'create project'
  });

  Projects.events.defaultData({
    type: 'post',
    subtype: 'project'
  });

  return Projects;
});
