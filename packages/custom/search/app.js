'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Search = new Module('search');



/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Search.register(function (app, auth, database, organisations, projects) {

    //We enable routing. By default the Package Object is passed to the routes
    Search.routes(app, auth, database, organisations, projects);

    //We are adding a link to the main menu for all authenticated users
    /*Search.menus.add({
     title: 'search example page',
     link: 'search example page',
     roles: ['authenticated'],
     menu: 'main'
     });*/

    Search.menus.add({
        title: 'Haku',
        link: 'search main page',
        roles: ['authenticated'],
        menu: 'main'
    });

    Search.aggregateAsset('css', 'search.css');

    Search.events.defaultData({
        type: 'post',
        subtype: 'search'
    });

    Search.aggregateAsset('js', '../lib/angular-sanitize/angular-sanitize.min.js', {global: true});
    Search.aggregateAsset('js', '../lib/ng-csv/build/ng-csv.min.js', {global: true});
    Search.angularDependencies(['ngSanitize', 'ngCsv']);

    return Search;
});
