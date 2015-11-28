'use strict';

angular.module('mean.search').factory('Search', ['$resource',
  function($resource) {
    return $resource('api/search/', {},
    {
      searchByState: {
        method: 'GET', url: 'api/search/state', isArray: true
      },
      searchByRegion: {
        method: 'GET', url: 'api/search/region', isArray: true
      }
    });
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
