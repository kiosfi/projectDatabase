'use strict';

/* jshint -W098 */
angular.module('mean.search').controller('SearchController', ['$scope', '$stateParams',
    '$http', '$window', '$location', '$q', 'Global', 'Search', 'OrgSearch', 'ThemeSearch', 'MeanUser',
    function ($scope, $stateParams, $http, $window, $location, $q, Global, Search, OrgSearch, ThemeSearch, MeanUser) {
        $scope.global = Global;

        $scope.fields = [{"name": "title", "fi": "Nimi"},
            {"name": "coordinator", "fi": "Koordinaattori"},
            {"name": "description", "fi": "Kuvaus"},
            {"name": "description_en", "fi": "Kuvaus (EN)"},
            {"name": "background", "fi": "Hankkeen tausta"},
            {"name": "beneficiaries", "fi": "Hyödynsaajat"},
            {"name": "gender_aspect", "fi": "Gender-näkökulmat"},
            {"name": "project_goal", "fi": "Päätavoite"},
            {"name": "sustainability_risks", "fi": "Kestävyys ja riskit"},
            {"name": "reporting_evaluation", "fi": "Raportointi ja evaluointi"},
            {"name": "other_donors_proposed", "fi": "Muut rahoittajat"},
            {"name": "dac", "fi": "DAC-koodi"},
            {"name": "region", "fi": "Alue"},
            {"name": "in_review.comments", "fi": "Käsittelyvaiheen kommentit"},
            {"name": "approved.themes", "fi": "Teemat"},
            {"name": "rejected.rejection_comments", "fi": "Hylkäyskommentit"},
            {"name": "signed.signed_by", "fi": "Allekirjoittaja"},
            {"name": "end_report.audit.review", "fi": "Tilintarkastuksen arvio"},
            {"name": "end_report.approved_by", "fi": "Loppuraportin hyväksyjä"},
            {"name": "end_report.general_review", "fi": "Loppuraportin KIOSin yleisarvio"},
            {"name": "end_report.objective", "fi": "Loppuraportin arvio tavoitteen toteutumisesta"},
            {"name": "end_report.comments", "fi": "Loppuraportin muut kommentit"},
            {"name": "ended.approved_by", "fi": "Päättämisen hyväksyjä"},
            {"name": "ended.other_comments", "fi": "Päättämisen kommentit"}];

        $scope.stringParams = ["title", "coordinator", "description", "description_en",
            "background", "beneficiaries", "gender_aspect", "project_goal", "sustainability_risk",
            "reporting_evaluation", "other_donors_proposed", "dac", "region", "in_review.comments",
            "rejected.rejection_comments", "signed.signed_by", "end_report.audit.review",
            "end_report.approved_by", "end_report.general_review", "end_report.objective",
            "end_report.comments", "ended.approved_by", "ended.other_comments"];

        $scope.themes = ['Oikeusvaltio ja demokratia', 'TSS-oikeudet', 'Oikeus koskemattomuuteen ja inhimilliseen kohteluun',
            'Naisten oikeudet ja sukupuolten välinen tasa-arvo', 'Lapsen oikeudet',
            'Haavoittuvien ryhmien, dalitien ja vammaisten henkilöiden oikeudet', 'Etniset vähemmistöt ja alkuperäiskansat',
            'LHBTIQ', 'Ihmisoikeuspuolustajat'];

        $scope.states = ['rekisteröity', 'käsittelyssä', 'hyväksytty', 'hylätty', 'allekirjoitettu', 'väliraportti', 'loppuraportti', 'päättynyt'];


        /**
         * Contains the search results.
         */
        $scope.results;

        /**
         * The search array. Consists of objects having the following three
         * fields: <tt>key</tt> for the name of the key to be searched by,
         * </tt>value</tt> for the value to be matched against, and
         * <tt>type</tt> for distinguishing between literal string matches and
         * regular expressions.
         */
        $scope.searchBy = [];

        /**
         * The sorting predicate used in project listing. Initial value is
         * "project_ref".
         */
        $scope.ordering = 'project_ref';

        /**
         * <tt>true</tt> iff the projects will be listed in ascending order.
         */
        $scope.ascending = 'true';

        /**
         * Current page number.
         */
        $scope.page = 1;

        /**
         * The number of projects to be listed on a single page.
         */
        $scope.pageSize = 10;

        /**
         * An array containing JSON objects for pagination.
         */
        $scope.pages;

        /**
         * Performs the search operation. The parameters are fetched from the
         * URL.
         *
         * @returns {JSON} response from server.
         */
        $scope.search = function () {
            var searchBy = $location.search().searchBy;
            var ordering = $location.search().ordering;
            var ascending = $location.search().ascending;
            var page = $location.search().page;
            if (typeof searchBy === 'undefined') {
                $scope.results = [];
                return;
            }
            if (typeof ordering === 'undefined') {
                ordering = 'project_ref';
            }
            if (typeof ascending === 'undefined') {
                ascending = 'true';
            }
            if (typeof page === 'undefined') {
                page = 1;
            }
            $scope.searchBy = JSON.parse(searchBy);
            $scope.ordering = ordering;
            $scope.ascending = ascending;
            $scope.page = page;
//            Search.searchProjects($scope.addedQueries, function (searchresults) {
//                $scope.results = searchresults;
//            });
//            var foo = $scope.searchBy.map(function (x) {
//                var bar = {};
//                bar[x.field] = x.value;
//                return JSON.stringify(bar);
//            })
//            console.log(JSON.stringify(foo));
            Search.query({
                "searchBy": searchBy,
                "ordering": ordering,
                "ascending": ascending,
                "page": page
            }, function (results) {
                $scope.results = results;
            });
        };

        $scope.getResultsForCsv = function () {
            var searchBy = $location.search().searchBy;

            if (typeof searchBy === 'undefined') {
                $scope.global.exportResults = [];
                return;
            }

            $scope.searchBy = JSON.parse(searchBy);

            Search.searchAllProjects({"searchBy": searchBy}, function (results) {
                $scope.global.exportResults = results;
                $location.path('search/export');
            });
        };

        /**
         * Creates query object from each $scope.field/
         * $scope.value pair
         */
        $scope.addQuery = function () {
            $scope.searchBy.push({});
        };

        $scope.removeQuery = function () {
            $scope.searchBy.splice(-1, 1);
        };

        $scope.update = function () {
            $window.location = '/search?searchBy=' + JSON.stringify($scope.searchBy)
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

        $scope.updatePage = function (page) {
            $window.location = '/search?searchBy=' + $scope.searchBy
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + page;
        };

        /**
         * Updates the ordering and reloads the view.
         *
         * @param {String} ordering The ordering predicate (eg. "project_ref").
         */
        $scope.updateOrdering = function (ordering) {
            $window.location = '/search?searchBy=' + $scope.searchBy
                    + '&ordering=' + ordering
                    + '&ascending=' + (ordering === $scope.ordering
                            ? !$scope.ascending : true)
                    + '&page=' + $scope.page;
        };

        /**
         * Updates the search criterion and reloads the view.
         *
         * @param {Array} searchBy Array of JSON objects containing key, value
         * and type information.
         */
        $scope.updateCriterion = function (searchBy) {
            $window.location = '/search?searchBy=' + searchBy
                    + '&ordering=' + $scope.ordering
                    + '&ascending=' + $scope.ascending
                    + '&page=' + $scope.page;
        };

//        /**
//         * Calculates the number of and links to pages and writes the output to
//         * $scope.pages.
//         *
//         * @returns {undefined}
//         */
//        $scope.paginate = function () {
//            Search.countResults(function (result) {
//                var pageCount, numberOfPages, pagination;
//                pageCount = result.projectCount;
//                numberOfPages = Math.ceil(pageCount / $scope.pageSize);
//                pagination = document.getElementById('pagination');
//                $scope.pages = [];
//                for (var i = 1; i <= numberOfPages; ++i) {
//                    $scope.pages.push({number: i});
//                }
//            });
//        };

        $scope.getCsvData = function () {

            $scope.parsedData = [];
            angular.forEach($scope.global.exportResults, function (obj) {
                var methods = [];
                var dls = [];
                var plpayments = [];
                var payments = [];

                var in_review_date;
                var in_review_comments;

                var approved_date;
                var approved_by;
                var granted_sum_eur;
                var themes;
                var methods;

                var signed_date;
                var signed_by;

                var rejected_date;
                var rejection_categories;
                var rejection_comments;

                var end_report_approved_date;
                var end_report_approved_by;
                var audit_date;
                var audit_review;
                var end_report_general_review;
                var end_report_methods;
                var end_report_objective;
                var end_report_comments;

                var ended_end_date;
                var ended_board_notified;
                var ended_approved_by;
                var ended_other_comments;

// Check if project has in_review -details and add them, if not use empty string
                if (typeof obj.in_review === 'undefined') {
                    in_review_date = '';
                    in_review_comments = '';
                }

// Check if project has approved -details and add them, if not use empty string
                if (typeof obj.approved.date === 'undefined') {
                    approved_date = '';
                    approved_by = '';
                    granted_sum_eur = '';
                    themes = '';
                }

// Check if project has signed -details and add them, if not use empty string
                if (typeof obj.signed.date === 'undefined') {
                    signed_date = '';
                    signed_by = '';
                }

// Check if project has rejected -details and add them, if not use empty string
                if (typeof obj.rejected.date === 'undefined') {
                    rejected_date = '';
                    rejection_categories = '';
                    rejection_comments = '';
                }

// Check if project has end_report -details, if not use empty string
                if (typeof obj.end_report.date === 'undefined') {
                    end_report_approved_date = '';
                    end_report_approved_by = '';
                    audit_date = '';
                    audit_review = '';
                    end_report_general_review = '';
                    end_report_methods = '';
                    end_report_objective = '';
                    end_report_comments = '';
                }

                // Check if project has ended -details and add them, if not use empty string
                if (typeof obj.ended === 'undefined') {
                    ended_end_date = '';
                    ended_board_notified = '';
                    ended_approved_by = '';
                    ended_other_comments = '';
                }
                
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

                $q.all(methods, dls, plpayments, payments, in_review_date, in_review_comments, approved_date, approved_by, granted_sum_eur, themes,
                        signed_date, signed_by, rejected_date, rejection_categories, rejection_comments, end_report_approved_date,
                        end_report_approved_by, audit_date, audit_review, end_report_general_review, end_report_methods, end_report_objective,
                        end_report_comments, ended_end_date, ended_board_notified, ended_approved_by, ended_other_comments).then(function () {
                    $scope.parsedData.push({project_ref: obj.project_ref, state: obj.state, title: obj.title,
                        coordinator: obj.coordinator, organisation: obj.organisation.name, description: obj.description,
                        description_en: obj.description_en, duration_months: obj.duration_months, applied_sum_eur: obj.funding.applied_curr_eur,
                        granted_sum: obj.approved.granted_sum_eur, left_eur: obj.funding.left_eur, background: obj.background,
                        gender_aspect: obj.gender_aspect, beneficiaries: obj.beneficiaries, project_goal: obj.project_goal,
                        reporting_evalation: obj.reporting_evaluation, sustainability_risks: obj.sustainability_risks,
                        other_donors_proposed: obj.other_donors_proposed, region: obj.region, dac: obj.dac, in_review_date: in_review_date,
                        in_review_comments: in_review_comments, approved_date: approved_date,
                        approved_by: approved_by, approved_methods: methods, approved_themes: themes,
                        signed_date: signed_date, signed_by: signed_by, intrep_dls: dls, planned_payments: plpayments,
                        rejected_date: rejected_date, rejected_categories: rejection_categories,
                        rejected_comments: rejection_comments, payments: payments, end_report_approved_date: end_report_approved_date,
                        end_report_approved_by: end_report_approved_by, audit_date: audit_date, audit_review: audit_review,
                        kios_review: end_report_general_review, end_report_comments: end_report_comments, end_report_methods: end_report_methods,
                        end_report_objective: end_report_objective, ended_end_date: ended_end_date, ended_board_notified: ended_board_notified,
                        ended_approved_by: ended_approved_by, ended_other_comments: ended_other_comments
                    });
                });
            });
        };
    }
]);
