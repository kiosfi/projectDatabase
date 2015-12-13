'use strict';

angular.module('mean.organisations').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.
    state('all organisations', {
      url: '/organisations',
      templateUrl: 'organisations/views/list.html'
    })
    .state('organisation by id', {
      url: '/organisations/:organisationId',
      templateUrl: '/organisations/views/view.html',
      resolve: {
        loggedin: function(MeanUser) {
          return MeanUser.checkLoggedin();
        }
      }
    })
    .state('edit organisation', {
        url: '/organisations/:organisationId/edit',
        templateUrl: '/organisations/views/edit.html',
        resolve: {
          loggedin: function(MeanUser) {
            return MeanUser.checkLoggedin();
          }
        }
      });
  }
]);
