'use strict';

/* jshint -W098 */
angular.module('mean.states').controller('StatesController', ['$scope', 'Global', 'States',
  function($scope, Global, States) {
    $scope.global = Global;
    $scope.package = {
      name: 'states'
    };
  }
]);
