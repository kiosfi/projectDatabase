'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
  '$location', '$window', '$http', 'Global', 'Projects', 'MeanUser',
  function($scope, $stateParams, $location, $window, $http, Global, Search, MeanUser) {
    $scope.global = Global;

    /*$scope.package = {
      name: 'search'
    };*/

    $scope.search = function() {
      Search.query(function(search) {
        $scope.search = search;
      });
    };
   /* $scope.search = function() {
      Search.query({tag:$scope.selectedTag}, function(articles) {
        $scope.articles = articles;
      });
    };*/
    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
      });
    };

  }
]);
