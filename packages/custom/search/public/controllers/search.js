'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', 'Global', 'Search',
  function($scope, Global, Search) {
    $scope.global = Global;
    $scope.package = {
      name: 'search'
    };
  }
]);
