'use strict';

/**
 *
 * @param {type} param1
 * @param {type} param2
 */
angular.module('mean.projects').factory('Projects', ['$resource',
    function ($resource) {
        return $resource('api/projects/:projectId', {
            projectId: '@_id'
        }, {
            addReview: {
                method: 'PUT'
            }
//            getProjects: {
//                method: 'GET',
//                url:    'api/projects/list?criterion={}&ordering={project_ref:1}&offset=0&count=10'
//            }
        });
    }
]);
