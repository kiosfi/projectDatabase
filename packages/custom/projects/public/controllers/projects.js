'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams',
    '$location', '$window', '$http', 'Global', 'Projects', 'MeanUser', 'Circles',
    function ($scope, $stateParams, $location, $window, $http, Global, Projects, MeanUser, Circles) {
        $scope.global = Global;

        $scope.coordinators = ['Teppo Tenhunen', 'Kaisa Koordinaattori', 'Maija Maa', 'Juha Jokinen'];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.methodNames = ['Tietoisuuden lisääminen', 'Ihmisoikeuskasvatus ja -koulutus', 'Kapasiteetin vahvistaminen',
            'Kampanjointi ja/tai lobbaus', 'Vaikuttamistyö', 'Dokumentaatio ja monitorointi', 'Oikeusapu ja -neuvonta',
            'Strategiset ja/tai perusoikeuskanteet ja/tai ryhmäkanteet', 'Oikeusturvan saatavuuden parantaminen', 'Palveluiden saatavuuden parantaminen',
            'Ihmisoikeuspuolustajien suojelu', 'Verkostoituminen', 'Alueellinen yhteistyö', 'Toimintatuki', 'Muu'];

        $scope.methodLevels = ['Kansainvälinen', 'Kansallinen', 'Paikallinen', 'Yhteisö'];

        $scope.addedMethods = [];

        $scope.plannedPayments = [];

        $scope.themeSelection = [];

        $scope.objectiveComments = [];

        $scope.rejcategories = ["1", "2", "3", "4", "5"];

        $scope.rejectedCategorySelection = [];


        $scope.toggleThemeSelection = function toggleThemeSelection(theme) {
            var idx = $scope.themeSelection.indexOf(theme);

            // is currently selected
            if (idx > -1) {
                $scope.themeSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.themeSelection.push(theme);
            }
        };

        $scope.toggleRejectedCategorySelection = function toggleRejectedCategorySelection(rejectedCategory) {
            var idx = $scope.rejectedCategorySelection.indexOf(rejectedCategory);

            // is currently selected
            if (idx > -1) {
                $scope.rejectedCategorySelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.rejectedCategorySelection.push(rejectedCategory);
            }
        };


        $scope.toggleThemeSelection = function toggleThemeSelection(theme) {
            var idx = $scope.themeSelection.indexOf(theme);

            // is currently selected
            if (idx > -1) {
                $scope.themeSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.themeSelection.push(theme);
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
                $scope.displayedCollection = [].concat($scope.projects);
            });
        };

        $scope.findOne = function () {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
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
                $location.path('projects/' + project._id);
            });
        };

        $scope.addApprovedState = function () {
            var project = $scope.project;
            project.approved.themes = $scope.themeSelection;
            project.approved.methods = $scope.addedMethods;
            project.state = $scope.global.newState;
            project.$addApproved(function (response) {
                $location.path('projects/' + response._id)
            });
        };

        $scope.addRejectedState = function () {
            var project = $scope.project;
            project.rejected.rejection_categories = $scope.rejectedCategorySelection;
            project.state = $scope.global.newState;
            project.$addRejected(function (response) {
                $location.path('projects/' + response._id);
            });
        };


        $scope.addSignedState = function () {
            var project = $scope.project;
            project.planned_payments = $scope.plannedPayments;
            project.state = $scope.global.newState;
            project.$addSigned(function (response) {
                $location.path('projects/' + response._id);
            });
        };

        $scope.addIntReportState = function () {
            var project = $scope.project;
            project.state = $scope.global.newState;
            project.intermediary_report.themes = $scope.themeSelection;
            project.intermediary_report.methods = $scope.addedMethods;
            project.intermediary_report.objectives = $scope.objectiveComments;
            var index = project.intermediary_reports.length;
            if (index === undefined) {
              project.intermediary_report.reportNumber = 1;
            } else {
              project.intermediary_report.reportNumber = project.intermediary_reports.length + 1;
            }

            project.$addIntReport(function (response) {
                $location.path('projects/' + response._id);
            });
        };

        $scope.addEndReportState = function () {
            var project = $scope.project;
            project.state = $scope.global.newState;
            project.end_report.themes = $scope.themeSelection;
            project.end_report.methods = $scope.addedMethods;
            project.end_report.objectives = $scope.objectiveComments;
            project.$addEndReport(function (response) {
                $location.path('projects/' + response._id);
            });
        };

        $scope.addEndedState = function () {
                var project = $scope.project;
                project.state = $scope.global.newState;
                project.$addEnded(function (response) {
                    $location.path('projects/' + response._id)
                });
        };

        $scope.changeState = function (changeTo) {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.project = project;
                $scope.global.newState = changeTo;
                $location.path('projects/' + project._id + "/change");
            });
        };

        $scope.addMethod = function () {
            $scope.addedMethods.push({name: '', level: ''});
        };

        $scope.removeMethod = function () {
            $scope.addedMethods.splice(-1, 1);
        };

        $scope.addPlannedPayment = function () {
            $scope.plannedPayments.push({date: '', sum: ''});
        };

        $scope.removePlannedPayment = function () {
            $scope.plannedPayments.splice(-1, 1);
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
    }
]);
