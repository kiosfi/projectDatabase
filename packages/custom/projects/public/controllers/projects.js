'use strict';

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', 'Global', 'Projects', 'MeanUser',
  function($scope, $stateParams, $location, Global, Projects, MeanUser) {
    $scope.global = Global;

    $scope.statuses = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty',
                      '1. väliraportti', '2. väliraportti', 'päättynyt'];

    $scope.hasAuthorization = function(project) {
      if (!project || !project.user) return false;
      return MeanUser.isAdmin || project.user._id === MeanUser.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var project = new Projects($scope.project);
        project.$save(function(response) {
          $location.path('projects/' + response._id);
        });

        $scope.project = {};

      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Projects.query(function(projects) {
        $scope.projects = projects;
      });
    };

    $scope.findOne = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
      });
    };
  }
]);
