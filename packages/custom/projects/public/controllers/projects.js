'use strict';

angular.module('mean.projects').controller('ProjectsController',
['$scope', '$stateParams', '$location', '$window', '$http', 'Global',
    'Projects', 'MeanUser', 'Circles',
    function ($scope, $stateParams, $location, $window, $http, Global, Projects, MeanUser, Circles) {
        $scope.global = Global;

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

        $scope.hasAuthorization = function (project) {
            if (!project)
                return false;
            return MeanUser.isAdmin;
        };

        $scope.create = function (isValid) {
            if (isValid) {
                var project = new Projects($scope.project);
                project.categories = $scope.categorySelection;
                project.$save(function (response) {
                    $location.path('projects/' + response._id);
                });

                $scope.project = {};

            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function () {
            Projects.query(function (projects) {
                $scope.projects = projects;
            });
        };

        $scope.findOne = function () {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
                console.log($scope.project.in_review.user);
                console.log($scope.project.in_review);
            });
        };

        $scope.findState = function () {
            Projects.get({
                projectId: $stateParams.projectId}, function (project) {
                $http.get('/api/states').success(function (data) {
                    data.forEach(function (state) {
                        if (state.current_state === project.state) {
                            $scope.state = state;
                        }
                    });
                });
            });
        };

        $scope.confirm = function (project) {
            if (confirm("Haluatko varmasti poistaa hankkeen '" + project.title + "'?")) {
                $scope.remove(project);
            }
        };

        $scope.remove = function (project) {
            if (project) {
                project.$remove(function (response) {
                    for (var i in $scope.projects) {
                        if ($scope.projects[i] === project) {
                            $scope.projects.splice(i, 1);
                        }
                    }
                    $location.path('projects');
                });
            } else {
                $scope.project.$remove(function (response) {
                    $location.path('projects');
                    $window.location.reload();
                });
            }
        };

        $scope.addReviewState = function () {
            var project = $scope.project;
            project.state = $scope.global.newState;
            project.$addReview(function (response) {
                $location.path('projects/' + project._id)
            });
        };

        $scope.changeState = function (changeTo) {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
                $scope.global.newState = changeTo;
                $location.path('projects/' + project._id + "/change")
            });
        };

        /**
         * The sorting predicate used in project listing. Initial value is
         * "project_ref".
         */
        $scope.predicate = "project_ref";

        /**
         * <tt>true</tt> iff the projects will be listed in reverse order.
         */
        $scope.reverse = false;

        /**
         * Changes the ordering to match the given predicate. If the new
         * predicate is the same as the previous value, the order will be
         * reversed.
         *
         * @param {string} predicate Ordering predicate, i.e. name of the
         * attribute used for ordering the list (e.g. "project_ref").
         * @returns {undefined}
         */
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate)
                    ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.criterion = {};

        $scope.ordering = {project_ref : 1};

        $scope.offset = 0;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 3;

        $scope.projects2 = [];

        $scope.getProjects = function(offset) {
            Projects.query({criterion : {}, ordering : {project_ref:1},
                offset : 0, count : 10}, function(result) {
                        $scope.projects2 = result;
            });
        }

        /**
         * Fills the table with project entries. The page number will be read
         * from HTTP GET.
         *
         * @returns {undefined}
         */
        $scope.fillTable = function() {
            console.log("dgtwrg");
            var table = document.getElementById('projtable');
            for (var i = 0; i < $scope.pageSize; ++i) {
                var row = table.insertRow(-1);
                var project = $scope.projects2[i];
                console.log(project);
                row.insertCell(0).innerHTML = project.project_ref;
                row.insertCell(1).innerHTML = '<a href="projects/' + project._id +
                        '">' + project.title + '</a>';
                row.insertCell(2).innerHTML = project.state;
                row.insertCell(3).innerHTML = project.organisation.name;
            }
        };

        /**
         * Fills the pagination.
         *
         * @returns {undefined}
         */
        $scope.paginate = function() {
            var pages = Math.ceil($scope.projects.length / $scope.pageSize);

        };

    }
]);
