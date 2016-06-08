(function () {
  'use strict';

  /* jshint -W098 */
  angular
    .module('mean.manual')
    .controller('ManualController', ManualController);

  ManualController.$inject = ['$scope', 'Global', 'Manual'];

  function ManualController($scope, Global, Manual) {
    $scope.global = Global;
    $scope.package = {
      name: 'manual'
    };
  }
})();