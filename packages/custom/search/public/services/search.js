'use strict';

angular.module('mean.search').factory('Search', ['$resource',
  function($resource) {
    return $resource('api/search/', {}
      );
    }
  ]);

  angular.module('mean.search').service('OrgSearch', ['$http',
    function($http) {
        this.findOrgs = function(name) {
            return $http.get('api/search/org/' + name);
        }
      }
  ]);

  /*function($resource) {
    return $resource('projects/:projectId', {
      articleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }*/
