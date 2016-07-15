'use strict';

angular.module('mean.search').factory('Search', ['$resource',
    function ($resource) {
        return $resource('api/search', {},
                {
                    searchProjects: {
                        method: 'GET',
                        isArray: true
                    },
                    searchAllProjects: {
                        method: 'GET',
                        url: 'api/search/allProjects',
                        isArray: true
                    },
                    countProjects: {
                        method: 'POST',
                        url: 'api/search/countProjects',
                        isarray: false
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
                    searchAllOrganisations: {
                        method: 'GET',
                        url: 'api/search/allOrganisations',
                        isArray: true
                    },
                    countOrganisations: {
                        method: 'POST',
                        url: 'api/search/countOrganisations',
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
