'use strict';

angular.module('mean.states').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('states example page', {
      url: '/states/example',
      templateUrl: 'states/views/index.html'
    });
  }
]);
