'use strict';

angular.module('mean.projects').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('projects list', {
      url: '/projects',
      templateUrl: 'projects/views/index.html'
    });
  }
]);
