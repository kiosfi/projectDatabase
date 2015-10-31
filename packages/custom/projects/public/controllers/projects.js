'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams', '$location', '$window', 'Global', 'Projects', 'MeanUser', 'Circles',
  function($scope, $stateParams, $location, $window, Global, Projects, MeanUser, Circles) {
    $scope.global = Global;

    $scope.states = [{"current": "rekisteröity", "next": ["käsittelyssä", "päättynyt"]},
      {"current": "käsittelyssä", "next": ["hyväksytty", "hylätty", "päättynyt"]},
      {"current": "hyväksytty", "next": ["allekirjoitettu", "hylätty", "päättynyt"]},
      {"current": "hylätty", "next": []}, {"current": "allekirjoitettu",
      "next": ["väliraportti", "loppuraportti", "päättynyt"]},
      {"current": "väliraportti", "next": ["väliraportti", "loppuraportti", "päättynyt"]},
      {"current": "loppuraportti", "next": ["päättynyt"]}, {"current": "päättynyt", "next": []}];

    $scope.coordinators = ['Teppo Tenhunen', 'Kaisa Koordinaattori', 'Maija Maa', 'Juha Jokinen'];

    $scope.categories = ['naiset', 'lapset', 'vammaiset', 'yleiset ihmisoikeudet', 'muu'];

    $scope.categorySelection = [];

    $scope.toggleSelection = function toggleSelection(categ) {
        var idx = $scope.categorySelection.indexOf(categ);

        // is currently selected
        if (idx > -1) {
            $scope.categorySelection.splice(idx, 1);
        }
        // is newly selected
        else {
            $scope.categorySelection.push(categ);
        }
    };

    $scope.hasAuthorization = function(project) {
      if (!project) return false;
      return MeanUser.isAdmin;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var project = new Projects($scope.project);
        project.categories = $scope.categorySelection;
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

    $scope.findState = function() {
      Projects.get({
        projectId: $stateParams.projectId
      }, function(project) {
        $scope.project = project;
        for (var i = 0; i < $scope.states.length; i++) {
          if ($scope.states[i].current === $scope.project.state) {
            $scope.state = $scope.states[i];
          }
        }
      });
    };

    $scope.confirm = function (project) {
        if (confirm("Haluatko varmasti poistaa hankkeen '" + project.title + "'?")) {
            $scope.remove(project);
        }
    };

    $scope.remove = function(project) {
      if (project) {
        project.$remove(function(response) {
          for (var i in $scope.projects) {
            if ($scope.projects[i] === project) {
              $scope.projects.splice(i, 1);
            }
          }
          $location.path('projects');
        });
      } else {
        $scope.project.$remove(function(response) {
          $location.path('projects');
        });
      }
    };

    $scope.updateState = function() {
      var project = $scope.project;
      project.$update(function(response) {
          $window.location.reload();
      });
    };
  }
]);
