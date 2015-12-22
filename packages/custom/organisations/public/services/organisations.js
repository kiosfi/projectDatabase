'use strict';

/**
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.organisations').factory('Organisations', ['$resource',
    function ($resource) {
        return $resource('api/organisations/:organisationId', {
            organisationId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            countOrganisations: {
                method: 'PUT',
                url: 'api/organisations'
            },
            getOrganisations: {
                method: 'GET',
                url: 'api/organisations'
            },
            getAllOrganisations: {
                method: 'GET',
                url: 'api/organisations/all',
                isArray: true
            }
        });
    }
]);
