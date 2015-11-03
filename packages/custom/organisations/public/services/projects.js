//Project service used for projects REST endpoint
angular.module('mean.organisations').factory('OrgProjects', ['$http',
    function ($http) {
        return {
            get: function (callback) {
                $http.get('/api/projects', {params: {organisation: '@_id'}})
                        .success(function (data) {
                            console.log(data);
                            callback(data);
                        })
                        .error(function () {
                            alert('error');
                        });
            }
        };
    }
]);
