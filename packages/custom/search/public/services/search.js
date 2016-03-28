'use strict';

angular.module('mean.search').factory('Search', ['$resource',
    function ($resource) {
        return $resource('api/search', {},
                {
                    searchProjects: {
                        method: 'GET',
                        isArray: true
                    },
                    searchPayments: {
                        method: 'GET',
                        url: 'api/search/payments',
                        isArray: true
                    },
                    searchOrgs: {
                        method: 'GET',
                        url: 'api/search/orgs',
                        isArray: true
                    },
                    searchAllProjects: {
                        method: 'GET',
                        url: 'api/search/export',
                        isArray: true
                    },
                    countSearchResults: {
                        method: 'POST',
                        url: 'api/search/count',
                        isarray: false
                    }
                });
    }
]);

angular.module('mean.search').service('OrgSearch', ['$http',
    function ($http) {
        this.findOrg = function (tag) {
            return $http.get('api/search/org/' + tag);
        }
    }
]);

angular.module('mean.search').service('ThemeSearch', ['$http',
    function ($http) {
        this.findTheme = function (tag) {
            return $http.get('api/search/approved/' + tag);
        }
    }
]);
