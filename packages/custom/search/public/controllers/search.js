'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$q', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $q, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        $scope.fields = [{"name": "state", "fi": "Tila"}, {"name": "region", "fi": "Alue"},
            {"name": "approved.themes", "fi": "Teemat"}]


        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.states = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty', 'allekirjoitettu', 'väliraportti', 'loppuraportti', 'päättynyt'];

        $scope.addedQueries = [];

        /**
         * Creates search query object
         *
         * @returns {JSON} response from server.
         */
        $scope.search = function () {
            Search.searchProjects($scope.addedQueries, function (searchresults) {
                $scope.results = searchresults;
                $scope.getCsvData();
            });
        };

        /**
         * Creates query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.addedQueries.push({});
        };

        $scope.removeQuery = function () {
            $scope.addedQueries.splice(-1, 1);
        };

        $scope.getCsvData = function () {

            $scope.parsedData = [];
            angular.forEach($scope.results, function (obj) {
                var methods = [];
                var dls = [];
                var plpayments = [];
                var payments = [];

                angular.forEach(obj.approved.methods, function (method) {
                    var parsedMethod = method.name + '(' + method.level + ')';
                    methods.push(parsedMethod);
                });

                angular.forEach(obj.signed.intreport_deadlines, function (dl) {
                    var parsedDl = dl.report + ' / ' + dl.date;
                    dls.push(parsedDl);
                });

                angular.forEach(obj.signed.planned_payments, function (payment) {
                    var parsedPmnt = payment.sum_eur + ' (' + payment.date + ')';
                    plpayments.push(parsedPmnt);
                });

                angular.forEach(obj.payments, function (payment) {
                    var parsedPayment = payment.sum_eur + ' (' + payment.payment_date + ')';
                    payments.push(parsedPayment);
                });

                angular.forEach(obj.intermediary_reports, function (report) {

                });

                $q.all(methods, dls, plpayments, payments).then(function () {
                    $scope.parsedData.push({project_ref: obj.project_ref, state: obj.state, title: obj.title,
                        coordinator: obj.coordinator, organisation: obj.organisation.name, description: obj.description,
                        description_en: obj.description_en, duration_months: obj.duration_months, applied_sum_eur: obj.funding.applied_curr_eur,
                        granted_sum: obj.approved.granted_sum_eur, left_eur: obj.funding.left_eur, background: obj.background,
                        gender_aspect: obj.gender_aspect, beneficiaries: obj.beneficiaries, project_goal: obj.project_goal,
                        reporting_evalation: obj.reporting_evaluation, sustainability_risks: obj.sustainability_risks,
                        other_donors_proposed: obj.other_donors_proposed, region: obj.region, dac: obj.dac, in_review_date: obj.in_review.date,
                        in_review_comments: obj.in_review.comments, approved_date: obj.approved.approved_date,
                        approved_by: obj.approved.approved_by, approved_methods: methods, approved_themes: obj.approved.themes,
                        signed_date: obj.signed.signed_date, signed_by: obj.signed.signed_by, intrep_dls: dls, planned_payments: plpayments,
                        rejected_date: obj.rejected.date, rejected_categories: obj.rejected.rejection_categories,
                        rejected_comments: obj.rejected.rejection_comments, payments: payments, end_report_approved_date: obj.end_report.approved_date,
                        end_report_approved_by: obj.end_report.approved_by, audit_date: obj.end_report.audit.date, audit_review: obj.end_report.audit.review,
                        kios_review: obj.end_report.general_review, end_report_comments: obj.end_report.comments, end_report_methods: obj.end_report.methods, 
                        end_report_objective: obj.end_report.objectives
                    });
                });




//ended: obj.ended.date
            });

        };


    }
]);
