'use strict';

/**
 * This is a test.
 *
 * @param {type} param1
 * @param {type} param2
 */

angular.module('mean.projects').controller('ProjectsController', ['$scope', '$stateParams',
    '$location', '$window', '$http', 'Global', 'Projects', 'MeanUser', 'Circles', 'Organisations',
    function ($scope, $stateParams, $location, $window, $http, Global, Projects, MeanUser, Circles, Organisations) {
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

        $scope.deadlines = [];

        $scope.themeSelection = [];

        $scope.objectiveComments = [];

        $scope.rejcategories = ["1 Hanke ei ole ihmisoikeushanke", "2 Järjestöllä ei ole ihmisoikeushankkeen toteutuskapasiteettia",
            "3 Järjestöllä ei ole hallintokapasiteettia", "4 Hanke on epärealistinen tai muuten heikosti suunniteltu",
            "5 Hankkeen budjetti on epärealistinen", "6 Huonot tai puuttuvat referenssit", "7 Strategia", "8 Muu, mikä?"];

        $scope.addedRejections = [];

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

        $scope.convertDate = function (day, month, year) {
            var parsed = new Date(year + "-" + month + "-" + day);
            var d = parsed.getDate();
            var m = parsed.getMonth() + 1;
            var y = parsed.getFullYear();
            if (d < 10) {
                d = '0' + d;
            }
            if (m < 10) {
                m = '0' + m;
            }
            return (d + "-" + m + "-" + y);
        };

        $scope.hasAuthorization = function (project) {
            if (!project)
                return false;
            return MeanUser.isAdmin;
        };

        /*
         * Creates new project by checking if organisation already exists (i.e. organisation 
         * has been selected from dropdown list) or if organisation is new. 
         * If organisation is new, first creates new organisation by calling
         * organisation server-side controller and after that creates project.
         * If organisation is selected from list, uses existing organisation._id and 
         * creates project. 
         * 
         * @param {type} isValid checks if project creation form is valid
         * @returns {undefined}
         */
        $scope.create = function (isValid) {
            if (isValid) {
                var project = new Projects($scope.project);
                if ($scope.newOrg) {
                    var org = new Organisations($scope.project.organisation);

                    org.$save(function (response) {
                        var orgId = response._id;
                        project.organisation = orgId;

                        project.$save(function (response) {
                            $location.path('projects/' + response._id);
                        });

                        $scope.project = {};
                    });

                } else {
                    project.organisation = $scope.project.listOrganisation;

                    project.$save(function (response) {
                        $location.path('projects/' + response._id);
                    });

                    $scope.project = {};
                }
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

        $scope.addReviewState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.state = $scope.global.newState;
                project.$addReview(function (response) {
                    $location.path('projects/' + project._id);
                });
            }

        };

        $scope.addApprovedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.approved.themes = $scope.themeSelection;
                project.approved.methods = $scope.addedMethods;
                project.state = $scope.global.newState;
                project.$addApproved(function (response) {
                    $location.path('projects/' + response._id)
                });
            }

        };

        $scope.addRejectedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.rejected.rejection_categories = $scope.addedRejections;
                project.state = $scope.global.newState;
                project.$addRejected(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };

        $scope.addSignedState = function (isValid) {
            if (isValid) {

                var signed_date = $scope.convertDate($scope.signed_date.day, $scope.signed_date.month, $scope.signed_date.year)
                var project = $scope.project;
                project.signed.signed_date = signed_date;

                $scope.parsedDeadlines = [];
                $scope.parsedPlannedPayments = [];

                var plpms = $scope.plannedPayments;

                for (var i = 0; i < plpms.length; i++) {
                    var pp = $scope.convertDate(plpms[i].day, plpms[i].month, plpms[i].year);
                    $scope.parsedPlannedPayments.push({date: pp, sum_eur: plpms[i].sum_eur, sum_local: plpms[i].sum_local})
                }
                project.signed.planned_payments = $scope.parsedPlannedPayments;

                var dls = $scope.deadlines;

                for (var i = 0; i < dls.length; i++) {
                    var dl = $scope.convertDate(dls[i].day, dls[i].month, dls[i].year);
                    $scope.parsedDeadlines.push({report: dls[i].report, date: dl});
                }
                project.signed.intreport_deadlines = $scope.parsedDeadlines;

                project.state = $scope.global.newState;
                project.$addSigned(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };

        $scope.addPaymentInfo = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                var index = project.payments.length;
                if (index === undefined) {
                    project.payment.paymentNumber = 1;
                } else {
                    project.payment.payment_number = project.payments.length + 1;
                }

                project.$addPayment(function (response) {
                    $window.location.reload();
                });
            }

        };

        $scope.addIntReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.state = $scope.global.newState;
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
            }

        };

        $scope.addEndReportState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.state = $scope.global.newState;
                project.end_report.themes = $scope.themeSelection;
                project.end_report.methods = $scope.addedMethods;
                project.end_report.objectives = $scope.objectiveComments;
                project.$addEndReport(function (response) {
                    $location.path('projects/' + response._id);
                });
            }

        };

        $scope.addEndedState = function (isValid) {
            if (isValid) {
                var project = $scope.project;
                project.state = $scope.global.newState;
                project.$addEnded(function (response) {
                    $location.path('projects/' + response._id)
                });
            }

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

        $scope.addRejection = function () {
            $scope.addedRejections.push({rejection: ''});
        };

        $scope.removeRejection = function () {
            $scope.addedRejections.splice(-1, 1);
        };


        $scope.addPlannedPayment = function () {
            $scope.plannedPayments.push({day: '', month: '', year: '', sum_eur: '', sum_local: ''});
        };

        $scope.removePlannedPayment = function () {
            $scope.plannedPayments.splice(-1, 1);
        };

        $scope.addDeadline = function () {
            $scope.deadlines.push({report: '', day: '', month: '', year: ''});
        };

        $scope.removeDeadline = function () {
            $scope.deadlines.splice(-1, 1);
        };


        $scope.addNewOrg = function () {
            $scope.newOrg = true;
            $scope.orgs = null;
        };

        $scope.addOrgFromDb = function () {
            $scope.newOrg = false;
            Organisations.query(function (organisations) {
                $scope.orgs = organisations;
            });

        };

/**
 * Finds project's intermediary report and puts the given report to $scope.report
 * so that report's details can be shown on intreport.html 
 */
        $scope.findIntReport = function () {
            Projects.get({
                projectId: $stateParams.projectId
            }, function (project) {
                $scope.report = project.intermediary_reports[$stateParams.reportId - 1];
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
    }
]);
