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

        /**
         *
         *
         * @returns {undefined}
         */
        $scope.find = function () {
            Projects.query({
                    ordering:   $location.search().ordering,
                    ascending:  $location.search().ascending,
                    page:       $location.search().page,
                },
                function(results) {
                    $scope.projects = results;
                }
            );
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
         * <tt>true</tt> iff the projects will be listed in ascending order.
         */
        $scope.ascending = true;

        /**
         * Current page number.
         */
        $scope.page = 1;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 10;

        $scope.pages;

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
            $scope.ascending = ($scope.predicate === predicate)
                    ? !$scope.ascending : true;
            $scope.predicate = predicate;
            $scope.find();
        };

        /**
         * Calculates the number of and links to pages and writes the output to
         * $scope.pages.
         *
         * @returns {undefined}
         */
        $scope.paginate = function() {
            Projects.countProjects(function(result) {
                var pageCount, numberOfPages, pagination;
                pageCount = result.projectCount;
                numberOfPages = Math.ceil(pageCount / $scope.pageSize);
                pagination = document.getElementById("pagination");
                $scope.pages = [];
                for (var i = 1; i <= numberOfPages; ++i) {
                    $scope.pages.push({number: i, url: "/projects"
                                + "?ordering=" + $scope.predicate
                                + "&ascending=" + $scope.ascending
                                + "&page=" + i});
                }
            });
        };
    }
]);
