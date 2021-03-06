'use strict';

angular.module('mean.search').config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.state('search main page', {
      url: '/search',
      templateUrl: 'search/views/index.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    });

    $stateProvider.state('search results page', {
      url: '/search/results',
      templateUrl: 'search/views/search.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    });

    $stateProvider.state('search results export page', {
      url: '/search/export',
      templateUrl: 'search/views/export.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    });

    $stateProvider.state('payments search page', {
      url: '/search/payments',
      templateUrl: 'search/views/payments.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    });

    $stateProvider.state('orgs search page', {
      url: '/search/orgs',
      templateUrl: 'search/views/orgs.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    });

  }
]);
