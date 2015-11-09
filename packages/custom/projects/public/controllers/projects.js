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

        $scope.categories = ['Oikeusvaltio ja demokratia', 'lapset', 'vammaiset', 'yleiset ihmisoikeudet', 'muu'];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.methodNames = ['Tietoisuuden lisääminen', 'Ihmisoikeuskasvatus ja -koulutus', 'Kapasiteetin vahvistaminen',
            'Kampanjointi ja/tai lobbaus', 'Vaikuttamistyö', 'Dokumentaatio ja monitorointi', 'Oikeusapu ja -neuvonta',
            'Strategiset ja/tai perusoikeuskanteet ja/tai ryhmäkanteet', 'Oikeusturvan saatavuuden parantaminen', 'Palveluiden saatavuuden parantaminen',
            'Ihmisoikeuspuolustajien suojelu', 'Verkostoituminen', 'Alueellinen yhteistyö', 'Toimintatuki', 'Muu'];

        $scope.methodLevels = ['Kansainvälinen', 'Kansallinen', 'Paikallinen', 'Yhteisö'];

        $scope.selectedMethods = [];

        $scope.themeSelection = [];

        $scope.methodSelection = [];

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

        $scope.toggleMethodSelection = function toggleMethodSelection(method) {
            var idx = $scope.methodSelection.indexOf(method);

            // is currently selected
            if (idx > -1) {
                $scope.methodSelection.splice(idx, 1);
            }
            // is newly selected
            else {
                $scope.methodSelection.push(method);
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
        
        $scope.testList = [];

        $scope.addApprovedState = function () {
            console.log($scope.testList);
            var project = $scope.project;
            project.approved.themes = $scope.themeSelection;
            project.approved.methods = $scope.testList;
            project.state = $scope.global.newState;
            project.$addApproved(function (response) {
                $location.path('projects/' + project._id)
            });
        };

        $scope.addMethod = function (divId) {
            $scope.testList.push({name: '', level: ''});
            
            
//            var name = document.createElement("select");
//            for (var i = 0; i < $scope.methodNames.length; i++) {
//                var opt = document.createElement("option");
//                opt.value = $scope.methodNames[i];
//                opt.text = $scope.methodNames[i];
//                name.appendChild(opt);
//            }
//            document.getElementById(divId).appendChild(name);
//            var level = document.createElement("select");
//            for (var i = 0; i < $scope.methodLevels.length; i++) {
//                var opt = document.createElement("option");
//                opt.value = $scope.methodLevels[i];
//                opt.text = $scope.methodLevels[i];
//                level.appendChild(opt);
//            }
//            document.getElementById(divId).appendChild(level);

//            var opts = document.getElementById('methodsSelection');
//            var str = "<select id="
//            
//            for (var i=0; i>opts.length; i++) {
//                
//            }
//            var div = document.getElementById('methodsSelection');
//            div.innerHTML += '<select data-ng-model="method_name">' +
//                    '<option data-ng-repeat="methodName in methodNames" value="{{methodName}}">{{methodName}}</option>' +
//                '</select>' +
//
//                '<select data-ng-model="method_level">' +
//                    '<option data-ng-repeat="methodLevel in methodLevels" value="{{methodLevel}}">{{methodLevel}}</option>' +
//                '</select>';

        };
        
        $scope.removeMethod = function (divId) {
            
        }


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
